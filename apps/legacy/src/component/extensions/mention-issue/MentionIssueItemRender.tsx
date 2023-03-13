import React from 'react';
import { MentionIssueItemDataType } from './types';

const MentionIssueItemRender: React.FC<{ item: MentionIssueItemDataType }> = ({
  item,
}) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="gwe-mention-issue__item">
      <span className="gwe-mention-issue__item-id">{item.attrs.ident}</span>
      <span className="gwe-mention-issue__item-title">{item.attrs.title}</span>
    </div>
  );
};

export default MentionIssueItemRender;
