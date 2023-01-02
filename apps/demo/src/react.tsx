import './style.less';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import applyDevTools from 'prosemirror-dev-tools';
import { MarkdownEditor } from '@test-pkgs/markdown';
import DevtoolPanel from './components/DevtoolPanel';
import {
  EditorRender,
  EditorRenderProps,
} from './components/Editor/EditorRender';

function App() {
  const [ready, setReady] = useState(false);
  const [output, setOutput] = useState('json');
  const [editable, setEditable] = useState(true);
  const [content, setContent] = useState<EditorRenderProps['value']>(null);
  const [textareaContent, setTextareaContent] = useState('');

  const editorRef = useRef<MarkdownEditor | null>(null);
  const editor = editorRef.current;

  const updateTextareaContent = (editorInstance?: MarkdownEditor) => {
    const e = editorInstance || editor;
    if (!e) {
      return;
    }
    switch (output) {
      case 'html':
        setTextareaContent(e.getHTML() || '');
        break;
      case 'json':
        setTextareaContent(JSON.stringify(e.getJSON(), null, 2));
        break;
      case 'markdown':
        setTextareaContent(e.getMarkdown() || '');
        break;
    }
  };

  useEffect(() => {
    if (editor && ready) {
      updateTextareaContent();
    }
  }, [output, ready, editor]);

  return (
    <div className="demo">
      <div className="demo-header">
        <label>
          <input
            type="checkbox"
            name="editable"
            checked={editable}
            onChange={(e) => setEditable(e.target.checked)}
          />
          editable
        </label>
        <div style={{ marginLeft: 'auto' }}>{import.meta.env.MODE}</div>
      </div>
      <div className="demo-main">
        <div className="demo-editor-wrapper">
          <EditorRender
            ref={editorRef}
            value={content}
            readOnly={!editable}
            onChange={(value, e) => {
              setContent(value);
              updateTextareaContent(e);
            }}
            onReady={(e) => {
              setReady(true);
              updateTextareaContent(e);
              if (import.meta.env.MODE === 'development') {
                applyDevTools(e.view);
              }
            }}
          />
        </div>
        <div className="demo-devtool-wrapper">
          <DevtoolPanel
            tab={output}
            onTabChange={setOutput}
            content={textareaContent}
            onContentChange={(newValue) => {
              // update textarea content
              setTextareaContent(newValue);
              // update editor content
              let newContent = newValue;
              if (output === 'json') {
                try {
                  newContent = JSON.parse(newValue);
                } catch (err) {
                  console.error(err);
                }
              }
              setContent(newContent);
            }}
          />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
