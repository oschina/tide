import React, { useRef } from 'react';
import Tippy from '@tippyjs/react';
import { Editor } from '@tiptap/core';
import EmojiPanel from './EmojiPanel';

export const InsertEmojiButton: React.FC<{
  editor: Editor;
  children: React.ReactElement;
}> = ({ editor, children }) => {
  const ref = useRef(null);
  return (
    <Tippy
      interactive
      content={<div className={'gwe-menu-bar__tooltip'}>Emoji</div>}
    >
      <Tippy
        content={
          <EmojiPanel
            ref={ref}
            editor={editor}
            range={null}
            query=""
            text=""
            items={[]}
            command={null}
            decorationNode={null}
          />
        }
        placement="bottom-end"
        trigger="click"
        interactive
        hideOnClick
        onShow={() => ref?.current?.onShow()}
        maxWidth={null}
      >
        {children}
      </Tippy>
    </Tippy>
  );
};
