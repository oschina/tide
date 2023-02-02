import React from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { InsertTableButton } from '@test-pkgs/extension-table';
import { InsertEmojiButton } from '@test-pkgs/extension-emoji';
import Tippy from '@tippyjs/react';
import { MenuStatusMap, menuKey } from './useStatusMap';

interface BtnItemProps {
  editor?: Editor | null;
  name: menuKey | 'divider';
  icon?: string;
  title?: string;
  onClick?: () => void;
  statusMap: MenuStatusMap;
}

export const BtnItem: React.FC<BtnItemProps> = ({
  editor,
  name,
  icon,
  title,
  onClick,
  statusMap,
}) => {
  if (!editor) {
    return null;
  }
  if (name === 'divider') {
    return <span className={'gwe-menu-bar__divider'} />;
  }

  if (name === 'table') {
    return (
      <InsertTableButton editor={editor}>
        <button
          className={classNames(
            'gwe-menu-bar__btn',
            statusMap[name].isActive ? `gwe-menu-bar__btn--active` : ''
          )}
          disabled={statusMap[name]?.disabled || false}
        >
          T
        </button>
      </InsertTableButton>
    );
  }

  if (name === 'emoji') {
    return (
      <InsertEmojiButton editor={editor}>
        <button
          className={classNames(
            'gwe-menu-bar__btn',
            statusMap[name]?.isActive ? `gwe-menu-bar__btn--active` : ''
          )}
        >
          😃
        </button>
      </InsertEmojiButton>
    );
  }

  return (
    <div className="gwe-menu-bar__item">
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
          {icon}
        </button>
      </Tippy>
    </div>
  );
};
