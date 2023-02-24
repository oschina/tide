import { Node, NodeType } from '@tiptap/pm/model';
import { findWrapping } from '@tiptap/pm/transform';
import {
  InputRule,
  InputRuleFinder,
  ExtendedRegExpMatchArray,
  findParentNode,
  isList,
  Extensions,
  callOrReturn,
} from '@tiptap/core';
import { joinListBackwards, joinListForwards } from '../helpers';
import { wrapSelectedItems } from '../utilities/list/list-commands';

/**
 * Build an input rule for automatically wrapping a textblock to
 * another list type when a given string is typed in list block.
 */
export function wrapInListInputRule(config: {
  find: InputRuleFinder;
  listType: NodeType;
  itemType: NodeType;
  extensions: Extensions;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
  joinBefore?: (match: ExtendedRegExpMatchArray, node: Node) => boolean;
  joinAfter?: (match: ExtendedRegExpMatchArray, node: Node) => boolean;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, match, range }) => {
      const { selection, tr } = state;
      const attributes =
        callOrReturn(config.getAttributes, undefined, match) || {};
      const $start = tr.doc.resolve(range.from);
      const blockRange = $start.blockRange();
      const wrapping =
        blockRange && findWrapping(blockRange, config.listType, attributes);

      if (wrapping) {
        return null;
      }

      const parentList = findParentNode((node) =>
        isList(node.type.name, config.extensions)
      )(selection);

      if (!parentList || parentList.node.type === config.listType) {
        return null;
      }

      if (
        wrapSelectedItems({
          listType: config.listType,
          itemType: config.itemType,
          tr,
        })
      ) {
        tr.deleteRange(
          tr.selection.$from.pos - (range.to - range.from),
          tr.selection.$from.pos
        );

        joinListBackwards(
          tr,
          config.joinBefore
            ? (before) => config.joinBefore(match, before)
            : undefined
        );

        joinListForwards(
          tr,
          config.joinAfter
            ? (after) => config.joinAfter(match, after)
            : undefined
        );
      }
    },
  });
}
