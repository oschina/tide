import React from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { InsertTableButton } from '@test-pkgs/extension-table';
import { InsertEmojiButton } from '@test-pkgs/extension-emoji';
import Tippy from '@tippyjs/react';
import { IconTableSquare, IconSmileCircle } from '@gitee/icons-react';
import {
  IconBoldBold,
  IconItalicBold,
  IconCode,
  IconList,
  IconXmark,
  IconImage,
  IconChain,
  IconListNumberBold,
  IconTask,
  IconRepo,
  IconQuoteBold,
  IconMinus,
} from '@gitee/icons-react';

import { MenuStatusMap } from './useStatusMap';

const IconMap = {
  bold: IconBoldBold,
  italic: IconItalicBold,
  strike: IconXmark,
  code: IconCode,
  bulletList: IconList,
  orderedList: IconListNumberBold,
  taskList: IconTask,
  link: IconChain,
  image: IconImage,
  codeBlock: IconRepo,
  blockquote: IconQuoteBold,
  horizontalRule: IconMinus,
  divider: null,
  table: IconTableSquare,
  emoji: IconSmileCircle,
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
    return <span className={'gwe-menu-bar__divider'} />;
  }

  const IconComponent = IconMap[name];
  if (!IconComponent) {
    return null;
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
          <IconComponent />
        </button>
      </Tippy>
    </div>
  );
};
