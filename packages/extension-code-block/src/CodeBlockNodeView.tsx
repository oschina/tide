import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@test-pkgs/react';
import Tippy from '@tippyjs/react';
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
  const [visible, setVisible] = useState(false);
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

  return (
    <NodeViewWrapper
      className={classNames(node.attrs.className, 'gwe-code-block')}
    >
      <div className="gwe-code-block__toolbar" contentEditable={false}>
        {isEditable ? (
          <Tippy
            placement="bottom-start"
            interactive
            onClickOutside={() => setVisible(false)}
            visible={visible}
            onHidden={() => setSearch('')}
            content={
              <div className="gwe-dropdown-menu gwe-code-block__dropdown">
                <div className="gwe-code-block__search-input">
                  <input
                    ref={inputRef}
                    placeholder="搜索"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="gwe-scrollbar-container">
                  {searchedLanguages.map((lang) => (
                    <div
                      key={lang.value}
                      className="gwe-dropdown-menu__item"
                      onClick={() => {
                        setValue(lang.value);
                        updateAttributes({ language: lang.value });
                        setVisible(false);
                      }}
                    >
                      {lang.label}
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <div
              className="gwe-dropdown-trigger"
              onClick={() => {
                if (!isEditable) {
                  return;
                }
                setVisible((prev) => !prev);
                setTimeout(() => inputRef.current.focus());
              }}
            >
              <span>{value}</span>
            </div>
          </Tippy>
        ) : (
          <span>{language}</span>
        )}
        <label className="gwe-code-block__soft-wrap">
          <input
            type="checkbox"
            checked={softWrap}
            onChange={(e) => setSoftWrap(e.target.checked)}
          />
          自动换行
        </label>
        <button onClick={() => copy($container?.current?.innerText as string)}>
          复制
        </button>
      </div>
      <div className="gwe-code-block__content">
        <pre
          className={classNames('gwe-code-block__content-pre code-block hljs', {
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
