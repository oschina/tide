import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Emoji,
  Fullscreen,
  Heading,
  HorizontalRule,
  Image,
  Italic,
  Link,
  MenuBar,
  MenuBarContextProvider,
  MenuBarDivider,
  OrderedList,
  Redo,
  Strike,
  Table,
  TaskList,
  TextBubbleMenu,
  Undo,
} from '@gitee/wysiwyg-editor-extension-menubar';
import { LinkBubbleMenu } from '@gitee/wysiwyg-editor-extension-link';
import { TableCellBubbleMenu } from '@gitee/wysiwyg-editor-extension-table';
import { ImageBubbleMenu } from '@gitee/wysiwyg-editor-extension-image';
import type { MarkdownEditor } from '@gitee/wysiwyg-editor-markdown';
import type { Editor } from '@gitee/wysiwyg-editor-react';
import EditorContent, { EditorContentProps } from './Editor';

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

export const LegacyEditor = forwardRef<MarkdownEditor, EditorRenderProps>(
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
        <MenuBarContextProvider editor={editor as unknown as Editor}>
          {editor && !editorContentProps?.readOnly && (
            <MenuBar className={menuClassName} style={menuStyle}>
              <Undo />
              <Redo />
              <MenuBarDivider />
              <Heading />
              <Bold />
              <Italic />
              <Strike />
              <Code />
              <MenuBarDivider />
              <BulletList />
              <OrderedList />
              <TaskList />
              <MenuBarDivider />
              <Link />
              <Image />
              <Table />
              <CodeBlock />
              <MenuBarDivider />
              <Blockquote />
              <HorizontalRule />
              <Emoji />
              <MenuBarDivider />
              <Fullscreen
                fullscreen={fullscreen}
                onFullscreenChange={setFullscreen}
              />
            </MenuBar>
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
        </MenuBarContextProvider>
      </div>
    );

    return fullscreen ? <Portal>{content}</Portal> : content;
  }
);

LegacyEditor.displayName = 'LegacyEditor';

export function renderOnEl(opts: { el: HTMLElement; content?: string }) {
  ReactDOM.render(<LegacyEditor />, opts.el);
}
