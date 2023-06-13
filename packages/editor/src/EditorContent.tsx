import classNames from 'classnames';
import React from 'react';
import { EditorContent as TEditorContent } from '@gitee/tide-react';
import type { TideEditor } from './TideEditor';
import './EditorContent.less';

export type EditorContentProps = {
  editor: TideEditor | null;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const EditorContent: React.FC<EditorContentProps> = ({
  editor,
  className,
  style,
  children,
}) => {
  const fullClassName = classNames('tide-content', className);

  if (editor && editor.isEmpty && editor.isReadOnly) {
    return (
      <div className={fullClassName} style={style}>
        {editor.readOnlyEmptyView || null}
      </div>
    );
  }

  return (
    <TEditorContent className={fullClassName} style={style} editor={editor}>
      {children}
    </TEditorContent>
  );
};

EditorContent.displayName = 'EditorContent';
