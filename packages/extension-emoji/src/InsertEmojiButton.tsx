import React from 'react';
import Tippy from '@tippyjs/react';
import { Editor } from '@tiptap/core';
import EmojiPanel from './EmojiPanel';

export const InsertEmojiButton: React.FC<{
  editor: Editor;
  children: React.ReactElement;
}> = ({ editor, children }) => {
  return (
    <Tippy
      content={<EmojiPanel editor={editor} />}
      placement="bottom-start"
      trigger="click"
      interactive
      hideOnClick
    >
      {children}
    </Tippy>
  );
};
