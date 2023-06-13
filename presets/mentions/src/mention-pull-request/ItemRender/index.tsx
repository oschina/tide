import React from 'react';
import { MentionPullRequestItemDataType } from '../types';
import { StateIcon } from '../Icons/PullRequestIcon';
import './index.less';

const MentionPullRequestItemRender: React.FC<{
  item: MentionPullRequestItemDataType;
}> = ({ item }) => {
  if (!item.attrs) {
    return null;
  }
  const state = item.attrs.state;

  return (
    <div className="tide-mention-pull-request__pop-item">
      <StateIcon
        className="tide-mention-pull-request__pop-item-icon"
        state={state}
      />
      <span className="tide-mention-pull-request__pop-item-id">
        !{item.attrs.iid}
      </span>
      <span className="tide-mention-pull-request__pop-item-title">
        {item.attrs.title}
      </span>
    </div>
  );
};

export default MentionPullRequestItemRender;
