import React from 'react';
import { Editor, isTextSelection } from '@tiptap/core';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { BubbleMenu } from '@gitee/wysiwyg-editor-react';
import { Bold, Code, Italic, Link, Strike } from './components/items';
import { MenuBarDivider } from './components/MenuBarDivider';

export type TextBubbleMenuProps = {
  editor: Editor;
};

export const TextBubbleMenu: React.FC<TextBubbleMenuProps> = ({ editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, view, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        const hasEditorFocus = view.hasFocus();

        if (
          !hasEditorFocus ||
          empty ||
          isEmptyTextBlock ||
          !editor.isEditable
        ) {
          return false;
        }

        if (
          isActive(editor.state, 'image') ||
          // isActive(editor.state, 'link') ||
          isActive(editor.state, 'codeBlock') ||
          isActive(editor.state, 'table') ||
          isActive(editor.state, 'horizontalRule')
        ) {
          return false;
        }

        return true;
      }}
    >
      <div className="gwe-menu-bar gwe-menu-bar-bubble">
        <Bold />
        <Italic />
        <Strike />
        <Code />
        <MenuBarDivider />
        <Link />
      </div>
    </BubbleMenu>
  );
};
