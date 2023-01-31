import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { isActive } from '@test-pkgs/helpers';
import { selectImageUpload } from '@test-pkgs/extension-uploader';
import { InsertTableButton } from '@test-pkgs/extension-table';
import Tippy from '@tippyjs/react';
import { Level } from '@tiptap/extension-heading';

import './MenuBar.less';

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
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BtnItem: React.FC<BtnItemProps> = ({
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

  const btnMenus = useMemo(
    () => [
      {
        name: 'bold',
        icon: 'B',
        title: '加粗 (Ctrl + B)',
        onClickName: 'toggleBold',
        onClick: () => {
          editor.chain().focus().toggleBold().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor?.can().chain().focus().toggleBold().run(),
      },
      {
        name: 'italic',
        icon: 'I',
        title: '斜体 (Ctrl + I)',
        onClick: () => {
          editor.chain().focus().toggleItalic().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor?.can().chain().focus().toggleItalic().run(),
      },
      {
        name: 'strike',
        icon: 'S',
        title: '删除线 (Ctrl + Shift + X)',
        onClick: () => {
          editor.chain().focus().toggleStrike().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor?.can().chain().focus().toggleStrike().run(),
      },
      {
        name: 'code',
        icon: 'C',
        title: '行内代码',
        onClick: () => {
          editor.chain().focus().toggleCode().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor?.can().chain().focus().toggleCode().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'bulletList',
        icon: 'bl',
        title: '无序列表 (Ctrl + Shift + 8)',
        onClick: () => {
          editor.chain().focus().toggleBulletList().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().toggleBulletList().run(),
      },
      {
        name: 'orderedList',
        icon: 'ol',
        title: '有序列表 (Ctrl + Shift + 7)',
        onClick: () => {
          editor.chain().focus().toggleOrderedList().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().toggleOrderedList().run(),
      },
      {
        name: 'taskList',
        icon: 'tl',
        title: '任务列表 (Ctrl + Shift + 9)',
        onClick: () => {
          editor.chain().focus().toggleTaskList().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().toggleTaskList().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'link',
        icon: 'lin',
        title: '链接 (Ctrl + K)',
        onClick: () => {
          editor.chain().focus().toggleLink({ href: '' }).run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        // TODO: link disabled (code block)
        disabled: !editor.can().chain().focus().toggleMark('link').run(),
      },
      {
        name: 'image',
        icon: 'img',
        title: '图片',
        onClick: () => {
          selectImageUpload(editor);
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().uploadImage([]).run(),
      },
      {
        name: 'table',
        title: 'Table',
        disabled: !editor.can().chain().focus().insertTable().run(),
      },
      {
        name: 'codeBlock',
        icon: 'cb',
        title: '代码块',
        onClick: () => {
          editor?.chain().focus().toggleCodeBlock().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'blockquote',
        icon: '“',
        title: '引用 (Ctrl + Shift + >)',
        onClick: () => {
          editor?.chain().focus().toggleBlockquote().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().toggleBlockquote().run(),
      },
      {
        name: 'horizontalRule',
        icon: '—',
        title: '分割线 (Ctrl + Alt + S)',
        onClick: () => {
          editor?.chain().focus().setHorizontalRule().run();
          setMenuBarRefreshKey((prev) => prev + 1);
        },
        disabled: !editor.can().chain().focus().setHorizontalRule().run(),
      },
      {
        name: 'divider',
      },
    ],
    [menuBarRefreshKey, setMenuBarRefreshKey]
  );

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
      className={classNames('gwe-menu-bar', className)}
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
            <ul className={'gwe-dropdown-menu'}>
              <li
                onClick={() => {
                  if (!editor.can().chain().focus().setParagraph().run()) {
                    return false;
                  }
                  editor.chain().focus().setParagraph().run();
                  setHeadVisible(false);
                }}
                className={classNames(
                  'gwe-dropdown-menu__item',
                  isActive(editor.state, 'paragraph')
                    ? 'gwe-dropdown-menu__item--active'
                    : ''
                )}
              >
                <div className={classNames('gwe-menu-head-row')}>
                  <span>正文</span>
                  <span className={`gwe-menu-head-row__span`}>Ctrl Alt 0</span>
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
                    'gwe-dropdown-menu__item',
                    isActive(editor.state, 'heading', { level })
                      ? 'gwe-dropdown-menu__item--active'
                      : '',
                    !editor.can().chain().focus().toggleHeading({ level }).run()
                      ? 'gwe-dropdown-menu__item--disabled'
                      : ''
                  )}
                >
                  <div className={classNames('gwe-menu-head-row')}>
                    <span className={`gwe-menu-head-row__title--level${level}`}>
                      标题{level}
                    </span>
                    <span className={`gwe-menu-head-row__span`}>
                      Ctrl Alt {level}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          }
        >
          <div
            className={'gwe-dropdown-trigger'}
            onClick={() => setHeadVisible(!headVisible)}
          >
            <span className={'gwe-dropdown-trigger__text'}>
              {getHeadingText()}
            </span>
            <span className={'gwe-dropdown-trigger__icon'}>v</span>
          </div>
        </Tippy>
      </div>

      {btnMenus.map((props, index) => (
        <BtnItem key={index} editor={editor} {...props} />
      ))}

      <button
        onClick={() => onFullscreenChange?.(!fullscreen)}
        className={classNames(
          'gwe-menu-bar__btn',
          fullscreen ? `gwe-menu-bar__btn--active` : ''
        )}
      >
        full
      </button>
    </div>
  );
};

export default MenuBar;
