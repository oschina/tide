import { Node, NodeType } from 'prosemirror-model';
import { findWrapping } from 'prosemirror-transform';
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
    handler: ({ state, match, range, chain }) => {
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

      return chain()
        .command(({ tr }) =>
          wrapSelectedItems({
            listType: config.listType,
            itemType: config.itemType,
            tr,
          })
        )
        .command(({ tr }) => {
          tr.deleteRange(
            tr.selection.$from.pos - (range.to - range.from),
            tr.selection.$from.pos
          );
          return true;
        })
        .command(({ tr }) =>
          joinListBackwards(
            tr,
            config.joinBefore
              ? (before) => config.joinBefore(match, before)
              : undefined
          )
        )
        .command(({ tr }) =>
          joinListForwards(
            tr,
            config.joinAfter
              ? (after) => config.joinAfter(match, after)
              : undefined
          )
        )
        .run();
    },
  });
}
