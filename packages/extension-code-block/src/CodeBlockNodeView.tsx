import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@gitee/wysiwyg-editor-react';
import Tippy from '@tippyjs/react';
import { IconAngleDown, IconCopyBold, IconWarpBold } from '@gitee/icons-react';
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
                <div className="gwe-scrollbar-container gwe-dropdown-menu__content">
                  {searchedLanguages.map((lang) => (
                    <div
                      key={lang.value}
                      className={classNames('gwe-dropdown-menu__item', {
                        'gwe-dropdown-menu__item--active': value === lang.value,
                      })}
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
              className={classNames(
                'gwe-dropdown-trigger gwe-dropdown-trigger-search',
                {
                  'gwe-dropdown-trigger-search--active': visible,
                }
              )}
              onClick={() => {
                if (!isEditable) {
                  return;
                }
                setVisible((prev) => !prev);
                setTimeout(() => inputRef.current.focus());
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={value}
                className="gwe-dropdown-trigger-search__input"
                onChange={(e) => setSearch(e.target.value)}
              />
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
          <span>复制</span>
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
