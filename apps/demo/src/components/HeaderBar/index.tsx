import React, { useEffect, useState } from 'react';
import type { MarkdownEditor } from '@gitee/wysiwyg-editor-markdown';
import lz from 'lz-string';
import copy from 'copy-to-clipboard';
import applyDevTools from 'prosemirror-dev-tools';
import throttle from 'lodash/throttle';

import './index.less';
import { EditorEvents } from '@tiptap/core';

const localStorageKey = 'wysiwyg-editor-history';

const HeaderBar = ({
  editor,
  editable,
  onEditableChange,
}: {
  editor: MarkdownEditor | null;
  editable: boolean;
  onEditableChange: (v: boolean) => void;
}) => {
  const [theme, setTheme] = useState('');
  const handleClickShareLink = () => {
    const jsonContent = editor?.getJSON();
    const url = new URL(window.location.href);
    url.searchParams.set('type', 'json');
    url.searchParams.set(
      'value',
      lz.compressToEncodedURIComponent(JSON.stringify(jsonContent))
    );

    const urlString = url.toString();
    history.pushState(null, '', urlString);
    copy(urlString);

    if (urlString.length > 10000) {
      alert('复制成功 内容过多导致会数据丢失');
    } else {
      alert('复制成功');
    }
  };

  useEffect(() => {
    // 尝试从 url 回填编辑器数据
    const url = new URL(window.location.href);
    const urlVal = url.searchParams.get('value');
    if (urlVal) {
      const maybeJson = lz.decompressFromEncodedURIComponent(urlVal);
      try {
        const json = JSON.parse(maybeJson);
        editor?.commands.setContent(json || '');
      } catch (e) {
        console.error('url value json parse error:', e);
      }
      return;
    }

    // 尝试从 本地存储中恢复
    const history = localStorage.getItem(localStorageKey);
    if (history) {
      try {
        const json = JSON.parse(history);
        editor?.commands.setContent(json || '');
      } catch (e) {
        console.error('localStorage value json parse error:', e);
      }
    }
  }, [editor]);

  useEffect(() => {
    // 存本地
    const updateSaveToLocalHandle = throttle(
      ({ editor }: EditorEvents['update']) => {
        if (!editor) return;
        try {
          localStorage.setItem(
            localStorageKey,
            JSON.stringify(editor.getJSON())
          );
        } catch (e) {
          console.log('localStorage setItem error:', e);
        }
      },
      600
    );

    editor?.on('update', updateSaveToLocalHandle);
    return () => {
      editor?.off('update', updateSaveToLocalHandle);
    };
  }, [editor]);

  return (
    <div className={'demo-header-bar'}>
      <div className={'demo-header-bar-left'}>
        <label className="">
          <input
            type="checkbox"
            name="editable"
            checked={editable}
            onChange={(e) => {
              onEditableChange(e.target.checked);
            }}
          />
          editable
        </label>
      </div>
      <div className={'demo-header-bar-right'}>
        <select
          onChange={(e) => {
            const val = e.target.value;
            const classList = document.body.classList;
            if (classList.contains(theme)) {
              classList.replace(theme, val);
            } else {
              classList.add(val);
            }
            setTheme(val);
          }}
        >
          <option value="theme-blue">蓝色</option>
          <option value="theme-purple">紫色</option>
          <option value="theme-green">绿色</option>
          <option value="theme-pink">梅红</option>
          <option value="theme-dark">暗黑</option>
        </select>
        <button
          className="btn-dev-tool"
          onClick={() => {
            if (editor) applyDevTools(editor.view);
          }}
        >
          DevTool
        </button>
        <button
          className="btn-clear"
          onClick={() => {
            history.pushState(null, '', window.location.pathname);
            localStorage.removeItem(localStorageKey);
            editor?.commands.setContent('');
          }}
        >
          清空
        </button>
        <button className="btn-share" onClick={handleClickShareLink}>
          分享链接
        </button>
        <div className="env-tag">{import.meta.env.MODE}</div>
      </div>
    </div>
  );
};

export default HeaderBar;
