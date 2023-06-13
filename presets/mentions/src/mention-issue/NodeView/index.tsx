import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/tide-react';
import Loading from '../../components/Loading';
import IssueIcons from '../Icons';
import { EntityType, useRemoteData } from '../../contexts';

import './index.less';

export const MentionIssueNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  extension,
}) => {
  const { class: className, ...props } = mergeAttributes(
    { 'data-type': extension.name },
    extension.options.HTMLAttributes
  );

  const { loading, data: issue } = useRemoteData(
    EntityType.ISSUE,
    node.attrs.ident
  );

  const title = issue?.title || node.attrs.title;
  const category = issue?.issue_type?.category;
  const url = extension.options.getLink(node.attrs.url);

  return (
    <NodeViewWrapper
      as="span"
      className={className}
      data-drag-handle
      {...props}
    >
      <a
        className="tide-mention-issue"
        href={url}
        target={editor.isEditable ? '_blank' : undefined}
        rel="noreferrer"
        title={node.attrs.title}
      >
        {loading ? (
          <Loading className="tide-mention-issue__icon" />
        ) : (
          <IssueIcons
            className="tide-mention-issue__icon"
            category={category}
          />
        )}
        <span className={'tide-mention-issue__title'}>{title}</span>
      </a>
    </NodeViewWrapper>
  );
};
