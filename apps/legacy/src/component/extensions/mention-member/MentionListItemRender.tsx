import React from 'react';
import { MentionMemberItemDataType } from './types';

const MentionListItemRender: React.FC<{ item: MentionMemberItemDataType }> = ({
  item,
}) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="">
      <span>{item.label}</span>
      <span>{item.desc}</span>
    </div>
  );
};

export default MentionListItemRender;
