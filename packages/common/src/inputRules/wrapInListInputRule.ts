import { Node as ProseMirrorNode, NodeType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { canJoin, findWrapping } from 'prosemirror-transform';
import {
  InputRule,
  InputRuleFinder,
  ExtendedRegExpMatchArray,
  findParentNode,
  isList,
  Extensions,
  callOrReturn,
} from '@tiptap/core';

const joinListBackwards = (
  tr: Transaction,
  listType: NodeType,
  canJoinFn?: (node: ProseMirrorNode) => boolean
): boolean => {
  const list = findParentNode((node) => node.type === listType)(tr.selection);

  if (!list) {
    return true;
  }

  const before = tr.doc.resolve(Math.max(0, list.pos - 1)).before(list.depth);

  if (before === undefined) {
    return true;
  }

  const nodeBefore = tr.doc.nodeAt(before);
  const canJoinBackwards =
    nodeBefore &&
    (!canJoinFn ? list.node.type === nodeBefore.type : canJoinFn(nodeBefore)) &&
    canJoin(tr.doc, list.pos);

  if (!canJoinBackwards) {
    return true;
  }

  tr.join(list.pos);

  return true;
};

const joinListForwards = (
  tr: Transaction,
  listType: NodeType,
  canJoinFn?: (node: ProseMirrorNode) => boolean
): boolean => {
  const list = findParentNode((node) => node.type === listType)(tr.selection);

  if (!list) {
    return true;
  }

  const after = tr.doc.resolve(list.start).after(list.depth);

  if (after === undefined) {
    return true;
  }

  const nodeAfter = tr.doc.nodeAt(after);
  const canJoinForwards =
    nodeAfter &&
    (!canJoinFn ? list.node.type === nodeAfter.type : canJoinFn(nodeAfter)) &&
    canJoin(tr.doc, after);

  if (!canJoinForwards) {
    return true;
  }

  tr.join(after);

  return true;
};

/**
 * Build an input rule for automatically wrapping a textblock to
 * another list type when a given string is typed in list block.
 */
export function wrapInListInputRule(config: {
  find: InputRuleFinder;
  listType: NodeType;
  extensions: Extensions;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
  joinBefore?: (
    match: ExtendedRegExpMatchArray,
    node: ProseMirrorNode
  ) => boolean;
  joinAfter?: (
    match: ExtendedRegExpMatchArray,
    node: ProseMirrorNode
  ) => boolean;
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
        .clearNodes()
        .wrapInList(config.listType, attributes)
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
            config.listType,
            config.joinBefore
              ? (before) => config.joinBefore(match, before)
              : undefined
          )
        )
        .command(({ tr }) =>
          joinListForwards(
            tr,
            config.listType,
            config.joinAfter
              ? (after) => config.joinAfter(match, after)
              : undefined
          )
        )
        .run();
    },
  });
}
