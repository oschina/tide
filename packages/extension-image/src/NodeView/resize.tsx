import React, { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import { selectionCellInfo } from '@gitee/tide-common';
import { throttle } from 'lodash-es';

export const useResize = (
  imgRef: React.RefObject<HTMLImageElement>,
  editor: Editor,
  onUpdate: (v: { width: number; height: number }) => void,
  onConfirm: () => void
) => {
  const store = useRef({
    newWidth: 0,
    newHeight: 0,
    originWidth: 0,
    originHeight: 0,
    focus: false,
    resizing: false,
    clientX: 0,
    clientY: 0,
    position: '',
    minWidth: 20,
    maxWidth: 0,
  }).current;

  const onMousedown = (position, e) => {
    store.resizing = true;
    store.clientX = e.clientX;
    store.clientY = e.clientY;

    // 此时图片的尺寸
    const originWidth = imgRef.current?.width || imgRef.current?.clientWidth;
    const originHeight = imgRef.current?.height || imgRef.current?.clientHeight;
    store.newWidth = originWidth;
    store.newHeight = originHeight;

    store.originWidth = originWidth;
    store.originHeight = originHeight;

    // 此时图片的拉伸方位
    store.position = position;

    // 最大值为 编辑器宽度
    store.maxWidth = editor.view.dom.clientWidth - 80;

    // 不能超过单元格
    const { isInTableCel, tableCellWidth } = selectionCellInfo(editor.view);
    if (isInTableCel) {
      store.maxWidth = tableCellWidth;
    }
  };

  useEffect(() => {
    const throttleUpdate = throttle(onUpdate, 20);
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

        width = store.originWidth + Math.abs(distanceX) * scale;
        // height = store.imageHeight + distanceY * scale;

        // 目标尺寸
        let imageWidth = 0;
        let imageHeight = 0;

        // 图像的原始比例
        const ratio = store.originWidth / store.originHeight;

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

        const newWidth = Math.round(imageWidth);
        const newHeight = Math.round(imageHeight);
        store.newWidth = newWidth;
        store.newHeight = newHeight;

        // 最终设置图片的尺寸
        throttleUpdate({ width: newWidth, height: newHeight });
      }
    };
    const onMouseup = () => {
      store.resizing = false;

      //  没有变化不触发更新
      if (
        store.newWidth === store.originWidth &&
        store.newHeight === store.originHeight
      ) {
        return;
      }

      // 回调
      onConfirm();

      //更新为拖拽后的 宽高
      store.originWidth = store.newWidth;
      store.originHeight = store.newHeight;
    };

    const onMouseLeave = () => {
      store.focus = false;

      // 结束拖拽
      onMouseup();
    };

    editor.view.dom.addEventListener('mousemove', onMousemove);
    editor.view.dom.addEventListener('mouseup', onMouseup);
    editor.view.dom.addEventListener('mouseleave', onMouseLeave);

    return () => {
      editor.view.dom.removeEventListener('mousemove', onMousemove);
      editor.view.dom.removeEventListener('mouseup', onMouseup);
      editor.view.dom.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return { onMousedown };
};
