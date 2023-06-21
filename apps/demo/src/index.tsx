import React from 'react';
import ReactDOM from 'react-dom';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { ThemeContextProvider } from './contexts/ThemeContext';
import HeaderBar from './components/HeaderBar';
import InspectPanel from './components/InspectPanel';
import { MentionMember } from './components/Editor/extensions/mention-member';
import {
  mockFetchMemberMentionDebounced,
  mockImgUploader,
} from './components/Editor/utils';

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
        uploader: {
          image: {
            uploader: mockImgUploader,
          },
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
    <ThemeContextProvider>
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
            <a
              href="https://gitee.com/oschina/tide"
              target="_blank"
              rel="noreferrer"
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              <img
                src="https://gitee.com/oschina/tide/widgets/widget_1.svg"
                alt="Fork me on Gitee"
              />
            </a>
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
