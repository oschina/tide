import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  MenuBar,
  TextBubbleMenu,
} from '@gitee/wysiwyg-editor-extension-menubar';
import { LinkBubbleMenu } from '@gitee/wysiwyg-editor-extension-link';
import { TableCellBubbleMenu } from '@gitee/wysiwyg-editor-extension-table';
import { ImageBubbleMenu } from '@gitee/wysiwyg-editor-extension-image';
import type { MarkdownEditor } from '@gitee/wysiwyg-editor-markdown';
import EditorContent, { EditorContentProps } from './EditorContent';
import './index.less';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  createPortal(children, document.body);

export type EditorRenderProps = Omit<
  EditorContentProps,
  'className' | 'style'
> & {
  className?: string;
  style?: React.CSSProperties | undefined;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
};

export const WysiwygEditor = forwardRef<MarkdownEditor, EditorRenderProps>(
  (
    {
      className,
      style,
      menuClassName,
      menuStyle,
      contentClassName,
      contentStyle,
      ...editorContentProps
    },
    ref
  ) => {
    const [editor, setEditor] = useState<MarkdownEditor | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    useImperativeHandle(ref, () => editor as MarkdownEditor, [editor]);

    console.log('WysiwygEditor', editor);

    const content = (
      <div
        className={classNames(
          'gwe-editor',
          { 'gwe-editor--fullscreen': fullscreen },
          className
        )}
        style={style}
      >
        {editor && !editorContentProps?.readOnly && (
          <MenuBar
            className={menuClassName}
            style={menuStyle}
            editor={editor}
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        )}
        <EditorContent
          className={contentClassName}
          style={contentStyle}
          ref={setEditor}
          {...editorContentProps}
        >
          {editor && <LinkBubbleMenu editor={editor} />}
          {editor && <TableCellBubbleMenu editor={editor} />}
          {editor && <ImageBubbleMenu editor={editor} />}
          {editor && <TextBubbleMenu editor={editor} />}
        </EditorContent>
      </div>
    );

    return fullscreen ? <Portal>{content}</Portal> : content;
  }
);

WysiwygEditor.displayName = 'WysiwygEditor';
