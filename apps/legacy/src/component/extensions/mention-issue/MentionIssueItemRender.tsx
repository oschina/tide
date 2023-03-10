import React from 'react';
import { MentionIssueItemDataType } from './types';

const MentionIssueItemRender: React.FC<{ item: MentionIssueItemDataType }> = ({
  item,
}) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="">
      <span>{item.attrs.ident}</span>
      <span>{item.attrs.title}</span>
    </div>
  );
};

export default MentionIssueItemRender;
