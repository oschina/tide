import React, { useState } from 'react';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import type { Level } from '@tiptap/extension-heading';
import { IconCaretDown } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
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
        !editor.state.schema.nodes.heading ||
        !editor.can().toggleHeading?.({ level });
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
          <div className="tide-dropdown-menu">
            <div className="tide-dropdown-menu__content">
              <div
                onClick={() => {
                  if (
                    statusMap?.paragraphIsDisabled ||
                    !editor.can().chain().focus().setParagraph().run()
                  ) {
                    return false;
                  }
                  editor.chain().focus().setParagraph().run();
                  setHeadVisible(false);
                }}
                className={classNames('tide-dropdown-menu__item', {
                  'tide-dropdown-menu__item--active':
                    statusMap?.paragraphIsActive,
                  'tide-dropdown-menu__item--disabled':
                    statusMap?.paragraphIsDisabled,
                })}
              >
                <div className={classNames('tide-menu-head-row')}>
                  <span>正文</span>
                  <span className={`tide-menu-head-row__span`}>
                    {`${command} + ${option} + 0`}
                  </span>
                </div>
              </div>
              {headingLevels.map((level) => (
                <li
                  key={level}
                  onClick={() => {
                    if (
                      statusMap?.[`heading${level}Disabled`] ||
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
                  className={classNames('tide-dropdown-menu__item', {
                    'tide-dropdown-menu__item--active':
                      statusMap?.[`heading${level}IsActive`],
                    'tide-dropdown-menu__item--disabled':
                      statusMap?.[`heading${level}Disabled`],
                  })}
                >
                  <div className={classNames('tide-menu-head-row')}>
                    <span
                      className={`tide-menu-head-row__title--level${level}`}
                    >
                      标题 {level}
                    </span>
                    <span className={`tide-menu-head-row__span`}>
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
          className={'tide-dropdown-trigger'}
          onClick={() => setHeadVisible(!headVisible)}
        >
          <span className={'tide-dropdown-trigger__head-text'}>
            {getHeadingText()}
          </span>
          <IconCaretDown className={'tide-dropdown-trigger__head-icon'} />
        </div>
      </Tippy>
    </MenuBarItem>
  );
};
