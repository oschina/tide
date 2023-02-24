import { findParentNode, getNodeType, isList, RawCommands } from '@tiptap/core';
import { joinListBackwards, joinListForwards } from '../helpers';
import { deepChangeListType } from '../utilities/list/list-commands';

export const toggleList: RawCommands['toggleList'] =
  (listTypeOrName, itemTypeOrName) =>
  ({ editor, tr, state, chain, commands, can }) => {
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
      if (isList(parentList.node.type.name, extensions)) {
        // the list items type is the same, just change the list type
        if (listType.validContent(parentList.node.content)) {
          tr.setNodeMarkup(parentList.pos, listType);
          joinListBackwards(tr);
          joinListForwards(tr);
          return true;
        }

        // the list items type is different, change the list items type
        // toggle a bullet/ordered list into a task list or vice versa
        const callback = deepChangeListType(tr, parentList, listType, itemType);
        if (!callback) {
          return false;
        }
        joinListBackwards(tr);
        joinListForwards(tr);
        return true;
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
        .command(() => {
          joinListBackwards(tr);
          return true;
        })
        .command(() => {
          joinListForwards(tr);
          return true;
        })
        .run()
    );
  };
