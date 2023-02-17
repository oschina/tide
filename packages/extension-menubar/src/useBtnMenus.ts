import { useMemo } from 'react';
import { Editor } from '@tiptap/core';
import { selectImageUpload } from '@gitee/wysiwyg-editor-extension-uploader';
import { isWindows } from '@gitee/wysiwyg-editor-common';
import { menuKey } from './useStatusMap';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    collaboration: {
      /**
       * Undo recent changes
       */
      undo: () => ReturnType;
      /**
       * Reapply reverted changes
       */
      redo: () => ReturnType;
    };
    paragraph: {
      /**
       * Toggle a paragraph
       */
      setParagraph: () => ReturnType;
    };
    bold: {
      /**
       * Toggle a bold mark
       */
      toggleBold: () => ReturnType;
    };
    strike: {
      /**
       * Toggle a strike mark
       */
      toggleStrike: () => ReturnType;
    };
    italic: {
      /**
       * Toggle an italic mark
       */
      toggleItalic: () => ReturnType;
    };
    code: {
      /**
       * Toggle inline code
       */
      toggleCode: () => ReturnType;
    };
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleBulletList: () => ReturnType;
    };
    orderedList: {
      /**
       * Toggle an ordered list
       */
      toggleOrderedList: () => ReturnType;
    };
    taskList: {
      /**
       * Toggle a task list
       */
      toggleTaskList: () => ReturnType;
    };
    link: {
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: {
        href: string;
        target?: string | null;
      }) => ReturnType;
    };
    codeBlock: {
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
    };
    blockQuote: {
      /**
       * Toggle a blockquote node
       */
      toggleBlockquote: () => ReturnType;
    };
    horizontalRule: {
      /**
       * Add a horizontal rule
       */
      setHorizontalRule: () => ReturnType;
    };
  }
}

interface BtnMenu {
  name: menuKey | 'divider';
  title?: string;
  onClick?: () => void;
  bubble?: boolean;
}

const useBtnMenus = (editor: Editor) => {
  const command = isWindows() ? 'Ctrl' : '⌘';
  return useMemo<BtnMenu[]>(
    () => [
      {
        name: 'undo',
        title: `撤销 (${command} + Z)`,
        onClick: () => editor?.chain().focus().undo?.().run(),
        bubble: false,
      },
      {
        name: 'redo',
        title: `重做 (${command} + Shift + Z)`,
        onClick: () => editor.chain().focus().redo().run(),
        bubble: false,
      },
      {
        name: 'divider',
        bubble: false,
      },
      {
        name: 'bold',
        title: `加粗 (${command} + B)`,
        onClick: () => editor.chain().focus().toggleBold().run(),
        // 悬浮菜单是否显示
        bubble: true,
      },
      {
        name: 'italic',
        title: `斜体 (${command} + I)`,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        bubble: true,
      },
      {
        name: 'strike',
        title: `删除线 (${command} + Shift + X)`,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        bubble: true,
      },
      {
        name: 'code',
        title: `行内代码 (${command} + E)`,
        onClick: () => editor.chain().focus().toggleCode().run(),
        bubble: true,
      },
      {
        name: 'divider',
        bubble: true,
      },
      {
        name: 'bulletList',
        title: `无序列表 (${command} + Shift + 8)`,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        name: 'orderedList',
        title: `有序列表 (${command} + Shift + 7)`,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        name: 'taskList',
        title: `任务列表 (${command} + Shift + 9)`,
        onClick: () => editor.chain().focus().toggleTaskList().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'link',
        title: `链接 (${command} + K)`,
        onClick: () => editor.chain().focus().toggleLink({ href: '' }).run(),
        bubble: true,
      },
      {
        name: 'image',
        title: '图片',
        onClick: () => selectImageUpload(editor),
      },
      {
        name: 'table',
        title: 'Table',
      },
      {
        name: 'codeBlock',
        title: '代码块',
        onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
      },
      {
        name: 'divider',
      },
      {
        name: 'blockquote',
        title: `引用 (${command} + Shift + >)`,
        onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      },
      {
        name: 'horizontalRule',
        title: isWindows()
          ? '分割线 (Ctrl + Alt + S)'
          : '分割线 (⌘ + Option + S)',
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
