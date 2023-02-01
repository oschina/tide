import React from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { isActive } from '@test-pkgs/common';
import { InsertTableButton } from '@test-pkgs/extension-table';
import { InsertEmojiButton } from '@test-pkgs/extension-emoji';
import Tippy from '@tippyjs/react';

interface BtnItemProps {
  editor?: Editor | null;
  name: string;
  icon?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const BtnItem: React.FC<BtnItemProps> = ({
  editor,
  name,
  icon,
  title,
  onClick,
  disabled,
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
            isActive(editor.state, name) ? `gwe-menu-bar__btn--active` : ''
          )}
          disabled={disabled}
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
            isActive(editor.state, name) ? `gwe-menu-bar__btn--active` : ''
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
          disabled={disabled}
          className={classNames(
            'gwe-menu-bar__btn',
            isActive(editor.state, name) ? `gwe-menu-bar__btn--active` : ''
          )}
        >
          {icon}
        </button>
      </Tippy>
    </div>
  );
};
