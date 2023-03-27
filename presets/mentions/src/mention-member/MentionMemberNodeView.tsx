import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/wysiwyg-editor-react';

export const MentionMemberNodeView: React.FC<NodeViewProps> = ({
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
        className="gwe-mention-member__item"
        href={node.attrs.url}
        target="_blank"
        rel="noreferrer"
      >
        <span className="gwe-mention-member__ident">@</span>
        <span className="gwe-mention-member__name">{node.attrs.name}</span>
      </a>
    </NodeViewWrapper>
  );
};
