import React from 'react';
import { MentionMemberItemDataType } from '../types';
import Avatar from '../../components/Avatar';
import './index.less';

export const MentionListItemRender: React.FC<{
  item: MentionMemberItemDataType;
}> = ({ item }) => {
  if (!item.attrs) {
    return null;
  }
  return (
    <div className="gwe-mention-member__list-item">
      <span className="gwe-mention-member__list-avatar">
        <Avatar src={item.attrs.avatar_url} username={item.attrs.name} />
      </span>
      <span className="gwe-mention-member__list-item-name">
        {item.attrs.name}
      </span>
    </div>
  );
};
