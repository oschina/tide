import React, { useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { SelectionBubbleMenu } from '@test-pkgs/extension-bubble-menu';
import { isActive } from '@test-pkgs/helpers';
import { showLinkEditPopup } from './LinkEditPopup';
import { Link as LinkExtension } from '../link';
import styles from './LinkBubbleMenu.module.less';

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

  const unsetLink = useCallback(
    () => editor.chain().extendMarkRange(LinkExtension.name).unsetLink().run(),
    [editor]
  );

  return (
    <SelectionBubbleMenu
      pluginKey="linkBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      reference="mark"
      referenceMarkType={LinkExtension.name}
      placement="bottom-start"
    >
      <div ref={containerRef} className={styles['link-bubble-menu']}>
        <span className={styles.link}>
          <a href={href} target={target} rel="noopener noreferrer nofollow">
            {href}
          </a>
        </span>
        <button onClick={openLink}>访问</button>
        <button onClick={openLinkEditPopup}>编辑</button>
        <button onClick={unsetLink}>移除</button>
      </div>
    </SelectionBubbleMenu>
  );
};
