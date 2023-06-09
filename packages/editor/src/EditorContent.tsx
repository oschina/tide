import classNames from 'classnames';
import React, {
  DependencyList,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import type { Plugin } from '@tiptap/pm/state';
import type { JSONContent, FocusPosition } from '@tiptap/core';
import {
  Content,
  Editor,
  EditorOptions,
  EditorContent as TEditorContent,
  useEditor,
} from '@gitee/tide-react';
import './EditorContent.less';

export type EditorContentProps = {
  className?: string;
  style?: React.CSSProperties;

  defaultValue?: Content;

  autoFocus?: FocusPosition;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;

  children?: React.ReactNode;

  onReady?: (editor: Editor) => void;
  onChange?: (doc: JSONContent, editor: Editor) => void;
  onFocus?: EditorOptions['onFocus'];
  onBlur?: EditorOptions['onBlur'];

  editorOptions?: Partial<EditorOptions>;
  deps?: DependencyList;
};

export const EditorContent: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorContentProps> & React.RefAttributes<Editor>
> = forwardRef<Editor, EditorContentProps>(
  (
    {
      className,
      style,
      defaultValue,
      autoFocus,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
      editorOptions = {} as EditorOptions,
      deps = [],
    },
    ref
  ) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onFocusRef = useRef(onFocus);
    onFocusRef.current = onFocus;
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    const { extensions = [], ...otherEditorOptions } = editorOptions;

    const editor = useEditor(
      Editor,
      {
        extensions,
        content: defaultValue,
        autofocus: autoFocus,
        editable: !readOnly,
        editorProps: {
          attributes: {
            spellCheck: 'false',
          },
        },
        onCreate: ({ editor: e }) => {
          const { state, view } = e;
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
          onReadyRef.current?.(e as Editor);
        },
        onUpdate: ({ editor: e }) => {
          onChangeRef.current?.(e.getJSON(), e as Editor);
        },
        onFocus: (props) => {
          onFocusRef.current?.(props);
        },
        onBlur: (props) => {
          onBlurRef.current?.(props);
        },
        ...otherEditorOptions,
      },
      deps
    );

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useImperativeHandle(ref, () => editor, [editor]);

    const fullClassName = classNames('gwe-content', className);

    if (editor && editor.isEmpty && !editor.isEditable) {
      return (
        <div className={fullClassName} style={style}>
          {readOnlyEmptyView || null}
        </div>
      );
    }

    return (
      <TEditorContent className={fullClassName} style={style} editor={editor}>
        {children}
      </TEditorContent>
    );
  }
);

EditorContent.displayName = 'EditorContent';
