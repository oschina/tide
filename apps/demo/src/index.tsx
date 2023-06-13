import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import type { Editor } from '@gitee/tide';
import HeaderBar from './components/HeaderBar';
import InspectPanel from './components/InspectPanel';
import { TideEditor } from './components/Editor';

import './index.less';

console.log('BUILD_TIME：', __BUILD_TIME__);

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <div className="demo">
      <div className="demo-header">
        <HeaderBar editor={editor} />
      </div>
      <div className="demo-main">
        <div className="demo-editor-wrapper">
          <TideEditor ref={setEditor} />
        </div>
        <div className="demo-inspect">
          <InspectPanel editor={editor} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
