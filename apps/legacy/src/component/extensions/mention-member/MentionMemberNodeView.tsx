import React from 'react';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/wysiwyg-editor-react';
import styles from './MentionMemberNodeView.module.less';

export const MentionMemberNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  extension,
}) => {
  const { class: className, ...props } = mergeAttributes(
    { 'data-type': extension.name },
    extension.options.HTMLAttributes
  );

  const content = (
    <>
      <span className={styles.avatar}>@</span>
      <span className={styles.name}>{node.attrs.name}</span>
    </>
  );

  return (
    <NodeViewWrapper
      as="span"
      className={className}
      data-drag-handle
      {...props}
    >
      {editor.isEditable ? (
        <span className={styles.mention}>{content}</span>
      ) : (
        <a className={styles.mention} href={node.attrs.url} target="_blank">
          {content}
        </a>
      )}
    </NodeViewWrapper>
  );
};
