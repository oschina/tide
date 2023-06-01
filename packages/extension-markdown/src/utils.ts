import { EditorState } from '@tiptap/pm/state';
import { isMarkActive, isNodeActive } from '@tiptap/core';

export const isInCode = (state: EditorState): boolean => {
  return (
    (state.schema.nodes.codeBlock && isNodeActive(state, 'codeBlock')) ||
    (state.schema.marks.code && isMarkActive(state, 'code'))
  );
};

export const isMarkdown = (text: string): boolean => {
  // code-block-ish
  const fences = text.match(/^```/gm);
  if (fences && fences.length > 1) return true;

  // link-ish
  if (text.match(/\[[^]+]\(https?:\/\/\S+\)/gm)) return true;
  if (text.match(/\[[^]+]\(\/\S+\)/gm)) return true;

  // heading-ish
  if (text.match(/^#{1,6}\s+\S+/gm)) return true;

  // list-ish
  const listItems = text.match(/^\s*[\d-*]\s+\S+/gm);
  if (listItems && listItems.length > 1) return true;

  // task-list-ish
  const taskListItems = text.match(/^\s*[-*]\s\[[ xX]\]\s+\S+/gm);
  if (taskListItems && taskListItems.length > 1) return true;

  // blockquote-ish
  if (text.match(/^>\s+\S+/gm)) return true;

  // hr-ish
  if (text.match(/^---/gm)) return true;

  // image-ish
  if (text.match(/^!\[[^]+]\(https?:\/\/\S+\)/gm)) return true;

  // table-ish
  if (text.match(/^\|.*\|$/gm)) return true;

  // strong-ish
  if (text.match(/\*\*[^]+?\*\*/gm)) return true;

  // em-ish
  if (text.match(/_[^]+?_/gm)) return true;

  // strikethrough-ish
  if (text.match(/~~[^]+?~~/gm)) return true;

  // inline code-ish
  if (text.match(/`[^]+?`/gm)) return true;

  return false;
};
