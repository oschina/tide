import React from 'react';
import { MentionMemberItemDataType } from './types';

const MentionListItemRender: React.FC<{ item: MentionMemberItemDataType }> = ({
  item,
}) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="gwe-mention-member__item">
      <span className="gwe-mention-member__item-name">{item.attrs.name}</span>
      <span className="gwe-mention-member__item-username">
        {item.attrs.username}
      </span>
    </div>
  );
};

export default MentionListItemRender;
