import React from 'react';
import { MentionPullRequestItemDataType } from './types';

const MentionPullRequestItemRender: React.FC<{
  item: MentionPullRequestItemDataType;
}> = ({ item }) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="gwe-mention-pull-request__item">
      <span className="gwe-mention-pull-request__item-id">
        {item.attrs.iid}
      </span>
      <span className="gwe-mention-pull-request__item-title">
        {item.attrs.title}
      </span>
    </div>
  );
};

export default MentionPullRequestItemRender;
