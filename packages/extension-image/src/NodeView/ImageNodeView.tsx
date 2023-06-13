import React, { useRef } from 'react';
import classNames from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { NodeViewWrapper } from '@gitee/tide-react';
import { useResize } from './resize';

import './ImageNodeView.less';

const resizeBtn = [
  {
    position: 'top-left',
    className: 'tide-image__view-resize-btn-top-left',
  },
  {
    position: 'top-right',
    className: 'tide-image__view-resize-btn-top-right',
  },
  {
    position: 'bottom-right',
    className: 'tide-image__view-resize-btn-bottom-right',
  },
  {
    position: 'bottom-left',
    className: 'tide-image__view-resize-btn-bottom-left',
  },
];

const ImageNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  getPos,
}) => {
  const { isEditable } = editor;
  const imgRef = useRef<HTMLImageElement>(null);
  const { onMousedown } = useResize(
    imgRef,
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

  const selectImage = () => {
    const { view } = editor;
    const selection = NodeSelection.create(view.state.doc, getPos());
    const transaction = view.state.tr.setSelection(selection);
    view.dispatch(transaction);
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={classNames(node.attrs.className, 'tide-image', {
        'tide-image__align-left': node.attrs.align === 'left',
        'tide-image__align-center': node.attrs.align === 'center',
        'tide-image__align-right': node.attrs.align === 'right',
      })}
    >
      <div
        className={classNames('tide-image__view', {
          'tide-image__view-hover': isEditable,
        })}
      >
        <div className={classNames('tide-image__view-resize')}>
          {resizeBtn.map((item) => {
            return (
              <div
                key={item.position}
                className={classNames(
                  'tide-image__view-resize-btn',
                  item.className
                )}
                onMouseDown={(e) => {
                  selectImage();
                  onMousedown(item.position, e);
                }}
              />
            );
          })}
        </div>
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
    </NodeViewWrapper>
  );
};

export default ImageNodeView;
