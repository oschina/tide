import React from 'react';
import { MentionMemberItemDataType } from './types';

const MentionListItemRender: React.FC<{ item: MentionMemberItemDataType }> = ({
  item,
}) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <>
      <span>{item.label}</span>
      <span>{item.desc}</span>
    </>
  );
};

export default MentionListItemRender;
