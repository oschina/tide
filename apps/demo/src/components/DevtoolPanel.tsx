import React, { useEffect, useState } from 'react';
import { Editor } from '@test-pkgs/react';

const DevtoolPanel = ({ editor }: { editor: any }) => {
  const [tab, setTab] = useState('json');
  const [content, setContent] = useState('');

  useEffect(() => {
    const update = () => {
      if (tab === 'json') {
        const json = editor.getJSON();
        setContent(JSON.stringify(json, null, 2));
      }
      if (tab === 'html') {
        const html = editor.getHTML();
        setContent(html);
      }
      if (tab === 'markdown') {
        const md = editor.getMarkdown();
        setContent(md);
      }
    };

    update();
    editor.on('update', () => {
      update();
    });
  }, [tab]);

  return (
    <div className="demo-devtool">
      <div className="demo-devtool-tab">
        <button onClick={() => setTab('html')}>getHtml</button>
        <button onClick={() => setTab('json')}>getJson</button>
        <button onClick={() => setTab('markdown')}>getMarkdown</button>
      </div>

      {tab === 'json' && (
        <code className="demo-devtool-content-json">{content}</code>
      )}

      {(tab === 'html' || tab === 'markdown') && (
        <code className="demo-devtool-content-html">{content}</code>
      )}
    </div>
  );
};
export default DevtoolPanel;
