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
      interactive
      content={<div className={'gwe-menu-bar__tooltip'}>Emoji</div>}
    >
      <Tippy
        content={
          <EmojiPanel
            editor={editor}
            range={null}
            query=""
            text=""
            items={[]}
            command={null}
            decorationNode={null}
          />
        }
        placement="bottom-start"
        trigger="click"
        interactive
        hideOnClick
      >
        {children}
      </Tippy>
    </Tippy>
  );
};
