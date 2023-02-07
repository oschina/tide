import { Editor } from '@tiptap/core';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { useState } from 'react';

export type menuKey =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'link'
  | 'image'
  | 'table'
  | 'codeBlock'
  | 'blockquote'
  | 'horizontalRule'
  | 'emoji';

export type MenuStatusMap = {
  [k in menuKey]: { isActive: boolean; disabled: boolean };
};

const generateInitStatus = () => {
  const list: menuKey[] = [
    'bold',
    'italic',
    'strike',
    'code',
    'bulletList',
    'orderedList',
    'taskList',
    'link',
    'image',
    'table',
    'codeBlock',
    'blockquote',
    'horizontalRule',
    'emoji',
  ];
  const statusData: any = {};
  for (const item of list) {
    statusData[item] = { isActive: false, disabled: false };
  }
  return statusData;
};

export const useStatusMap = (editor: Editor) => {
  const [statusMap, setStatusMap] = useState<MenuStatusMap>(
    generateInitStatus()
  );

  const updateStatusMap = () => {
    const data = {
      bold: {
        isActive: isActive(editor.state, 'bold'),
        disabled: !editor?.can().chain().focus().toggleBold().run(),
      },
      italic: {
        isActive: isActive(editor.state, 'italic'),
        disabled: !editor?.can().chain().focus().toggleItalic().run(),
      },
      strike: {
        isActive: isActive(editor.state, 'strike'),
        disabled: !editor?.can().chain().focus().toggleStrike().run(),
      },
      code: {
        isActive: isActive(editor.state, 'code'),
        disabled: !editor?.can().chain().focus().toggleCode().run(),
      },
      bulletList: {
        isActive: isActive(editor.state, 'bulletList'),
        disabled: !editor?.can().chain().focus().toggleBulletList().run(),
      },
      orderedList: {
        isActive: isActive(editor.state, 'orderedList'),
        disabled: !editor?.can().chain().focus().toggleOrderedList().run(),
      },
      taskList: {
        isActive: isActive(editor.state, 'taskList'),
        disabled: !editor?.can().chain().focus().toggleTaskList().run(),
      },
      link: {
        isActive: isActive(editor.state, 'link'),
        // TODO: link disabled (code block)
        disabled: !editor.can().chain().focus().toggleMark('link').run(),
      },
      image: {
        isActive: isActive(editor.state, 'image'),
        disabled: !editor.can().chain().focus().uploadImage([]).run(),
      },
      table: {
        isActive: isActive(editor.state, 'table'),
        disabled: !editor.can().chain().focus().insertTable().run(),
      },
      codeBlock: {
        isActive: isActive(editor.state, 'codeBlock'),
        disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
      },
      blockquote: {
        isActive: isActive(editor.state, 'blockquote'),
        disabled: !editor.can().chain().focus().toggleBlockquote().run(),
      },
      horizontalRule: {
        isActive: isActive(editor.state, 'horizontalRule'),
        disabled: !editor.can().chain().focus().setHorizontalRule().run(),
      },
      emoji: {
        isActive: isActive(editor.state, 'emoji'),
        // TODO: 待添加emoji的disabled的状态
        disabled: false,
      },
    };
    setStatusMap(data);
  };

  return {
    statusMap,
    updateStatusMap,
  };
};
