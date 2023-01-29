import React, { useEffect } from 'react';
import { MarkdownEditor } from '@test-pkgs/markdown';
import { EditorEvents } from '@tiptap/core';
import throttle from 'lodash/throttle';

const InspectPanel = ({ editor }: { editor: MarkdownEditor | null }) => {
  const [tab, setTab] = React.useState<'html' | 'json' | 'markdown'>('json');
  const [inspectData, setInspectData] = React.useState('');

  useEffect(() => {
    const updateHandle = throttle(({ editor }: EditorEvents['update']) => {
      if (!editor) return;

      switch (tab) {
        case 'json':
          setInspectData(JSON.stringify(editor.getJSON(), null, 2));
          break;
        case 'html':
          setInspectData(editor.getHTML());
          break;
        case 'markdown':
          setInspectData((editor as MarkdownEditor).getMarkdown());
          break;
        default:
      }
    }, 500);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updateHandle({ editor });

    editor?.on('update', updateHandle);
    return () => {
      editor?.off('update', updateHandle);
    };
  }, [editor, tab, setInspectData]);

  return (
    <div className="inspect-panel">
      <div className="tab">
        <label>
          <input
            type="radio"
            name="tab"
            value="json"
            checked={tab === 'json'}
            onChange={() => setTab('json')}
          />
          json
        </label>
        <label>
          <input
            type="radio"
            name="tab"
            value="html"
            checked={tab === 'html'}
            onChange={() => setTab('html')}
          />
          html
        </label>

        <label>
          <input
            type="radio"
            name="tab"
            value="markdown"
            checked={tab === 'markdown'}
            onChange={() => setTab('markdown')}
          />
          markdown
        </label>
      </div>

      <textarea
        className={tab === 'json' ? 'json' : 'html'}
        value={inspectData}
        onChange={(e) => {
          setInspectData(e.target.value);
          // todo sync editor
          console.log('--------onChange----', e.target.value);
        }}
      />
    </div>
  );
};

export default InspectPanel;
