import React from 'react';
import { MentionPullRequestItemDataType } from './types';

const MentionPullRequestItemRender: React.FC<{
  item: MentionPullRequestItemDataType;
}> = ({ item }) => {
  if (!item.attrs || !item.pullRequest) {
    return null;
  }
  return (
    <div className="">
      <span>{item.attrs.iid}</span>
      <span>{item.attrs.title}</span>
    </div>
  );
};

export default MentionPullRequestItemRender;
