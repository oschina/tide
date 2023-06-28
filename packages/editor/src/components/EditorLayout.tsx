import React, { PropsWithChildren, useState } from 'react';
import classNames from 'classnames';
import {
  EditorContextProvider,
  useEditorContext,
} from '../context/EditorContext';

import type { TideEditor } from '../TideEditor';

import './EditorLayout.less';

const Layout: React.FC<
  PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
  }>
> = ({ style, className, children }) => {
  const { fullscreen } = useEditorContext();
  const cls = classNames(
    'tide-editor',
    { 'tide-editor--fullscreen': fullscreen },
    className
  );

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
};

export const EditorLayout: React.FC<
  PropsWithChildren<{
    editor: TideEditor | null;
    className?: string;
    style?: React.CSSProperties;
  }>
> = ({ editor, className, style, children }) => {
  return (
    <EditorContextProvider editor={editor}>
      <Layout style={style} className={className}>
        {children}
      </Layout>
    </EditorContextProvider>
  );
};
