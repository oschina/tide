import React, { useCallback, useRef, useState } from 'react';
import {
  Editor,
  getMarkRange,
  getMarkType,
  isNodeSelection,
  posToDOMRect,
} from '@tiptap/core';
import { isActive } from '@test-pkgs/common';
import { SelectionBubbleMenu } from '@test-pkgs/extension-bubble-menu';
import { Image } from '../image-extension';

export type ImageBubbleMenuProps = {
  editor: Editor;
};

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({ editor }) => {
  const shouldShow = useCallback(() => {
    const show = isActive(editor.state, Image.name);
    if (show) {
      const attrs = editor.getAttributes(Image.name);
    }
    return show;
  }, [editor]);

  return (
    <SelectionBubbleMenu
      pluginKey="imageBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      reference="mark"
      referenceMarkType={Image.name}
      placement="top"
      tippyOptions={{
        getReferenceClientRect: () => {
          const { state, view } = editor;
          const { from, to } = state.selection;

          if (isNodeSelection(state.selection)) {
            const node = view.nodeDOM(from) as HTMLElement;
            const img = node.querySelector('img');
            if (img) {
              return img.getBoundingClientRect();
            }
          }
          return posToDOMRect(view, from, to);
        },
      }}
    >
      <div>
        <button
          onClick={() => {
            editor.chain().updateImageAttr({ align: 'left' }).run();
          }}
        >
          向左
        </button>
        <button
          onClick={() => {
            editor.chain().updateImageAttr({ align: 'center' }).run();
          }}
        >
          居中
        </button>
        <button
          onClick={() => {
            editor.chain().updateImageAttr({ align: 'right' }).run();
          }}
        >
          向右
        </button>
      </div>
    </SelectionBubbleMenu>
  );
};
