import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Transaction } from '@tiptap/pm/state';
import { canJoin } from '@tiptap/pm/transform';
import { findParentNode } from '@tiptap/core';
import { isList } from './isList';

export const joinListForwards = (
  tr: Transaction,
  canJoinFn?: (node: ProseMirrorNode) => boolean
): boolean => {
  const list = findParentNode((node) => isList(node.type))(tr.selection);

  if (!list) {
    return false;
  }

  const after = tr.doc.resolve(list.start).after(list.depth);

  if (after === undefined) {
    return false;
  }

  const nodeAfter = tr.doc.nodeAt(after);
  const canJoinForwards =
    nodeAfter &&
    (!canJoinFn ? list.node.type === nodeAfter.type : canJoinFn(nodeAfter)) &&
    canJoin(tr.doc, after);

  if (!canJoinForwards) {
    return false;
  }

  tr.join(after);

  return true;
};
