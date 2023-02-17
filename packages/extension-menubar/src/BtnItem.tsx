import React from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { InsertTableButton } from '@gitee/wysiwyg-editor-extension-table';
import { InsertEmojiButton } from '@gitee/wysiwyg-editor-extension-emoji';
import Tippy from '@tippyjs/react';
import {
  IconBoldBold,
  IconItalicBold,
  IconCodeBold,
  IconListBold,
  IconListNumberBold,
  IconListSquareBold,
  IconImageBold,
  IconChainBold,
  IconTableBold,
  IconCodeSquareBold,
  IconQuoteBold,
  IconLineBold,
  IconStrikethroughBold,
  IconSmileCircleBold,
  IconUndoBold,
  IconRedoBold,
} from '@gitee/icons-react';

import { MenuStatusMap } from './useStatusMap';

const IconMap = {
  undo: IconUndoBold,
  redo: IconRedoBold,
  bold: IconBoldBold,
  italic: IconItalicBold,
  strike: IconStrikethroughBold,
  code: IconCodeBold,
  bulletList: IconListBold,
  orderedList: IconListNumberBold,
  taskList: IconListSquareBold,
  link: IconChainBold,
  image: IconImageBold,
  codeBlock: IconCodeSquareBold,
  blockquote: IconQuoteBold,
  horizontalRule: IconLineBold,
  divider: null,
  table: IconTableBold,
  emoji: IconSmileCircleBold,
};

interface BtnItemProps {
  editor?: Editor | null;
  name: keyof typeof IconMap;
  title?: string;
  onClick?: () => void;
  statusMap: MenuStatusMap;
}

export const BtnItem: React.FC<BtnItemProps> = ({
  editor,
  name,
  title,
  onClick,
  statusMap,
}) => {
  if (!editor) {
    return null;
  }
  if (name === 'divider') {
    return <span className="gwe-menu-bar__divider" />;
  }

  const IconComponent = IconMap[name];
  if (!IconComponent) {
    return null;
  }

  if (name === 'table') {
    return (
      <InsertTableButton
        editor={editor}
        title="表格"
        disabled={statusMap[name]?.disabled || false}
      >
        <button
          className={classNames(
            'gwe-menu-bar__btn',
            statusMap[name].isActive ? `gwe-menu-bar__btn--active` : ''
          )}
          disabled={statusMap[name]?.disabled || false}
        >
          <IconComponent />
        </button>
      </InsertTableButton>
    );
  }

  if (name === 'emoji') {
    return (
      <InsertEmojiButton editor={editor}>
        <div className="gwe-menu-bar__item">
          <button
            className={classNames(
              'gwe-menu-bar__btn',
              statusMap[name]?.isActive ? `gwe-menu-bar__btn--active` : ''
            )}
          >
            <IconComponent />
          </button>
        </div>
      </InsertEmojiButton>
    );
  }

  return (
    <span className="gwe-menu-bar__item">
      <Tippy
        interactive
        content={<div className={'gwe-menu-bar__tooltip'}>{title}</div>}
      >
        <button
          onClick={onClick}
          disabled={statusMap[name]?.disabled || false}
          className={classNames(
            'gwe-menu-bar__btn',
            statusMap[name]?.isActive ? `gwe-menu-bar__btn--active` : ''
          )}
        >
          <IconComponent />
        </button>
      </Tippy>
    </span>
  );
};
