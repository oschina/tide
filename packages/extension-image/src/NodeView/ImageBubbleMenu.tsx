import React, { useCallback } from 'react';
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { SelectionBubbleMenu } from '@gitee/wysiwyg-editor-react';
import Tippy from '@tippyjs/react';
import {
  IconAlignCenterBold,
  IconAlignRightBold,
  IconAlignLeftBold,
} from '@gitee/icons-react';
import { Image } from '../image-extension';

export type ImageBubbleMenuProps = {
  editor: Editor;
};

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({ editor }) => {
  const shouldShow = useCallback(() => {
    const show = isActive(editor.state, Image.name);
    return show && editor.isEditable;
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
      <div className="gwe-menu-bar gwe-menu-bar-bubble">
        <Tippy
          interactive
          content={<div className={'gwe-menu-bar__tooltip'}>居左</div>}
        >
          <button
            className="gwe-menu-bar__btn gwe-menu-bar__item"
            onClick={() => {
              editor.chain().updateImageAttr({ align: 'left' }).run();
            }}
          >
            <IconAlignLeftBold />
          </button>
        </Tippy>
        <Tippy
          interactive
          content={<div className={'gwe-menu-bar__tooltip'}>居中</div>}
        >
          <button
            className="gwe-menu-bar__btn gwe-menu-bar__item"
            onClick={() => {
              editor.chain().updateImageAttr({ align: 'center' }).run();
            }}
          >
            <IconAlignCenterBold />
          </button>
        </Tippy>
        <Tippy
          interactive
          content={<div className={'gwe-menu-bar__tooltip'}>居右</div>}
        >
          <button
            className="gwe-menu-bar__btn gwe-menu-bar__item"
            onClick={() => {
              editor.chain().updateImageAttr({ align: 'right' }).run();
            }}
          >
            <IconAlignRightBold />
          </button>
        </Tippy>
      </div>
    </SelectionBubbleMenu>
  );
};
