import React, { useRef } from 'react';
import classNames from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@test-pkgs/react';
import { useResize } from './resize';

import styles from './ImageNodeView.module.less';

const resizeBtn = [
  {
    position: 'top-left',
    className: styles['top-left-btn'],
  },
  {
    position: 'top-right',
    className: styles['top-right-btn'],
  },
  {
    position: 'bottom-right',
    className: styles['bottom-right-btn'],
  },
  {
    position: 'bottom-left',
    className: styles['bottom-left-btn'],
  },
];

const ImageNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
}) => {
  const imgRef = useRef<HTMLImageElement>();
  const { onMousedown } = useResize(
    editor,
    ({ width, height }) => {
      if (imgRef.current) {
        imgRef.current.style.width = `${width}px`;
        imgRef.current.style.height = `${height}px`;
      }
    },
    () => {
      const width = imgRef.current?.width;
      const height = imgRef.current?.height;
      if (width && height) {
        updateAttributes({ width, height });
      }
    }
  );

  return (
    <NodeViewWrapper
      draggable={node.type.spec.draggable}
      className={classNames(node.attrs.className, styles['image-wrapper'], {
        [styles['align-left']]: node.attrs.align === 'left',
        [styles['align-center']]: node.attrs.align === 'center',
        [styles['align-right']]: node.attrs.align === 'right',
      })}
    >
      <div className={styles['image-resize-view']}>
        {resizeBtn.map((item) => {
          return (
            <div
              key={item.position}
              className={classNames(styles['draggable-btn'], item.className)}
              onMouseDown={(e) => onMousedown(item.position, e)}
            />
          );
        })}
        <div className={styles['img-highlight']}>
          <img
            ref={imgRef}
            src={node.attrs.src}
            alt={node.attrs.alt}
            style={{
              width: node.attrs.width,
              height: node.attrs.height,
            }}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageNodeView;
