import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';
import { isActive } from '@test-pkgs/helpers';
import { selectImageUpload } from '@test-pkgs/extension-uploader';
import { InsertTableButton } from '@test-pkgs/extension-table';

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
        className={isActive(editor.state, 'paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 1 }) ? 'is-active' : ''
        }
      >
        h1
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 2 }) ? 'is-active' : ''
        }
      >
        h2
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 3 }) ? 'is-active' : ''
        }
      >
        h3
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 4 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 4 }) ? 'is-active' : ''
        }
      >
        h4
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 5 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 5 }) ? 'is-active' : ''
        }
      >
        h5
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 6 }).run()
        }
        className={
          isActive(editor.state, 'heading', { level: 6 }) ? 'is-active' : ''
        }
      >
        h6
      </button>

      <span className="divider" />

      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={isActive(editor.state, 'bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={isActive(editor.state, 'italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={isActive(editor.state, 'strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={isActive(editor.state, 'code') ? 'is-active' : ''}
      >
        code
      </button>

      <span className="divider" />

      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={isActive(editor.state, 'bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={isActive(editor.state, 'orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        className={isActive(editor.state, 'taskList') ? 'is-active' : ''}
      >
        task list
      </button>

      <span className="divider" />

      <button
        onClick={() => editor?.chain().focus().toggleLink({ href: '' }).run()}
        className={isActive(editor.state, 'link') ? 'is-active' : ''}
      >
        link
      </button>
      <button
        onClick={() => selectImageUpload(editor)}
        className={isActive(editor.state, 'image') ? 'is-active' : ''}
      >
        image
      </button>
      <InsertTableButton editor={editor}>
        <button className={isActive(editor.state, 'table') ? 'is-active' : ''}>
          table
        </button>
      </InsertTableButton>
      <button
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={isActive(editor.state, 'blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        className={isActive(editor.state, 'codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        className={isActive(editor.state, 'horizontalRule') ? 'is-active' : ''}
      >
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
