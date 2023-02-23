import { Transaction } from '@tiptap/pm/state';
import {
  Fragment,
  Node,
  NodeRange,
  ResolvedPos,
  Slice,
} from '@tiptap/pm/model';
import { liftTarget, ReplaceAroundStep } from '@tiptap/pm/transform';
import { isList } from '../../helpers/isList';
import { isListItem } from '../../helpers/isListItem';
import {
  calculateItemRange,
  maybeJoinList,
  wrapSelectedItems,
} from './list-commands';

function findParentItem($from: ResolvedPos, range: NodeRange) {
  const parentItem = $from.node(range.depth - 1);
  const parentList = $from.node(range.depth - 2);

  if (!isListItem(parentItem.type) || !isList(parentList.type)) {
    return false;
  }

  return { parentItem, parentList };
}

function indentSiblingsOfItems(tr: Transaction, range: NodeRange): NodeRange {
  const selectedList = range.parent;
  const lastSelectedItem = range.parent.child(range.endIndex - 1);

  const endOfRange = range.end;
  const endOfSelectedList = range.$to.end(range.depth);

  if (endOfRange < endOfSelectedList) {
    // There are sibling items after the selected items, which must become
    // children of the last item
    tr.step(
      new ReplaceAroundStep(
        endOfRange - 1,
        endOfSelectedList,
        endOfRange,
        endOfSelectedList,
        new Slice(
          Fragment.from(
            lastSelectedItem.type.create(null, selectedList.copy())
          ),
          1,
          0
        ),
        1,
        true
      )
    );
    return new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfSelectedList),
      range.depth
    );
  }

  return range;
}

function indentSiblingsOfList(tr: Transaction, range: NodeRange): NodeRange {
  const selectedList = range.parent;
  const lastSelectedItem = range.parent.child(range.endIndex - 1);

  const endOfSelectedList = range.end;
  const endOfParentListItem = range.$to.end(range.depth - 1);

  if (endOfSelectedList + 1 < endOfParentListItem) {
    // There are sibling nodes after the selected list, which must become
    // children of the last item
    tr.step(
      new ReplaceAroundStep(
        endOfSelectedList - 1,
        endOfParentListItem,
        endOfSelectedList + 1,
        endOfParentListItem,
        new Slice(
          Fragment.from(
            selectedList.type.create(null, lastSelectedItem.type.create(null))
          ),
          2,
          0
        ),
        0,
        true
      )
    );
    return new NodeRange(tr.selection.$from, tr.selection.$to, range.depth);
  }

  return range;
}

function changeItemsType(
  tr: Transaction,
  range: NodeRange,
  parentList: Node,
  parentItem: Node
) {
  const wrapped = wrapSelectedItems({
    listType: parentList.type,
    itemType: parentItem.type,
    tr,
  });

  if (wrapped) {
    return new NodeRange(tr.selection.$from, tr.selection.$to, range.depth);
  }

  return range;
}

/**
 * A helper function to dedent selected list items.
 *
 * @beta
 */
export function dedentList(tr: Transaction): boolean {
  let range = calculateItemRange(tr.selection);

  // debugger;
  if (!range) {
    return false;
  }

  const findParentItemResult = findParentItem(tr.selection.$from, range);

  if (!findParentItemResult) {
    // Outer list node

    const list = range.parent;

    // Merge the list items into a single big item
    for (
      let pos = range.end, i = range.endIndex - 1, e = range.startIndex;
      i > e;
      i--
    ) {
      pos -= list.child(i).nodeSize;
      tr.delete(pos - 1, pos + 1);
    }

    const $start = tr.doc.resolve(range.start),
      item = $start.nodeAfter!;
    if (tr.mapping.map(range.end) != range.start + $start.nodeAfter!.nodeSize) {
      return false;
    }
    const atStart = range.startIndex == 0,
      atEnd = range.endIndex == list.childCount;
    const parent = $start.node(-1),
      indexBefore = $start.index(-1);
    if (
      !parent.canReplace(
        indexBefore + (atStart ? 0 : 1),
        indexBefore + 1,
        item.content.append(atEnd ? Fragment.empty : Fragment.from(list))
      )
    ) {
      return false;
    }
    const start = $start.pos,
      end = start + item.nodeSize;
    // Strip off the surrounding list. At the sides where we're not at
    // the end of the list, the existing list is closed. At sides where
    // this is the end, it is overwritten to its end.
    tr.step(
      new ReplaceAroundStep(
        start - (atStart ? 1 : 0),
        end + (atEnd ? 1 : 0),
        start + 1,
        end - 1,
        new Slice(
          (atStart
            ? Fragment.empty
            : Fragment.from(list.copy(Fragment.empty))
          ).append(
            atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))
          ),
          atStart ? 0 : 1,
          atEnd ? 0 : 1
        ),
        atStart ? 0 : 1
      )
    );
    return true;
  }

  // Inside a parent list

  const { parentItem, parentList } = findParentItemResult;

  range = indentSiblingsOfItems(tr, range);
  range = indentSiblingsOfList(tr, range);
  range = changeItemsType(tr, range, parentList, parentItem);

  const target = liftTarget(range);

  if (typeof target !== 'number') {
    return true;
  }

  tr.lift(range, target);

  range = calculateItemRange(tr.selection);

  if (range) {
    maybeJoinList(tr, tr.doc.resolve(range.end - 2));
  }

  return true;
}
