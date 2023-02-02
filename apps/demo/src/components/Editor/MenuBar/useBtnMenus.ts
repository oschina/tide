import { useMemo } from 'react';
import { Editor } from '@tiptap/core';
import { selectImageUpload } from '@test-pkgs/extension-uploader';
import { menuKey } from './useStatusMap';

interface BtnMenu {
  name: menuKey | 'divider';
  icon?: string;
  title?: string;
  onClick?: () => void;
  bubble?: boolean;
}

const useBtnMenus = (editor: Editor) => {
  return useMemo<BtnMenu[]>(
    () => [
      {
        name: 'bold',
        icon: 'B',
        title: '加粗 (Ctrl + B)',
        onClick: () => editor.chain().focus().toggleBold().run(),
        // 悬浮菜单是否显示
        bubble: true,
      },
      {
        name: 'italic',
        icon: 'I',
        title: '斜体 (Ctrl + I)',
        onClick: () => editor.chain().focus().toggleItalic().run(),
        bubble: true,
      },
      {
        name: 'strike',
        icon: 'S',
        title: '删除线 (Ctrl + Shift + X)',
        onClick: () => editor.chain().focus().toggleStrike().run(),
        bubble: true,
      },
      {
        name: 'code',
        icon: 'C',
        title: '行内代码',
        onClick: () => editor.chain().focus().toggleCode().run(),
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
        bubble: true,
      },
      {
        name: 'orderedList',
        icon: 'ol',
        title: '有序列表 (Ctrl + Shift + 7)',
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        bubble: true,
      },
      {
        name: 'taskList',
        icon: 'tl',
        title: '任务列表 (Ctrl + Shift + 9)',
        onClick: () => editor.chain().focus().toggleTaskList().run(),
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
        bubble: true,
      },
      {
        name: 'image',
        icon: 'img',
        title: '图片',
        onClick: () => selectImageUpload(editor),
      },
      {
        name: 'table',
        title: 'Table',
      },
      {
        name: 'codeBlock',
        icon: 'cb',
        title: '代码块',
        onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'blockquote',
        icon: '“',
        title: '引用 (Ctrl + Shift + >)',
        onClick: () => editor?.chain().focus().toggleBlockquote().run(),
        bubble: true,
      },
      {
        name: 'horizontalRule',
        icon: '—',
        title: '分割线 (Ctrl + Alt + S)',
        onClick: () => editor?.chain().focus().setHorizontalRule().run(),
      },
      {
        name: 'emoji',
        title: 'Emoji',
      },
      {
        name: 'divider',
      },
    ],
    [editor]
  );
};

export default useBtnMenus;
