import { DependencyList } from 'react';
import { useEditor as useTEditor } from '@gitee/tide-react';
import { Plugin } from '@tiptap/pm/state';
import { JSONContent } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TideEditor, TideEditorOptions } from './TideEditor';

export type UseEditorOptions = Partial<TideEditorOptions> & {
  onReady?: (editor: TideEditor) => void;
  onChange?: (doc: JSONContent, editor: TideEditor) => void;
};

export const useEditor: (
  options: UseEditorOptions,
  deps?: DependencyList
) => TideEditor = (options, deps) => {
  const {
    extensions = [Document, Paragraph, Text],
    content,
    autoFocus,
    readOnly,
    readOnlyEmptyView,
    readOnlyShowMenu = false,
    menuEnableUndoRedo = true,
    menuEnableFullscreen = true,
    fullscreen = false,
    onFullscreenChange,
    onReady,
    onChange,

    onCreate,
    onUpdate,
    ...otherEditorOptions
  } = options;

  return useTEditor(
    TideEditor,
    {
      extensions,
      content: content,
      autofocus: autoFocus,
      editable: !readOnly,
      editorProps: {
        attributes: {
          spellCheck: 'false',
        },
      },
      onCreate: (props) => {
        const { state, view } = props.editor;
        // 调整 suggestion 插件的优先级 (解决 # 与 heading input rule 冲突的问题)
        if (state.plugins.length > 0) {
          const restOfPlugins: Plugin[] = [];
          const suggestionPlugins: Plugin[] = [];
          state.plugins.forEach((plugin) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: The `Plugin` type does not include `key`
            if ((plugin.key as string).includes('Suggestion')) {
              suggestionPlugins.push(plugin);
            } else {
              restOfPlugins.push(plugin);
            }
          });
          view.updateState(
            state.reconfigure({
              plugins: [...suggestionPlugins, ...restOfPlugins],
            })
          );
        }
        onCreate?.(props);
        onReady?.(props.editor as TideEditor);
      },
      onUpdate: (props) => {
        onUpdate?.(props);
        onChange?.(props.editor.getJSON(), props.editor as TideEditor);
      },
      autoFocus,
      readOnly,
      readOnlyEmptyView,
      menuEnableUndoRedo,
      menuEnableFullscreen,
      readOnlyShowMenu,
      fullscreen,
      onFullscreenChange,
      ...otherEditorOptions,
    },
    deps
  );
};
