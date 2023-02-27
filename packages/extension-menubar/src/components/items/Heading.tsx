import React, { useState } from 'react';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import { Level } from '@tiptap/extension-heading';
import { IconCaretDown } from '@gitee/icons-react';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { command, option } from '../../utils';

const headingLevels: Level[] = [1, 2, 3, 4, 5, 6];

export const Heading: React.FC = () => {
  const [headVisible, setHeadVisible] = useState(false);

  const { editor, statusMap } = useStatusMap(() => {
    const map = {
      paragraphIsActive: () => isActive(editor.state, 'paragraph'),
      paragraphIsDisabled: () => !editor.can().setParagraph(),
    };
    headingLevels.forEach((level) => {
      map[`heading${level}IsActive`] = () =>
        isActive(editor.state, 'heading', { level });
      map[`heading${level}Disabled`] = () =>
        !editor.can().toggleHeading({ level });
    });
    return map;
  });

  const getHeadingText = () => {
    if (statusMap?.paragraphIsActive) {
      return '正文';
    }
    const activeLevel = headingLevels.find(
      (level) => statusMap?.[`heading${level}IsActive`]
    );
    if (activeLevel) {
      return `标题 ${activeLevel}`;
    }
    return '正文';
  };

  return (
    <MenuBarItem>
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
                className={classNames('gwe-dropdown-menu__item', {
                  'gwe-dropdown-menu__item--active':
                    statusMap?.paragraphIsActive,
                  'gwe-dropdown-menu__item--disabled':
                    statusMap?.paragraphIsDisabled,
                })}
              >
                <div className={classNames('gwe-menu-head-row')}>
                  <span>正文</span>
                  <span className={`gwe-menu-head-row__span`}>
                    {`${command} + ${option} + 0`}
                  </span>
                </div>
              </div>
              {headingLevels.map((level) => (
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
                  className={classNames('gwe-dropdown-menu__item', {
                    'gwe-dropdown-menu__item--active':
                      statusMap?.[`heading${level}IsActive`],
                    'gwe-dropdown-menu__item--disabled':
                      statusMap?.[`heading${level}Disabled`],
                  })}
                >
                  <div className={classNames('gwe-menu-head-row')}>
                    <span className={`gwe-menu-head-row__title--level${level}`}>
                      标题 {level}
                    </span>
                    <span className={`gwe-menu-head-row__span`}>
                      {`${command} + ${option} + ${level}`}
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
    </MenuBarItem>
  );
};
