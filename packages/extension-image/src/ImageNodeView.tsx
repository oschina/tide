import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@test-pkgs/react';
import { getSrc } from './plugin/img';
import styles from './ImageNodeView.module.less';

const ImageNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  extension,
}) => {
  console.log('--------------------------------');
  console.log(node);

  return (
    <NodeViewWrapper className={classNames(node.attrs.className)}>
      <div>
        <div>
          <NodeViewContent
            as="img"
            src={node.attrs.src}
            alt={node.attrs.alt}
            style={{
              width: node.attrs.width,
              height: node.attrs.height,
            }}
          />
          <div></div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageNodeView;
