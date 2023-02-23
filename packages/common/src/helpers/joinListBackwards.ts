import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Transaction } from '@tiptap/pm/state';
import { canJoin } from '@tiptap/pm/transform';
import { findParentNode } from '@tiptap/core';
import { isList } from './isList';

export const joinListBackwards = (
  tr: Transaction,
  canJoinFn?: (node: ProseMirrorNode) => boolean
): boolean => {
  const list = findParentNode((node) => isList(node.type))(tr.selection);

  if (!list) {
    return false;
  }

  const before = tr.doc.resolve(Math.max(0, list.pos - 1)).before(list.depth);

  if (before === undefined) {
    return false;
  }

  const nodeBefore = tr.doc.nodeAt(before);
  const canJoinBackwards =
    nodeBefore &&
    (!canJoinFn ? list.node.type === nodeBefore.type : canJoinFn(nodeBefore)) &&
    canJoin(tr.doc, list.pos);

  if (!canJoinBackwards) {
    return false;
  }

  tr.join(list.pos);

  return true;
};
