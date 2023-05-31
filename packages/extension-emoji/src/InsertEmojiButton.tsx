import React, { cloneElement, forwardRef, useRef } from 'react';
import Tippy from '@tippyjs/react';
import { Editor } from '@tiptap/core';
import EmojiPanel from './EmojiPanel';

export type InsertEmojiButtonProps = {
  editor: Editor;
  children: React.ReactElement;
};

export const InsertEmojiButton = forwardRef<
  HTMLElement,
  InsertEmojiButtonProps
>(({ editor, children }, ref) => {
  const emojiPanelRef = useRef(null);
  return (
    <Tippy
      content={
        <EmojiPanel
          ref={emojiPanelRef}
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
      onShow={() => emojiPanelRef.current?.onShow()}
      maxWidth={null}
    >
      {cloneElement(children, {
        ref,
      })}
    </Tippy>
  );
});

InsertEmojiButton.displayName = 'InsertEmojiButton';
