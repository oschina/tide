import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MarkdownEditor } from '@test-pkgs/markdown';
import HeaderBar from './components/HeaderBar';
import InspectPanel from './components/InspectPanel';
import { WysiwygEditor } from './components/Editor';

import './index.less';

function App() {
  const [editor, setEditor] = useState<MarkdownEditor | null>(null);
  const [editable, setEditable] = useState(true);

  console.log('App', editor);

  return (
    <div className="demo">
      <div className="demo-header">
        <HeaderBar
          editor={editor}
          editable={editable}
          onEditableChange={(v) => {
            setEditable(v);
          }}
        />
      </div>
      <div className="demo-main">
        <div className="demo-editor-wrapper">
          <WysiwygEditor ref={setEditor} readOnly={!editable} />
        </div>
        <div className="demo-inspect">
          <InspectPanel editor={editor} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
