import { Node as ProseMirrorNode, NodeType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';
import { findParentNode } from '@tiptap/core';

export const joinListForwards = (
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
