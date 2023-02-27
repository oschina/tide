import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@gitee/wysiwyg-editor-react';
import Tippy from '@tippyjs/react';
import {
  IconAngleDown,
  IconCopyBold,
  IconSearch,
  IconWarpBold,
} from '@gitee/icons-react';
import './CodeBlockNodeView.less';

export const CodeBlockNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  extension,
}) => {
  const { isEditable } = editor;
  const language =
    node.attrs.language || extension?.options?.defaultLanguage || '';
  const $container = useRef<HTMLPreElement>(null);
  const [softWrap, setSoftWrap] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>();

  const languages = useMemo(
    () => [
      ...(extension?.options?.lowlight?.listLanguages?.() || []).map(
        (lang: string) => ({
          label: lang,
          value: lang,
        })
      ),
    ],
    [extension]
  );

  const [value, setValue] = useState(() => {
    if (language && languages.some((i) => i.value === language)) {
      return language;
    }
    return languages?.[0]?.value;
  });

  const searchedLanguages = useMemo(
    () => languages.filter((i) => i.value.includes(search.toLowerCase())),
    [languages, search]
  );

  const handleOpen = useCallback(() => {
    if (!isEditable) {
      return;
    }
    setDropdownVisible((prev) => !prev);
    setTimeout(() => inputRef.current.focus());
  }, [isEditable]);

  return (
    <NodeViewWrapper
      className={classNames(node.attrs.className, 'gwe-code-block')}
      onMouseEnter={() => setToolbarVisible(true)}
      onMouseLeave={() => {
        if (!dropdownVisible) {
          setToolbarVisible(false);
        }
      }}
    >
      <div
        className={classNames('gwe-code-block__toolbar', {
          'gwe-code-block__toolbar--visible': toolbarVisible,
        })}
        contentEditable={false}
      >
        {isEditable ? (
          <Tippy
            placement="bottom-start"
            interactive
            appendTo={editor.options.element}
            onClickOutside={() => setDropdownVisible(false)}
            visible={dropdownVisible}
            onHidden={() => setSearch('')}
            offset={[0, 4]}
            content={
              <div className="gwe-dropdown-menu gwe-code-block__dropdown">
                <div className="gwe-dropdown-menu__content">
                  <div className="gwe-code-block__dropdown-search">
                    <div className="gwe-code-block__dropdown-input">
                      <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        placeholder="搜索"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <IconSearch />
                    </div>
                  </div>
                  <div className="gwe-code-block__dropdown-list">
                    {searchedLanguages.map((lang) => (
                      <div
                        key={lang.value}
                        className={classNames('gwe-dropdown-menu__item', {
                          'gwe-dropdown-menu__item--active':
                            value === lang.value,
                        })}
                        onClick={() => {
                          setValue(lang.value);
                          updateAttributes({ language: lang.value });
                          setDropdownVisible(false);
                        }}
                      >
                        {lang.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <div
              className="gwe-dropdown-trigger gwe-code-block__dropdown-trigger"
              onClick={handleOpen}
            >
              <span>{value}</span>
              <IconAngleDown />
            </div>
          </Tippy>
        ) : (
          <span>{language}</span>
        )}
        <button
          className={classNames(
            'gwe-code-block__soft-wrap gwe-code-block__button',
            {
              'gwe-code-block__button--active': softWrap,
            }
          )}
          onClick={() => setSoftWrap((prev) => !prev)}
        >
          <IconWarpBold />
          自动换行
        </button>
        <button
          className="gwe-code-block__button"
          onClick={() => copy($container?.current?.innerText as string)}
        >
          <IconCopyBold />
          复制
        </button>
      </div>
      <div className="gwe-code-block__content">
        <pre
          className={classNames('hljs', {
            'soft-wrap': softWrap,
          })}
          ref={$container}
        >
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};
