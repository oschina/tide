import React, { useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { SelectionBubbleMenu } from '@gitee/wysiwyg-editor-extension-bubble-menu';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { showLinkEditPopup } from './LinkEditPopup';
import { Link as LinkExtension } from '../link';
import { IconEdit, IconTrash } from '@gitee/icons-react';
export type LinkBubbleMenuProps = {
  editor: Editor;
};

export const LinkBubbleMenu: React.FC<LinkBubbleMenuProps> = ({ editor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [href, setHref] = useState<string>('');
  const [target, setTarget] = useState<string>('');

  const shouldShow = useCallback(() => {
    const show = isActive(editor.state, LinkExtension.name);
    if (show) {
      const attrs = editor.getAttributes(LinkExtension.name);
      setHref(attrs.href || '');
      setTarget(attrs.target || '');
    } else {
      setHref('');
      setTarget('');
    }
    return show;
  }, [editor]);

  const openLink = useCallback(() => window.open(href, '_blank'), [href]);

  const openLinkEditPopup = useCallback(() => {
    editor.chain().blur().focus().run();
    showLinkEditPopup(editor);
  }, [editor]);

  // 移除链接
  const unsetLink = useCallback(() => {
    const { empty } = editor.view.state.selection;
    if (empty) {
      // 无选区: 移除光标所在的 node 的链接 (连续多个相同链接的 node 会被一起移除链接)
      const attrs = editor.getAttributes(LinkExtension.name);
      editor
        .chain()
        .extendMarkRange(LinkExtension.name, attrs)
        .unsetLink()
        .run();
    } else {
      // 有选区: 移除对应区域的链接 (如果选区在 node 内部 或 跨多个 node, 将自动拆开)
      editor.chain().unsetLink().run();
    }
  }, [editor]);

  return (
    <SelectionBubbleMenu
      pluginKey="linkBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      reference="mark"
      referenceMarkType={LinkExtension.name}
      placement="bottom-start"
    >
      <div ref={containerRef} className="gwe-menu-bar gwe-menu-bar-bubble">
        <span className="gwe-menu-bar-bubble__link">
          <a href={href} target={target} rel="noopener noreferrer nofollow">
            {href}
          </a>
        </span>
        {/* <button  onClick={openLink}>访问</button> */}
        <button
          className="gwe-menu-bar__btn gwe-menu-bar__item"
          onClick={openLinkEditPopup}
        >
          <IconEdit />
        </button>
        <button
          className="gwe-menu-bar__btn gwe-menu-bar__item"
          onClick={unsetLink}
        >
          <IconTrash />
        </button>
      </div>
    </SelectionBubbleMenu>
  );
};
