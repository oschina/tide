import React, { useState, useEffect } from 'react';
import { Editor, isTextSelection } from '@tiptap/core';
import { isActive } from '@test-pkgs/common';
import { BubbleMenu } from '@test-pkgs/react';
import useBtnMenus from './useBtnMenus';
import { BtnItem } from './BtnItem';
import { useStatusMap } from './useStatusMap';

export type TextBubbleMenuProps = {
  editor: Editor;
};

const TextBubbleMenu: React.FC<TextBubbleMenuProps> = ({ editor }) => {
  const btnMenus = useBtnMenus(editor).filter((i) => i.bubble);
  const { statusMap, updateStatusMap } = useStatusMap(editor);

  useEffect(() => {
    const listener = () => {
      updateStatusMap();
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
      <div className="gwe-menu-bar gwe-menu-bar-bubble">
        {btnMenus.map((props, index) => (
          <BtnItem
            key={index}
            editor={editor}
            statusMap={statusMap}
            {...props}
          />
        ))}
      </div>
    </BubbleMenu>
  );
};

export default TextBubbleMenu;
