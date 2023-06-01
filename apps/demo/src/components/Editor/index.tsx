import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
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
import type { Editor } from '@gitee/wysiwyg-editor-react';
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
  menuEnableUndoRedo?: boolean;
  menuEnableFullscreen?: boolean;
  readOnlyShowMenu?: boolean;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
};

export const WysiwygEditor = forwardRef<Editor, EditorRenderProps>(
  (
    {
      className,
      style,
      menuClassName,
      menuStyle,
      menuEnableUndoRedo = true,
      menuEnableFullscreen = true,
      readOnlyShowMenu = false,
      contentClassName,
      contentStyle,
      ...editorContentProps
    },
    ref
  ) => {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    console.log('WysiwygEditor', editor);

    const menuItems = useMemo(() => {
      if (!editor) {
        return null;
      }
      const {
        heading,
        bulletList,
        orderedList,
        taskList,
        image,
        table,
        codeBlock,
        blockquote,
        horizontalRule,
        emoji,
      } = editor.state.schema.nodes;
      const { bold, italic, strike, link, code } = editor.state.schema.marks;
      return [
        [
          menuEnableUndoRedo && <Undo key="undo" />,
          menuEnableUndoRedo && <Redo key="redo" />,
        ],
        [
          heading && <Heading key="heading" />,
          bold && <Bold key="bold" />,
          italic && <Italic key="italic" />,
          strike && <Strike key="strike" />,
          code && <Code key="code" />,
        ],
        [
          bulletList && <BulletList key="bulletList" />,
          orderedList && <OrderedList key="orderedList" />,
          taskList && <TaskList key="taskList" />,
        ],
        [
          link && <Link key="link" />,
          image && <Image key="image" />,
          table && <Table key="table" />,
          codeBlock && <CodeBlock key="codeBlock" />,
        ],
        [
          blockquote && <Blockquote key="blockquote" />,
          horizontalRule && <HorizontalRule key="horizontalRule" />,
          emoji && <Emoji key="emoji" />,
        ],
        [
          menuEnableFullscreen && (
            <Fullscreen
              key="fullscreen"
              fullscreen={fullscreen}
              onFullscreenChange={setFullscreen}
            />
          ),
        ],
      ]
        .map((group) => group.filter(Boolean))
        .filter((group) => group.length > 0)
        .map((group, index, items) => (
          <React.Fragment key={index}>
            {group}
            {index < items.length - 1 && <MenuBarDivider />}
          </React.Fragment>
        ));
    }, [editor, menuEnableUndoRedo, menuEnableFullscreen]);

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
          {editor && !(editorContentProps?.readOnly && !readOnlyShowMenu) && (
            <MenuBar
              className={classNames(menuClassName, {
                disabled: readOnlyShowMenu,
              })}
              style={menuStyle}
            >
              {menuItems}
            </MenuBar>
          )}
          <EditorContent
            className={contentClassName}
            style={contentStyle}
            ref={setEditor}
            {...editorContentProps}
          >
            {editor && (
              <>
                <LinkBubbleMenu editor={editor} />
                <TableCellBubbleMenu editor={editor} />
                <ImageBubbleMenu editor={editor} />
                <TextBubbleMenu editor={editor} />
              </>
            )}
          </EditorContent>
        </MenuBarContextProvider>
      </div>
    );

    return fullscreen ? <Portal>{content}</Portal> : content;
  }
);

WysiwygEditor.displayName = 'WysiwygEditor';
