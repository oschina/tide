import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { isActive } from '@test-pkgs/helpers';
import { selectImageUpload } from '@test-pkgs/extension-uploader';
import { InsertTableButton } from '@test-pkgs/extension-table';
import Tippy from '@tippyjs/react';
import { Level } from '@tiptap/extension-heading';

import styles from './MenuBar.module.less';

type MenuBarProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  editor?: Editor | null;
  fullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
};

interface BtnItemProps {
  editor?: Editor | null;
  name: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BtnItem: React.FC<BtnItemProps> = ({
  editor,
  name,
  icon,
  onClick,
  disabled,
}) => {
  if (!editor) {
    return null;
  }
  if (name === 'divider') {
    return <span className={styles['gwe-menu-bar__divider']} />;
  }

  if (name === 'table') {
    return (
      <InsertTableButton editor={editor}>
        <button
          className={classNames(
            styles['gwe-menu-btn'],
            isActive(editor.state, name) ? styles[`gwe-menu-btn--active`] : ''
          )}
          disabled={disabled}
        >
          T
        </button>
      </InsertTableButton>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles['gwe-menu-btn'],
        isActive(editor.state, name) ? styles[`gwe-menu-btn--active`] : ''
      )}
    >
      {icon}
    </button>
  );
};

const MenuBar: React.FC<MenuBarProps> = ({
  className,
  style,
  editor,
  fullscreen,
  onFullscreenChange,
}) => {
  const [menuBarRefreshKey, setMenuBarRefreshKey] = useState<number>(0);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const listener = () => {
      setMenuBarRefreshKey((prev) => prev + 1);
    };
    editor?.on('selectionUpdate', listener);
    return () => {
      editor?.off('selectionUpdate', listener);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const heads: Level[] = [1, 2, 3, 4, 5, 6];

  const btnMenus = [
    {
      name: 'bold',
      icon: 'B',
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor?.can().chain().focus().toggleBold().run(),
    },
    {
      name: 'italic',
      icon: 'I',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor?.can().chain().focus().toggleItalic().run(),
    },
    {
      name: 'strike',
      icon: 'S',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor?.can().chain().focus().toggleStrike().run(),
    },
    {
      name: 'code',
      icon: 'C',
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor?.can().chain().focus().toggleCode().run(),
    },
    {
      name: 'divider',
    },
    {
      name: 'bulletList',
      icon: 'bl',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: !editor.can().chain().focus().toggleBulletList().run(),
    },
    {
      name: 'orderedList',
      icon: 'ol',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
    },
    {
      name: 'taskList',
      icon: 'tl',
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      disabled: !editor.can().chain().focus().toggleTaskList().run(),
    },
    {
      name: 'divider',
    },
    {
      name: 'link',
      icon: 'lin',
      onClick: () => editor.chain().focus().toggleLink({ href: '' }).run(),
      // TODO: link disabled (code block)
      disabled: !editor.can().chain().focus().toggleMark('link').run(),
    },
    {
      name: 'image',
      icon: 'img',
      onClick: () => selectImageUpload(editor),
      disabled: !editor.can().chain().focus().uploadImage([]).run(),
    },
    {
      name: 'table',
      disabled: !editor.can().chain().focus().insertTable().run(),
    },
    {
      name: 'codeBlock',
      icon: 'cb',
      onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
      disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
    },
    {
      name: 'divider',
    },
    {
      name: 'blockquote',
      icon: '“',
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      disabled: !editor.can().chain().focus().toggleBlockquote().run(),
    },
    {
      name: 'horizontalRule',
      icon: '—',
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
      disabled: !editor.can().chain().focus().setHorizontalRule().run(),
    },
    {
      name: 'divider',
    },
  ];

  const getHeadingText = () => {
    if (isActive(editor.state, 'paragraph')) {
      return '正文';
    }
    const activeLevel = heads.find((level) =>
      isActive(editor.state, 'heading', { level })
    );
    if (activeLevel) {
      return `标题${activeLevel}`;
    }

    return '正文';
  };

  return (
    <div
      key={menuBarRefreshKey}
      className={classNames(styles['gwe-menu-bar'], className)}
      style={style}
    >
      <div>
        <Tippy
          offset={[0, 4]}
          placement="bottom-start"
          interactive
          onClickOutside={() => setHeadVisible(false)}
          visible={headVisible}
          content={
            <ul className={styles['gwe-dropdown-menu']}>
              <li
                onClick={() => {
                  if (!editor.can().chain().focus().setParagraph().run()) {
                    return false;
                  }
                  editor.chain().focus().setParagraph().run();
                  setHeadVisible(false);
                }}
                className={classNames(
                  styles['gwe-dropdown-menu__item'],
                  isActive(editor.state, 'paragraph')
                    ? styles['gwe-dropdown-menu__item--active']
                    : ''
                )}
              >
                <div className={classNames(styles['gwe-menu-head-row'])}>
                  <span>正文</span>
                  <span className={styles[`gwe-menu-head-row__span`]}>
                    Ctrl Alt 0
                  </span>
                </div>
              </li>
              {heads.map((level) => (
                <li
                  key={level}
                  onClick={() => {
                    if (
                      !editor
                        .can()
                        .chain()
                        .focus()
                        .toggleHeading({ level })
                        .run()
                    ) {
                      return false;
                    }
                    editor.chain().focus().toggleHeading({ level }).run();
                    setHeadVisible(false);
                  }}
                  className={classNames(
                    styles['gwe-dropdown-menu__item'],
                    isActive(editor.state, 'heading', { level })
                      ? styles['gwe-dropdown-menu__item--active']
                      : '',
                    !editor.can().chain().focus().toggleHeading({ level }).run()
                      ? styles['gwe-dropdown-menu__item--disabled']
                      : ''
                  )}
                >
                  <div className={classNames(styles['gwe-menu-head-row'])}>
                    <span
                      className={
                        styles[`gwe-menu-head-row__title--level${level}`]
                      }
                    >
                      标题{level}
                    </span>
                    <span className={styles[`gwe-menu-head-row__span`]}>
                      Ctrl Alt {level}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          }
        >
          <div
            className={styles['gwe-dropdown-trigger']}
            onClick={() => setHeadVisible(!headVisible)}
          >
            <span className={styles['gwe-dropdown-trigger__text']}>
              {getHeadingText()}
            </span>
            <span className={styles['gwe-dropdown-trigger__icon']}>V</span>
          </div>
        </Tippy>
      </div>

      {btnMenus.map((props, index) => (
        <BtnItem key={index} editor={editor} {...props} />
      ))}

      <button
        onClick={() => onFullscreenChange?.(!fullscreen)}
        className={classNames(
          styles['gwe-menu-btn'],
          fullscreen ? styles[`gwe-menu-btn--active`] : ''
        )}
      >
        full
      </button>
    </div>
  );
};

export default MenuBar;
