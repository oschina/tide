import React from 'react';

const DevtoolPanel = ({
  tab,
  onTabChange,
  content,
  onContentChange,
}: {
  tab: string;
  onTabChange: (tab: string) => void;
  content: string;
  onContentChange: (textarea: string) => void;
}) => {
  return (
    <div className="devtool">
      <div className="tab">
        <label>
          <input
            type="radio"
            name="tab"
            value="html"
            checked={tab === 'html'}
            onChange={() => onTabChange('html')}
          />
          html
        </label>
        <label>
          <input
            type="radio"
            name="tab"
            value="json"
            checked={tab === 'json'}
            onChange={() => onTabChange('json')}
          />
          json
        </label>
        <label>
          <input
            type="radio"
            name="tab"
            value="markdown"
            checked={tab === 'markdown'}
            onChange={() => onTabChange('markdown')}
          />
          markdown
        </label>
      </div>

      {tab === 'json' && (
        <textarea
          className="json"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      )}

      {(tab === 'html' || tab === 'markdown') && (
        <textarea
          className="html"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      )}
    </div>
  );
};
export default DevtoolPanel;
