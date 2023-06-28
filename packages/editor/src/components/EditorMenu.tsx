import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
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
  MenuBarDivider,
  OrderedList,
  Redo,
  Strike,
  Table,
  TaskList,
  Undo,
} from '@gitee/tide-extension-menubar';
import { useEditorContext } from '../context/EditorContext';
import type { TideEditor } from '../TideEditor';

export const EditorMenu: React.FC<{
  editor: TideEditor | null;
  disabledMenu?: boolean;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
}> = ({ editor, disabledMenu = false, menuClassName, menuStyle }) => {
  const { fullscreen, editable } = useEditorContext();
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
        editor.menuEnableUndoRedo && <Undo key="undo" />,
        editor.menuEnableUndoRedo && <Redo key="redo" />,
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
        editor.menuEnableFullscreen && (
          <Fullscreen
            key="fullscreen"
            fullscreen={fullscreen}
            onFullscreenChange={(newFullscreen) => {
              editor.setFullscreen(newFullscreen);
            }}
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
  }, [
    editor,
    editable,
    fullscreen,
    editor?.menuEnableUndoRedo,
    editor?.menuEnableFullscreen,
  ]);

  if (!editable && !editor.readOnlyShowMenu) {
    return null;
  }

  return (
    <MenuBar
      className={classNames(menuClassName, {
        disabled: editor.readOnlyShowMenu || disabledMenu,
      })}
      style={menuStyle}
    >
      {menuItems}
    </MenuBar>
  );
};
