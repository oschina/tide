import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/tide-react';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import { EntityType, useRemoteData } from '../../contexts';

import './index.less';

export const MentionMemberNodeView: React.FC<NodeViewProps> = ({
  node,
  extension,
}) => {
  const { class: className, ...props } = mergeAttributes(
    { 'data-type': extension.name },
    extension.options.HTMLAttributes
  );

  const { loading, data: user } = useRemoteData(
    EntityType.MEMBER,
    node.attrs.username
  );

  const name =
    user?.name || user?.username || node.attrs.name || node.attrs.username;
  const avatar = user?.avatar_url;

  const url = extension.options.getLink(node.attrs.url);

  return (
    <NodeViewWrapper
      as="span"
      className={className}
      data-drag-handle
      {...props}
    >
      <a
        className="tide-mention-member__item"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <span className="tide-mention-member__avatar">
          {loading ? <Loading /> : <Avatar src={avatar} username={name} />}
        </span>
        <span className="tide-mention-member__name">{name}</span>
      </a>
    </NodeViewWrapper>
  );
};
