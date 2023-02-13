import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { Editor } from '@tiptap/core';
import { isActive } from '@gitee/wysiwyg-editor-common';
import Tippy from '@tippyjs/react';
import { Level } from '@tiptap/extension-heading';
import {
  IconMaximizeBold,
  IconMinimizeBold,
  IconCaretDown,
  IconUndoBold,
  IconRedoBold,
} from '@gitee/icons-react';
import useBtnMenus from './useBtnMenus';
import { BtnItem } from './BtnItem';
import { useStatusMap } from './useStatusMap';

import './MenuBar.less';

type MenuBarProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  editor?: Editor | null;
  fullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
};

export const MenuBar: React.FC<MenuBarProps> = ({
  className,
  style,
  editor,
  fullscreen,
  onFullscreenChange,
}) => {
  if (!editor) {
    return null;
  }
  const [headVisible, setHeadVisible] = useState(false);

  const { statusMap, updateStatusMap } = useStatusMap(editor);

  useEffect(() => {
    const listener = debounce(updateStatusMap, 300);
    editor?.on('selectionUpdate', listener);
    editor?.on('update', listener);

    return () => {
      editor?.off('selectionUpdate', listener);
      editor?.off('update', listener);
    };
  }, [editor]);

  const heads: Level[] = [1, 2, 3, 4, 5, 6];

  const btnMenus = useBtnMenus(editor);

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
    <div className={classNames('gwe-menu-bar', className)} style={style}>
      <div className="gwe-menu-bar__item">
        <Tippy
          interactive
          content={<div className={'gwe-menu-bar__tooltip'}>撤销</div>}
        >
          <button
            onClick={() => editor?.chain().focus().undo?.().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={classNames(
              'gwe-menu-bar__btn',
              isActive(editor.state, 'undo') ? `gwe-menu-bar__btn--active` : ''
            )}
          >
            <IconUndoBold />
          </button>
        </Tippy>
      </div>
      <div className="gwe-menu-bar__item">
        <Tippy
          interactive
          content={<div className={'gwe-menu-bar__tooltip'}>重做</div>}
        >
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={classNames(
              'gwe-menu-bar__btn',
              isActive(editor.state, 'redo') ? `gwe-menu-bar__btn--active` : ''
            )}
          >
            <IconRedoBold />
          </button>
        </Tippy>
      </div>

      <span className="gwe-menu-bar__divider" />

      <div className="gwe-menu-bar__item">
        <Tippy
          placement="bottom-start"
          interactive
          onClickOutside={() => setHeadVisible(false)}
          visible={headVisible}
          content={
            <div className="gwe-dropdown-menu">
              <div className="gwe-dropdown-menu__content">
                <div
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
                    <span className={`gwe-menu-head-row__span`}>
                      Ctrl Alt 0
                    </span>
                  </div>
                </div>
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
                      !editor
                        .can()
                        .chain()
                        .focus()
                        .toggleHeading({ level })
                        .run()
                        ? 'gwe-dropdown-menu__item--disabled'
                        : ''
                    )}
                  >
                    <div className={classNames('gwe-menu-head-row')}>
                      <span
                        className={`gwe-menu-head-row__title--level${level}`}
                      >
                        标题{level}
                      </span>
                      <span className={`gwe-menu-head-row__span`}>
                        Ctrl Alt {level}
                      </span>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          }
        >
          <div
            className={'gwe-dropdown-trigger'}
            onClick={() => setHeadVisible(!headVisible)}
          >
            <span className={'gwe-dropdown-trigger__head-text'}>
              {getHeadingText()}
            </span>
            <IconCaretDown className={'gwe-dropdown-trigger__head-icon'} />
          </div>
        </Tippy>
      </div>

      {btnMenus?.map((props, index) => (
        <BtnItem key={index} editor={editor} statusMap={statusMap} {...props} />
      ))}

      <Tippy
        interactive
        content={<div className={'gwe-menu-bar__tooltip'}>全屏</div>}
      >
        <button
          onClick={() => onFullscreenChange?.(!fullscreen)}
          className={classNames(
            'gwe-menu-bar__item gwe-menu-bar__btn',
            fullscreen ? `gwe-menu-bar__btn--active` : ''
          )}
        >
          {fullscreen ? <IconMinimizeBold /> : <IconMaximizeBold />}
        </button>
      </Tippy>
    </div>
  );
};
