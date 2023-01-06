import { isNodeActive } from '@tiptap/core';
import type { EditorState } from 'prosemirror-state';
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
    return isNodeActive(state, name, attributes);
  }

  if (state.schema.marks[name]) {
    return isMarkActive(state, name, attributes);
  }

  return false;
}
