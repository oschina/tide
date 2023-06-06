import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { LinkBubbleMenu } from '@gitee/wysiwyg-editor-extension-link';
import { TableCellBubbleMenu } from '@gitee/wysiwyg-editor-extension-table';
import { ImageBubbleMenu } from '@gitee/wysiwyg-editor-extension-image';
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
import type { Editor } from '@gitee/wysiwyg-editor-react';
import { EditorContent, EditorContentProps } from './EditorContent';
import './EditorRender.less';

export type EditorRenderProps = Omit<
  EditorContentProps,
  'className' | 'style' | 'children'
> & {
  className?: string;
  style?: React.CSSProperties;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
  menuEnableUndoRedo?: boolean;
  menuEnableFullscreen?: boolean;
  readOnlyShowMenu?: boolean;
  fullscreen?: boolean;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  onFullscreenChange?: (fullscreen: boolean) => void;
};

export const EditorRender: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorRenderProps> & React.RefAttributes<Editor>
> = forwardRef<Editor, EditorRenderProps>(
  (
    {
      className,
      style,
      menuClassName,
      menuStyle,
      menuEnableUndoRedo = true,
      menuEnableFullscreen = true,
      readOnlyShowMenu = false,
      fullscreen: initFullscreen = false,
      contentClassName,
      contentStyle,
      onFullscreenChange,
      ...editorContentProps
    },
    ref
  ) => {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [fullscreen, setFullscreen] = useState(initFullscreen);

    const handleFullscreenChange = useCallback(
      (isFullscreen: boolean) => {
        setFullscreen(isFullscreen);
        onFullscreenChange?.(isFullscreen);
      },
      [onFullscreenChange]
    );

    useImperativeHandle(ref, () => editor, [editor]);

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
              onFullscreenChange={handleFullscreenChange}
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
    }, [editor, menuEnableUndoRedo, menuEnableFullscreen, fullscreen]);

    useEffect(() => {
      if (editorContentProps.autoFocus) {
        editor?.commands.focus(editorContentProps.autoFocus);
      }
    }, [fullscreen, editorContentProps.autoFocus]);

    return (
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
  }
);

EditorRender.displayName = 'EditorRender';
