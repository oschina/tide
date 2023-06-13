import React, { useMemo } from 'react';
import { sticky } from 'tippy.js';
import { Editor, isTextSelection } from '@tiptap/core';
import { isActive } from '@gitee/tide-common';
import { BubbleMenu } from '@gitee/tide-react';
import { Bold, Code, Italic, Link, Strike, MenuBarDivider } from './components';

export type TextBubbleMenuProps = {
  editor: Editor;
};

export const TextBubbleMenu: React.FC<TextBubbleMenuProps> = ({ editor }) => {
  const { bold, italic, strike, link, code } = editor.state.schema.marks;

  if (!bold && !italic && !strike && !link && !code) {
    return null;
  }

  const content = useMemo(() => {
    return [
      [
        bold && <Bold key="bold" />,
        italic && <Italic key="italic" />,
        strike && <Strike key="strike" />,
        code && <Code key="code" />,
      ],
      [link && <Link key="link" />],
    ]
      .map((group) => group.filter(Boolean))
      .filter((group) => group.length > 0)
      .map((group, index, items) => (
        <React.Fragment key={index}>
          {group}
          {index < items.length - 1 && <MenuBarDivider />}
        </React.Fragment>
      ));
  }, [bold, italic, strike, link, code]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        plugins: [sticky],
        sticky: true,
        duration: 100,
        appendTo: () => editor.options.element,
      }}
      shouldShow={({ editor, view, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        const hasEditorFocus = view.hasFocus();

        if (
          !hasEditorFocus ||
          empty ||
          isEmptyTextBlock ||
          !isTextSelection(state.selection) ||
          !editor.isEditable
        ) {
          return false;
        }

        if (
          isActive(editor.state, 'image') ||
          isActive(editor.state, 'link') ||
          isActive(editor.state, 'codeBlock') ||
          isActive(editor.state, 'horizontalRule')
        ) {
          return false;
        }

        return true;
      }}
    >
      <div className="tide-menu-bar tide-menu-bar-bubble">{content}</div>
    </BubbleMenu>
  );
};
