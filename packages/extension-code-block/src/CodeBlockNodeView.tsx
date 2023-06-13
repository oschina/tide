import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@gitee/tide-react';
import Tippy from '@tippyjs/react';
import {
  IconAngleDown,
  IconCopyBold,
  IconSearch,
  IconWarpBold,
} from '@gitee/icons-react';
import {
  getLanguageByValue,
  getLanguageByValueOrAlias,
  languages,
} from './languages';
import './CodeBlockNodeView.less';

const softWrapLocalStorageKey = 'tide-codeblock-soft-wrap';

const CODE_BLOCK_DROPDOWN_MAX_HEIGHT = 245;

export const CodeBlockNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  extension,
}) => {
  const { isEditable } = editor;

  const $container = useRef<HTMLPreElement>(null);
  const inputRef = useRef<HTMLInputElement>();
  const [search, setSearch] = useState('');
  const [softWrap, setSoftWrap] = useState(
    () => window.localStorage?.getItem(softWrapLocalStorageKey) === 'true'
  );
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const language =
    node.attrs.language || extension?.options?.defaultLanguage || '';
  const languageItem = useMemo(() => getLanguageByValue(language), [language]);

  const [selectedValue, setSelectedValue] = useState(
    () => getLanguageByValueOrAlias(language)?.value || 'plaintext'
  );
  const selectedLanguageItem = useMemo(
    () => getLanguageByValue(selectedValue),
    [selectedValue]
  );

  const searchedLanguages = useMemo(() => {
    const keyword = search.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.value.includes(keyword) ||
        lang.alias.includes(keyword) ||
        lang.name.includes(keyword)
    );
  }, [search]);

  const handleOpen = useCallback(() => {
    if (!isEditable) {
      return;
    }
    setDropdownVisible((prev) => !prev);
    setTimeout(() => inputRef.current.focus());
  }, [isEditable]);

  return (
    <NodeViewWrapper
      className={classNames(node.attrs.className, 'tide-code-block')}
      onMouseEnter={() => setToolbarVisible(true)}
      onMouseLeave={() => setToolbarVisible(false)}
    >
      <div
        className={classNames('tide-code-block__toolbar', {
          'tide-code-block__toolbar--visible':
            toolbarVisible || dropdownVisible,
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
            onShow={(instance) => {
              const contentEl = instance.popper?.querySelector(
                '.tide-dropdown-menu__content'
              ) as HTMLDivElement;
              const editorRect =
                editor.options.element?.getBoundingClientRect();
              const referenceRect = instance.reference?.getBoundingClientRect();
              if (contentEl && editorRect && referenceRect) {
                const top = referenceRect.top - editorRect.top;
                const bottom = editorRect.bottom - referenceRect.bottom;
                const dropdownMaxHeight = Math.max(top, bottom) - 24;
                if (dropdownMaxHeight < CODE_BLOCK_DROPDOWN_MAX_HEIGHT) {
                  contentEl.style.maxHeight = `${dropdownMaxHeight}px`;
                  instance.setProps({
                    placement: top > bottom ? 'top-start' : 'bottom-start',
                  });
                }
              }
            }}
            offset={[0, 4]}
            content={
              <div className="tide-dropdown-menu tide-code-block__dropdown">
                <div
                  className="tide-dropdown-menu__content"
                  style={{
                    maxHeight: CODE_BLOCK_DROPDOWN_MAX_HEIGHT,
                  }}
                >
                  <div className="tide-code-block__dropdown-search">
                    <div className="tide-code-block__dropdown-input">
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
                  <div className="tide-code-block__dropdown-list">
                    {searchedLanguages.map((lang) => (
                      <div
                        key={lang.value}
                        className={classNames('tide-dropdown-menu__item', {
                          'tide-dropdown-menu__item--active':
                            selectedValue === lang.value,
                        })}
                        onClick={() => {
                          setSelectedValue(lang.value);
                          updateAttributes({ language: lang.value });
                          setDropdownVisible(false);
                        }}
                      >
                        {lang.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <div
              className="tide-dropdown-trigger tide-code-block__dropdown-trigger"
              onClick={handleOpen}
            >
              <span>{selectedLanguageItem?.name || selectedValue}</span>
              <IconAngleDown />
            </div>
          </Tippy>
        ) : (
          <span>{languageItem?.name || language}</span>
        )}
        <button
          className={classNames(
            'tide-code-block__soft-wrap tide-code-block__button',
            {
              'tide-code-block__button--active': softWrap,
            }
          )}
          onClick={() =>
            setSoftWrap((prev) => {
              window.localStorage?.setItem(
                softWrapLocalStorageKey,
                String(!prev)
              );
              return !prev;
            })
          }
        >
          <IconWarpBold />
          自动换行
        </button>
        <button
          className="tide-code-block__button"
          onClick={() => copy($container?.current?.innerText as string)}
        >
          <IconCopyBold />
          复制
        </button>
      </div>
      <div className="tide-code-block__content">
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
