import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@test-pkgs/react';
import styles from './CodeBlockNodeView.module.less';

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

  return (
    <NodeViewWrapper
      className={classNames(node.attrs.className, styles['code-block'])}
    >
      <div className={styles.toolbar} contentEditable={false}>
        {isEditable ? (
          <select
            value={language}
            onChange={(e) => updateAttributes({ language: e.target.value })}
            disabled={!isEditable}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        ) : (
          <span>{language}</span>
        )}
        <label className={styles['soft-wrap']}>
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
      <div className={styles.content}>
        <pre
          className={classNames('code-block hljs', { 'soft-wrap': softWrap })}
          ref={$container}
        >
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};
