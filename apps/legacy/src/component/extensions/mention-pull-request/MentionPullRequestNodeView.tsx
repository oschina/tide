import React from 'react';
import classNames from 'classnames';
import { mergeAttributes, NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@gitee/wysiwyg-editor-react';
import styles from './MentionPullRequestNodeView.module.less';

export const MentionPullRequestNodeView: React.FC<NodeViewProps> = ({
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
        className={classNames(styles.mentionPullRequest)}
        href={node.attrs.url}
        target={editor.isEditable ? '_blank' : undefined}
        rel="noreferrer"
        title={node.attrs.title}
      >
        <span>!</span>
        <span className={styles.name}>{node.attrs.title}</span>
      </a>
    </NodeViewWrapper>
  );
};
