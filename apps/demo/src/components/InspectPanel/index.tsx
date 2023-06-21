import React, { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { TideEditor, EditorEvents } from '@gitee/tide';
import throttle from 'lodash/throttle';
import { Theme, useTheme } from '../../contexts/ThemeContext';
import './userWorker';

const InspectPanel = ({ editor }: { editor: TideEditor | null }) => {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'html' | 'json' | 'markdown'>('json');
  const [monacoEditorContent, setMonacoEditorContent] = useState('');

  useEffect(() => {
    const updateHandle = throttle((props: EditorEvents['update']) => {
      if (!props.editor) return;
      let content = '';
      switch (tab) {
        case 'json':
          content = JSON.stringify(props.editor.getJSON(), null, 2);
          break;
        case 'html':
          content = props.editor.getHTML();
          break;
        case 'markdown':
          content = props.editor.getMarkdown();
          break;
        default:
      }
      setMonacoEditorContent(content);
    }, 500);

    if (editor) {
      updateHandle({ editor, transaction: editor.state.tr });
    }

    editor?.on('update', updateHandle);
    return () => {
      editor?.off('update', updateHandle);
    };
  }, [editor, tab]);

  const isProd = import.meta.env.MODE === 'production';

  return (
    <div className="inspect-panel">
      <div className="tab">
        {isProd ? (
          <span>输出：</span>
        ) : (
          <>
            <label className="mr-2">
              <input
                type="radio"
                name="tab"
                value="json"
                checked={tab === 'json'}
                onChange={() => setTab('json')}
              />
              JSON
            </label>
            <label className="mr-2">
              <input
                type="radio"
                name="tab"
                value="html"
                checked={tab === 'html'}
                onChange={() => setTab('html')}
              />
              HTML
            </label>
            <label className="mr-2">
              <input
                type="radio"
                name="tab"
                value="markdown"
                checked={tab === 'markdown'}
                onChange={() => setTab('markdown')}
              />
              Markdown
            </label>
          </>
        )}
      </div>
      <div className="content">
        <MonacoEditor
          defaultLanguage={tab}
          language={tab}
          theme={theme === Theme.Dark ? 'vs-dark' : 'light'}
          value={monacoEditorContent}
          onChange={(newValue) => {
            if (!editor) return;
            try {
              editor.setContent(
                tab === 'json' ? JSON.parse(newValue || '') : newValue
              );
            } catch (error) {
              console.log(error);
            }
          }}
          options={{
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default InspectPanel;
