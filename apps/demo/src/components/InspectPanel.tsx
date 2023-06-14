import React, { useEffect } from 'react';
import { TideEditor, EditorEvents } from '@gitee/tide';
import throttle from 'lodash/throttle';

const InspectPanel = ({ editor }: { editor: TideEditor | null }) => {
  const [tab, setTab] = React.useState<'html' | 'json' | 'markdown'>('json');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateHandle = throttle((props: EditorEvents['update']) => {
      if (!props.editor || !textareaRef.current) return;

      switch (tab) {
        case 'json':
          textareaRef.current.value = JSON.stringify(
            props.editor.getJSON(),
            null,
            2
          );
          break;
        case 'html':
          textareaRef.current.value = props.editor.getHTML();
          break;
        case 'markdown':
          textareaRef.current.value = props.editor.getMarkdown();
          break;
        default:
      }
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
      <textarea
        ref={textareaRef}
        className={tab === 'json' ? 'json' : 'html'}
        onChange={(e) => {
          if (!editor) return;
          try {
            editor.setContent(
              tab === 'json' ? JSON.parse(e.target.value) : e.target.value
            );
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </div>
  );
};

export default InspectPanel;
