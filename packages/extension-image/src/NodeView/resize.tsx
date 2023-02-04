import React, { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/core';

export const useResize = (
  imgRef: React.RefObject<HTMLImageElement>,
  editor: Editor,
  onUpdate: (v: { width: number; height: number }) => void,
  onConfirm: () => void
) => {
  const store = useRef({
    focus: false,
    resizing: false,
    clientX: 0,
    clientY: 0,
    imageWidth: 0,
    imageHeight: 0,
    position: '',
    minWidth: 50,
    maxWidth: 0,
  }).current;

  const onMousedown = (position, e) => {
    store.resizing = true;
    store.clientX = e.clientX;
    store.clientY = e.clientY;

    // 此时图片的尺寸
    store.imageWidth = imgRef.current?.width || imgRef.current?.clientWidth;
    store.imageHeight = imgRef.current?.height || imgRef.current?.clientHeight;

    // 此时图片的拉伸方位
    store.position = position;

    // 最大值为 编辑器宽度
    store.maxWidth = editor.view.dom.clientWidth - 80;
  };

  useEffect(() => {
    const onMousemove = (event) => {
      store.focus = true;
      if (store.resizing && store.focus) {
        // 鼠标移动距离
        const distanceX = event.clientX - store.clientX;
        // const distanceY = event.clientY - store.clientY;
        const moveDirection = distanceX;

        // 变化的尺寸
        let width = 0;
        // let height = 0;

        // 方位计算是加还是减
        let scale = 1;

        // 不同方位有着不同的判断逻辑
        const position = store.position;

        // 右上角 右下角
        if (position == 'top-right' || position == 'bottom-right') {
          if (moveDirection > 0) {
            // 住右 放大
            scale = 1;
          }
          if (moveDirection < 0) {
            // 住左 缩小
            scale = -1;
          }
        }

        // 左上角  左下角
        if (position == 'top-left' || position == 'bottom-left') {
          // 住右 缩小
          if (moveDirection > 0) {
            scale = -1;
          }
          // 住左 放大
          if (moveDirection < 0) {
            scale = 1;
          }
        }

        width = store.imageWidth + Math.abs(distanceX) * scale;
        // height = store.imageHeight + distanceY * scale;

        // 目标尺寸
        let imageWidth = 0;
        let imageHeight = 0;

        // 图像的原始比例
        const ratio = store.imageWidth / store.imageHeight;

        // // 选择移动距离大的方向
        // if (Math.abs(distanceX) > Math.abs(distanceY)) {
        // 宽度变化为主
        imageWidth = width;
        imageHeight = width / ratio;
        // } else {
        //   // 高度变化为主
        //   imageHeight = height;
        //   imageWidth = height * ratio;
        // }

        if (imageWidth >= store.maxWidth) return;
        if (imageWidth < store.minWidth) return;

        // 最终设置图片的尺寸
        onUpdate({
          width: Math.round(imageWidth),
          height: Math.round(imageHeight),
        });
      }
    };
    const onMouseup = () => {
      store.resizing = false;
      onConfirm();
    };
    const onMouseOut = () => {
      store.focus = false;
    };

    editor.view.dom.addEventListener('mousemove', onMousemove);
    editor.view.dom.addEventListener('mouseleave', onMouseOut);
    document.addEventListener('mouseup', onMouseup);

    return () => {
      editor.view.dom.removeEventListener('mousemove', onMousemove);
      editor.view.dom.removeEventListener('mouseleave', onMouseOut);
      document.removeEventListener('mouseup', onMousemove);
    };
  }, []);

  return { onMousedown };
};
