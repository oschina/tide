import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/wysiwyg-editor-react';
import './MentionIssueNodeView.less';

export const MentionIssueNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  extension,
}) => {
  const { class: className, ...props } = mergeAttributes(
    { 'data-type': extension.name },
    extension.options.HTMLAttributes
  );

  return (
    <NodeViewWrapper
      as="span"
      className={className}
      data-drag-handle
      {...props}
    >
      <a
        className="gwe-mention-issue"
        href={node.attrs.url}
        target={editor.isEditable ? '_blank' : undefined}
        rel="noreferrer"
        title={node.attrs.title}
      >
        <span className="gwe-mention-issue__id">#{node.attrs.ident}:</span>
        <span className={'gwe-mention-issue__title'}>{node.attrs.title}</span>
      </a>
    </NodeViewWrapper>
  );
};
