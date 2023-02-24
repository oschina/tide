import { findParentNode, isNodeActive } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import { isList } from './isList';
import { isMarkActive } from './isMarkActive';

export function isActive(
  state: EditorState,
  name: string | null,
  attributes: Record<string, any> = {}
): boolean {
  if (!name) {
    return (
      isNodeActive(state, null, attributes) ||
      isMarkActive(state, null, attributes)
    );
  }

  if (state.schema.nodes[name]) {
    // nested lists of different types
    const isListNode = isList(state.schema.nodes[name]);
    if (isListNode) {
      const parentList = findParentNode((node) => isList(node.type))(
        state.selection
      );
      return parentList && parentList.node.type.name === name;
    }

    return isNodeActive(state, name, attributes);
  }

  if (state.schema.marks[name]) {
    return isMarkActive(state, name, attributes);
  }

  return false;
}
