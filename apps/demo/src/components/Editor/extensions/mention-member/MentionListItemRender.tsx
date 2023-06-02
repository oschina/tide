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
      <span
        style={{
          marginLeft: 16,
          color: '#b0b0b0',
        }}
      >
        {item.desc}
      </span>
    </>
  );
};

export default MentionListItemRender;
