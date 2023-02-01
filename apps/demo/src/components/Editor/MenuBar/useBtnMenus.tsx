import { useMemo } from 'react';
import { Editor } from '@tiptap/core';
import { selectImageUpload } from '@test-pkgs/extension-uploader';

const useBtnMenus = (editor: Editor) => {
  return useMemo(
    () => [
      {
        name: 'bold',
        icon: 'B',
        title: '加粗 (Ctrl + B)',
        onClickName: 'toggleBold',
        onClick: () => editor.chain().focus().toggleBold().run(),
        disabled: !editor?.can().chain().focus().toggleBold().run(),
        // 悬浮菜单是否显示
        bubble: true,
      },
      {
        name: 'italic',
        icon: 'I',
        title: '斜体 (Ctrl + I)',
        onClick: () => editor.chain().focus().toggleItalic().run(),
        disabled: !editor?.can().chain().focus().toggleItalic().run(),
        bubble: true,
      },
      {
        name: 'strike',
        icon: 'S',
        title: '删除线 (Ctrl + Shift + X)',
        onClick: () => editor.chain().focus().toggleStrike().run(),
        disabled: !editor?.can().chain().focus().toggleStrike().run(),
        bubble: true,
      },
      {
        name: 'code',
        icon: 'C',
        title: '行内代码',
        onClick: () => editor.chain().focus().toggleCode().run(),
        disabled: !editor?.can().chain().focus().toggleCode().run(),
        bubble: true,
      },
      {
        name: 'divider',
        bubble: true,
      },
      {
        name: 'bulletList',
        icon: 'bl',
        title: '无序列表 (Ctrl + Shift + 8)',
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        disabled: !editor.can().chain().focus().toggleBulletList().run(),
        bubble: true,
      },
      {
        name: 'orderedList',
        icon: 'ol',
        title: '有序列表 (Ctrl + Shift + 7)',
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        disabled: !editor.can().chain().focus().toggleOrderedList().run(),
        bubble: true,
      },
      {
        name: 'taskList',
        icon: 'tl',
        title: '任务列表 (Ctrl + Shift + 9)',
        onClick: () => editor.chain().focus().toggleTaskList().run(),
        disabled: !editor.can().chain().focus().toggleTaskList().run(),
        bubble: true,
      },
      {
        name: 'divider',
      },
      {
        name: 'link',
        icon: 'lin',
        title: '链接 (Ctrl + K)',
        onClick: () => editor.chain().focus().toggleLink({ href: '' }).run(),
        // TODO: link disabled (code block)
        disabled: !editor.can().chain().focus().toggleMark('link').run(),
      },
      {
        name: 'image',
        icon: 'img',
        title: '图片',
        onClick: () => selectImageUpload(editor),
        disabled: !editor.can().chain().focus().uploadImage([]).run(),
      },
      {
        name: 'table',
        title: 'Table',
        disabled: !editor.can().chain().focus().insertTable().run(),
      },
      {
        name: 'codeBlock',
        icon: 'cb',
        title: '代码块',
        onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
        disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'blockquote',
        icon: '“',
        title: '引用 (Ctrl + Shift + >)',
        onClick: () => editor?.chain().focus().toggleBlockquote().run(),
        disabled: !editor.can().chain().focus().toggleBlockquote().run(),
        bubble: true,
      },
      {
        name: 'horizontalRule',
        icon: '—',
        title: '分割线 (Ctrl + Alt + S)',
        onClick: () => editor?.chain().focus().setHorizontalRule().run(),
        disabled: !editor.can().chain().focus().setHorizontalRule().run(),
      },
      {
        name: 'divider',
      },
    ],
    [editor]
  );
};

export default useBtnMenus;
