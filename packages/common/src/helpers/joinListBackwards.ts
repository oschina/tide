import { Node as ProseMirrorNode, NodeType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';
import { findParentNode } from '@tiptap/core';

export const joinListBackwards = (
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
