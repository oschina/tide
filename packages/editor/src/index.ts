import { useEditor as useEditorOriginal } from '@gitee/tide-react';
import { TideEditor } from './TideEditor';

import type { DependencyList } from 'react';
import type { TideEditorOptions } from './TideEditor';

export * from './EditorContent';
export * from './EditorRender';
export * from './TideEditor';

export * from './types';

export const useEditor: (
  options: Partial<TideEditorOptions>,
  deps?: DependencyList
) => TideEditor = (options, deps) =>
  useEditorOriginal<TideEditor, TideEditorOptions>(TideEditor, options, deps);
