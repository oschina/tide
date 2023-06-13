import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/tide-react';
import Loading from '../../components/Loading';
import { StateIcon } from '../Icons/PullRequestIcon';
import { useRemoteData, EntityType } from '../../contexts';

import './index.less';

export const MentionPullRequestNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  extension,
}) => {
  const { class: className, ...props } = mergeAttributes(
    { 'data-type': extension.name },
    extension.options.HTMLAttributes
  );

  const { loading, data: pull } = useRemoteData(
    EntityType.PULL_REQUEST,
    node.attrs.id
  );
  const title = pull?.title || node.attrs.title;
  const url = extension.options.getLink(node.attrs.url);

  return (
    <NodeViewWrapper
      as="span"
      className={className}
      data-drag-handle
      {...props}
    >
      <a
        className="tide-mention-pull-request"
        href={url}
        target={editor.isEditable ? '_blank' : undefined}
        rel="noreferrer"
        title={node.attrs.title}
      >
        <span className="tide-mention-pull-request__icon">
          {loading ? <Loading /> : <StateIcon state={pull?.state} />}
        </span>
        <span className="tide-mention-pull-request__title">{title}</span>
      </a>
    </NodeViewWrapper>
  );
};
