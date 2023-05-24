import React, { useEffect } from 'react';
import { Editor, EditorEvents } from '@tiptap/core';
import throttle from 'lodash/throttle';

const InspectPanel = ({ editor }: { editor: Editor | null }) => {
  const [tab, setTab] = React.useState<'html' | 'json' | 'markdown'>('json');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateHandle = throttle(({ editor }: EditorEvents['update']) => {
      if (!editor || !textareaRef.current) return;

      switch (tab) {
        case 'json':
          textareaRef.current.value = JSON.stringify(editor.getJSON(), null, 2);
          break;
        case 'html':
          textareaRef.current.value = editor.getHTML();
          break;
        case 'markdown':
          textareaRef.current.value =
            editor.storage.markdown?.getMarkdown?.() || '';
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
  }, [editor, tab]);

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
        ref={textareaRef}
        className={tab === 'json' ? 'json' : 'html'}
        onChange={(e) => {
          // 当图片数据量 base64 字符太大时会卡顿
          // todo sync editor
          console.log('--------onChange----', e.target.value);
          if (tab === 'json') {
            try {
              editor?.commands.setContent(JSON.parse(e.target.value));
            } catch (error) {
              console.log(error);
            }
          } else {
            editor?.commands.setContent(e.target.value);
          }
        }}
      />
    </div>
  );
};

export default InspectPanel;
