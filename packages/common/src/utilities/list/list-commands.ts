import { CommandProps } from '@tiptap/core';
import {
  Fragment,
  Node,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from '@tiptap/pm/model';
import { Selection, TextSelection, Transaction } from '@tiptap/pm/state';
import { canJoin } from '@tiptap/pm/transform';
import { isList } from '../../helpers/isList';
import { isListItem } from '../../helpers/isListItem';

/**
 * Returns a range that include all selected list items.
 */
export function calculateItemRange(
  selection: Selection
): NodeRange | null | undefined {
  const { $from, $to } = selection;
  return $from.blockRange($to, (node) => isList(node.type));
}

export function maybeJoinList(tr: Transaction, $pos?: ResolvedPos): boolean {
  const $from = $pos || tr.selection.$from;

  let joinable: number[] = [];
  let index: number;
  let parent: Node;
  let before: Node | null | undefined;
  let after: Node | null | undefined;

  for (let depth = $from.depth; depth >= 0; depth--) {
    parent = $from.node(depth);

    // join backward
    index = $from.index(depth);
    before = parent.maybeChild(index - 1);
    after = parent.maybeChild(index);

    if (
      before &&
      after &&
      before.type.name === after.type.name &&
      isList(before.type)
    ) {
      const pos = $from.before(depth + 1);
      joinable.push(pos);
    }

    // join forward
    index = $from.indexAfter(depth);
    before = parent.maybeChild(index - 1);
    after = parent.maybeChild(index);

    if (
      before &&
      after &&
      before.type.name === after.type.name &&
      isList(before.type)
    ) {
      const pos = $from.after(depth + 1);
      joinable.push(pos);
    }
  }

  // sort `joinable` reversely
  joinable = [...new Set(joinable)].sort((a, b) => b - a);
  let updated = false;

  for (const pos of joinable) {
    if (canJoin(tr.doc, pos)) {
      tr.join(pos);
      updated = true;
    }
  }

  return updated;
}

/**
 * Wraps list items in `range` to a list.
 */
function wrapItems({
  listType,
  itemType,
  tr,
  range,
}: {
  listType: NodeType;
  itemType: NodeType;
  tr: Transaction;
  range: NodeRange;
}): boolean {
  const oldList = range.parent;

  // A slice that contains all selected list items
  const slice: Slice = tr.doc.slice(range.start, range.end);

  if (
    oldList.type === listType &&
    slice.content.firstChild?.type === itemType
  ) {
    return false;
  }

  const newItems: Node[] = [];

  for (let i = 0; i < slice.content.childCount; i++) {
    const oldItem = slice.content.child(i);

    if (!itemType.validContent(oldItem.content)) {
      return false;
    }

    const newItem = itemType.createChecked(null, oldItem.content);
    newItems.push(newItem);
  }

  const newList = listType.createChecked(null, newItems);

  tr.replaceRange(
    range.start,
    range.end,
    new Slice(Fragment.from(newList), 0, 0)
  );
  return true;
}

/**
 * Wraps existed list items to a new type of list, which only contains these list items.
 */
export function wrapSelectedItems({
  listType,
  itemType,
  tr,
}: {
  listType: NodeType;
  itemType: NodeType;
  tr: Transaction;
}): boolean {
  const range = calculateItemRange(tr.selection);

  if (!range) {
    return false;
  }

  const atStart = range.startIndex === 0;

  const { from, to } = tr.selection;

  if (!wrapItems({ listType, itemType, tr, range })) {
    return false;
  }

  tr.setSelection(
    TextSelection.between(
      tr.doc.resolve(atStart ? from : from + 2),
      tr.doc.resolve(atStart ? to : to + 2)
    )
  );
  tr.scrollIntoView();

  return true;
}

/**
 * Change a bullet/ordered list into a task list or vice versa. These lists use different type of list items,
 * so you need to use this function to not only change the list type but also change the list item type.
 */
export function deepChangeListType(
  tr: Transaction,
  foundList: {
    pos: number;
    start: number;
    depth: number;
    node: Node;
  },
  listType: NodeType,
  itemType: NodeType
): boolean {
  const oldList = foundList.node;
  const $start = tr.doc.resolve(foundList.start);
  const listParent = $start.node(-1);
  const indexBefore = $start.index(-1);

  if (!listParent) {
    return false;
  }

  if (
    !listParent.canReplace(
      indexBefore,
      indexBefore + 1,
      Fragment.from(listType.create())
    )
  ) {
    return false;
  }

  const newItems: Node[] = [];

  for (let index = 0; index < oldList.childCount; index++) {
    const oldItem = oldList.child(index);

    if (!itemType.validContent(oldItem.content)) {
      return false;
    }

    const newItem = itemType.createChecked(null, oldItem.content);
    newItems.push(newItem);
  }

  const newList = listType.createChecked(null, newItems);

  const start = foundList.pos;
  const end = start + oldList.nodeSize;
  const from = tr.selection.from;

  tr.replaceRangeWith(start, end, newList);
  tr.setSelection(TextSelection.near(tr.doc.resolve(from)));
  return true;
}

/**
 * Wraps selected list items to fit the list type and list item type in the
 * previous list.
 */
export function wrapListBackward(tr: Transaction): boolean {
  const $cursor = tr.selection.$from;
  const range = $cursor.blockRange();

  if (!range || !isListItem(range.parent.type) || range.startIndex !== 0) {
    return false;
  }

  const root = $cursor.node(range.depth - 2); // the node that contains the list
  const itemIndex = $cursor.index(range.depth); // current node is the n-th node in item
  const listIndex = $cursor.index(range.depth - 1); // current item is the n-th item in list
  const rootIndex = $cursor.index(range.depth - 2); // current list is the n-th node in root
  const previousList = root.maybeChild(rootIndex - 1);
  const previousListItem = previousList?.lastChild;

  if (
    // current node must be the first node in its parent list item;
    itemIndex !== 0 ||
    // current list item must be the first list item in its parent list;
    listIndex !== 0
  ) {
    return false;
  }

  if (
    // there is a list before current list;
    previousList &&
    isList(previousList.type) &&
    // we can find the list item type for previousList;
    previousListItem &&
    isListItem(previousListItem.type)
  ) {
    return wrapSelectedItems({
      listType: previousList.type,
      itemType: previousListItem.type,
      tr: tr,
    });
  }

  if (isListItem(root.type)) {
    const parentListItem = root;
    const parentList = $cursor.node(range.depth - 3);

    if (isList(parentList.type)) {
      return wrapSelectedItems({
        listType: parentList.type,
        itemType: parentListItem.type,
        tr: tr,
      });
    }
  }

  return false;
}
