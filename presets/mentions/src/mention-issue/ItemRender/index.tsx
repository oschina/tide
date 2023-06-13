import React from 'react';
import Icons, { IssueCategory } from '../Icons';
import { MentionIssueItemDataType } from '../types';
import './index.less';

export const MentionIssueItemRender: React.FC<{
  item: MentionIssueItemDataType;
}> = ({ item }) => {
  if (!item.attrs) {
    return null;
  }
  const category = item.attrs.issue_type?.category as IssueCategory;

  return (
    <div className="tide-mention-issue__pop-item">
      <span className="tide-mention-issue__pop-item-icon">
        <Icons category={category} />
      </span>
      <span className="tide-mention-issue__pop-item-id">
        #{item.attrs.ident}
      </span>
      <span className="tide-mention-issue__pop-item-title">
        {item.attrs.title}
      </span>
    </div>
  );
};
