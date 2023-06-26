import React from 'react';
import { LinkBubbleMenu } from '@gitee/tide-extension-link';
import { TableCellBubbleMenu } from '@gitee/tide-extension-table';
import { ImageBubbleMenu } from '@gitee/tide-extension-image';
import {
  TextBubbleMenu,
  MenuBarContextProvider,
} from '@gitee/tide-extension-menubar';
import { EditorLayout, EditorMenu, EditorContent } from './components';
import type { TideEditor } from './TideEditor';

export type EditorRenderProps = {
  editor: TideEditor | null;
  className?: string;
  style?: React.CSSProperties;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
};

export const EditorRender: React.FC<EditorRenderProps> = ({
  editor,
  className,
  style,
  menuClassName,
  menuStyle,
  contentClassName,
  contentStyle,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <EditorLayout editor={editor} style={style} className={className}>
      <MenuBarContextProvider editor={editor}>
        <EditorMenu
          editor={editor}
          menuStyle={menuStyle}
          menuClassName={menuClassName}
        />
        <EditorContent
          editor={editor}
          contentStyle={contentStyle}
          contentClassName={contentClassName}
        >
          <LinkBubbleMenu editor={editor} />
          <TableCellBubbleMenu editor={editor} />
          <ImageBubbleMenu editor={editor} />
          <TextBubbleMenu editor={editor} />
        </EditorContent>
      </MenuBarContextProvider>
    </EditorLayout>
  );
};

EditorRender.displayName = 'EditorRender';
