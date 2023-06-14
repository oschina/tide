import React from 'react';
import ReactDOM from 'react-dom';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import HeaderBar from './components/HeaderBar';
import InspectPanel from './components/InspectPanel';
import { MentionMember } from './components/Editor/extensions/mention-member';
import { mockFetchMemberMentionDebounced } from './components/Editor/utils';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/a11y-light.css';
import './index.less';

console.log('BUILD_TIME：', __BUILD_TIME__);

function App() {
  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        textAlign: false,
        taskItem: {
          onReadOnlyChecked: () => true,
        },
      }),
      TextAlign.extend({
        addKeyboardShortcuts: () => ({}),
      }).configure({
        types: ['heading', 'paragraph'],
      }),
      MentionMember.configure({
        suggestion: {
          items: ({ query }) => mockFetchMemberMentionDebounced(query),
        },
      }),
    ],
    readOnlyEmptyView: (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>暂无内容（只读模式）</p>
      </div>
    ),
  });

  return (
    <div className="demo">
      <div className="demo-header">
        <HeaderBar editor={editor} />
      </div>
      <div className="demo-main">
        <div className="demo-editor-wrapper">
          <EditorRender editor={editor} />
        </div>
        <div className="demo-inspect">
          <InspectPanel editor={editor} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
