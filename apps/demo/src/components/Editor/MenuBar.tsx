import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { uploadImage } from '@test-pkgs/extension-image';

type MenuBarProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  editor?: Editor | null;
  fullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
};

const MenuBar: React.FC<MenuBarProps> = ({
  className,
  style,
  editor,
  fullscreen,
  onFullscreenChange,
}) => {
  const [menuBarRefreshKey, setMenuBarRefreshKey] = useState<number>(0);

  useEffect(() => {
    const listener = () => {
      setMenuBarRefreshKey((prev) => prev + 1);
    };
    editor?.on('selectionUpdate', listener);
    return () => {
      editor?.off('selectionUpdate', listener);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      key={menuBarRefreshKey}
      className={classNames('ge-editor__menu-bar', className)}
      style={style}
    >
      <button
        onClick={() => editor?.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 4 }).run()
        }
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 5 }).run()
        }
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 6 }).run()
        }
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>

      <span className="divider" />

      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>

      <span className="divider" />

      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        className={editor.isActive('taskList') ? 'is-active' : ''}
      >
        task list
      </button>

      <span className="divider" />

      <button
        onClick={() => uploadImage(editor)}
        className={editor.isActive('image') ? 'is-active' : ''}
      >
        image
      </button>

      <button
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        insertTable
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>

      <span className="divider" />

      <button
        onClick={() => onFullscreenChange?.(!fullscreen)}
        className={fullscreen ? 'is-active' : ''}
      >
        fullscreen
      </button>
    </div>
  );
};

export default MenuBar;
