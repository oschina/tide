import { findParentNode, getNodeType, isList, RawCommands } from '@tiptap/core';
import { TextSelection, Transaction } from 'prosemirror-state';
import { Fragment, Node, NodeType } from 'prosemirror-model';
import { joinListBackwards, joinListForwards } from '../helpers';

/**
 * Change a bullet/ordered list into a task list or vice versa. These lists use different type of list items,
 * so you need to use this function to not only change the list type but also change the list item type.
 */
function deepChangeListType(
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

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleList: {
      /**
       * Toggle between different list types.
       */
      toggleList: (
        listTypeOrName: string | NodeType,
        itemTypeOrName: string | NodeType
      ) => ReturnType;
    };
  }
}

export const toggleList: RawCommands['toggleList'] =
  (listTypeOrName, itemTypeOrName) =>
  ({ editor, tr, state, dispatch, chain, commands, can }) => {
    const { extensions } = editor.extensionManager;
    const listType = getNodeType(listTypeOrName, state.schema);
    const itemType = getNodeType(itemTypeOrName, state.schema);
    const { selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    const parentList = findParentNode((node) =>
      isList(node.type.name, extensions)
    )(selection);

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      // remove list
      if (parentList.node.type === listType) {
        return commands.liftListItem(itemType);
      }

      // change list type
      if (isList(parentList.node.type.name, extensions) && dispatch) {
        // the list items type is the same, just change the list type
        if (listType.validContent(parentList.node.content)) {
          return chain()
            .command(() => {
              tr.setNodeMarkup(parentList.pos, listType);

              return true;
            })
            .command(() => joinListBackwards(tr, listType))
            .command(() => joinListForwards(tr, listType))
            .run();
        }

        // the list items type is different, change the list items type
        // toggle a bullet/ordered list into a task list or vice versa
        return chain()
          .command(() => deepChangeListType(tr, parentList, listType, itemType))
          .command(() => joinListBackwards(tr, listType))
          .command(() => joinListForwards(tr, listType))
          .run();
      }
    }

    return (
      chain()
        // try to convert node to default node if needed
        .command(() => {
          const canWrapInList = can().wrapInList(listType);

          if (canWrapInList) {
            return true;
          }

          return commands.clearNodes();
        })
        .wrapInList(listType)
        .command(() => joinListBackwards(tr, listType))
        .command(() => joinListForwards(tr, listType))
        .run()
    );
  };
