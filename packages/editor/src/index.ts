import { useEditor as useEditorOriginal } from '@gitee/tide-react';
import { TideEditor } from './TideEditor';

import type { DependencyList } from 'react';
import type { TideEditorOptions } from './TideEditor';

export * from './components/EditorLayout';
export * from './components/EditorMenu';
export * from './components/EditorContent';

export * from './context/EditorContext';

export * from './EditorRender';
export * from './TideEditor';

export * from './types';

export const useEditor: (
  options: Partial<TideEditorOptions>,
  deps?: DependencyList
) => TideEditor | null = (options, deps) =>
  useEditorOriginal<TideEditor, TideEditorOptions>(TideEditor, options, deps);
