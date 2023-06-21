import React, { useEffect, useState } from 'react';
import lz from 'lz-string';
import copy from 'copy-to-clipboard';
import applyDevTools from 'prosemirror-dev-tools';
import throttle from 'lodash/throttle';
import { TideEditor, EditorEvents } from '@gitee/tide';
import { Theme, useTheme } from '../../contexts/ThemeContext';
import icon from '../../../favicon.svg';

import './index.less';

const localStorageKey = 'tide-history';

const isProd = import.meta.env.MODE === 'production';

const HeaderBar = ({ editor }: { editor: TideEditor | null }) => {
  const { theme, setTheme } = useTheme();
  const [readOnly, setReadOnly] = useState<boolean>(!!editor?.isReadOnly);

  const handleClickShareLink = () => {
    if (!editor) return;

    const jsonContent = editor.getJSON();
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
    if (!editor) return;

    if (!isProd) {
      // 尝试从 url 回填编辑器数据
      const url = new URL(window.location.href);
      const urlVal = url.searchParams.get('value');
      if (urlVal) {
        const maybeJson = lz.decompressFromEncodedURIComponent(urlVal);
        try {
          const json = JSON.parse(maybeJson);
          editor.setContent(json || '');
        } catch (e) {
          console.error('url value json parse error:', e);
        }
        return;
      }
    }

    // 尝试从 本地存储中恢复
    const history = localStorage.getItem(localStorageKey);
    if (history) {
      try {
        const json = JSON.parse(history);
        editor.setContent(json || '');
      } catch (e) {
        console.error('localStorage value json parse error:', e);
      }
    }
  }, [editor]);

  useEffect(() => {
    // 存本地
    const updateSaveToLocalHandle = throttle(
      (props: EditorEvents['update']) => {
        if (!props.editor) return;
        try {
          localStorage.setItem(
            localStorageKey,
            JSON.stringify(props.editor.getJSON())
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

  useEffect(() => {
    if (!editor) return;
    setReadOnly(editor.isReadOnly);
  }, [editor]);

  return (
    <div className={'demo-header-bar'}>
      <div className={'demo-header-bar-left'}>
        <a href="https://gitee.com/oschina/tide" className="link-repository">
          <img src={icon} alt="@gitee/tide" />
          @gitee/tide
        </a>
        <a
          href="https://gitee.com/oschina/tide/stargazers"
          target="_blank"
          rel="noreferrer"
          className="ml-2"
          style={{ display: 'flex' }}
        >
          <img
            src="https://gitee.com/oschina/tide/badge/star.svg?theme=white"
            alt="star"
            className="dark-hide"
          />
          <img
            src="https://gitee.com/oschina/tide/badge/star.svg?theme=dark"
            alt="star"
            className="light-hide"
          />
        </a>
      </div>
      <div className={'demo-header-bar-right'}>
        <label className="mr-2">
          <input
            type="checkbox"
            name="editable"
            checked={readOnly}
            onChange={(e) => {
              if (!editor) return;
              setReadOnly(e.target.checked);
              editor.setEditable(!e.target.checked);
            }}
          />
          只读
        </label>
        <span className="select-theme">
          <label>
            主题：
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value={Theme.Blue}>蓝色</option>
              <option value={Theme.Purple}>紫色</option>
              <option value={Theme.Green}>绿色</option>
              <option value={Theme.Pink}>梅红</option>
              <option value={Theme.Dark}>暗黑</option>
            </select>
          </label>
        </span>
        <button
          className="btn-clear"
          onClick={() => {
            if (!editor) return;
            history.pushState(null, '', window.location.pathname);
            localStorage.removeItem(localStorageKey);
            editor.setContent('');
          }}
        >
          清空
        </button>
        {!isProd && (
          <>
            <button className="btn-share" onClick={handleClickShareLink}>
              分享
            </button>
            <button
              className="btn-dev-tool"
              onClick={() => {
                if (editor) applyDevTools(editor.view);
              }}
            >
              DevTool
            </button>
            <div className="env-tag">
              {import.meta.env.MODE === 'production' ? 'PROD' : 'DEV'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
