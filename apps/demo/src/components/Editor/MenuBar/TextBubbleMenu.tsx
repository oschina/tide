import React, { useState, useEffect } from 'react';
import { Editor, isTextSelection } from '@tiptap/core';
import { isActive } from '@test-pkgs/helpers';
import { BubbleMenu } from '@test-pkgs/react';
import useBtnMenus from './useBtnMenus';
import { BtnItem } from './BtnItem';

export type TextBubbleMenuProps = {
  editor: Editor;
};

const TextBubbleMenu: React.FC<TextBubbleMenuProps> = ({ editor }) => {
  const btnMenus = useBtnMenus(editor).filter((i) => i.bubble);
  const [menuBarRefreshKey, setMenuBarRefreshKey] = useState<number>(0);

  useEffect(() => {
    const listener = () => {
      setMenuBarRefreshKey((prev) => prev + 1);
    };
    editor?.on('selectionUpdate', listener);
    editor?.on('update', listener);
    return () => {
      editor?.off('selectionUpdate', listener);
      editor?.off('update', listener);
    };
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
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
      <div key={menuBarRefreshKey} className="gwe-menu-bar gwe-menu-bar-bubble">
        {btnMenus.map((props, index) => (
          <BtnItem key={index} editor={editor} {...props} />
        ))}
      </div>
    </BubbleMenu>
  );
};

export default TextBubbleMenu;
