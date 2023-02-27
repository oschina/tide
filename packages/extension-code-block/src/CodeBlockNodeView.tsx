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
import {
  getLanguageByValue,
  getLanguageByValueOrAlias,
  languages,
} from './languages';
import './CodeBlockNodeView.less';

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
  const [softWrap, setSoftWrap] = useState(false);
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
      className={classNames(node.attrs.className, 'gwe-code-block')}
      onMouseEnter={() => setToolbarVisible(true)}
      onMouseLeave={() => setToolbarVisible(false)}
    >
      <div
        className={classNames('gwe-code-block__toolbar', {
          'gwe-code-block__toolbar--visible': toolbarVisible || dropdownVisible,
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
              className="gwe-dropdown-trigger gwe-code-block__dropdown-trigger"
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
