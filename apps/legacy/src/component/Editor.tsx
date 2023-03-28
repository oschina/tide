import classNames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Plugin } from '@tiptap/pm/state';
import type {
  Content,
  MarkdownEditorOptions,
} from '@gitee/wysiwyg-editor-markdown';
import {
  createMarkdownEditor,
  MarkdownEditor,
} from '@gitee/wysiwyg-editor-markdown';
import {
  Editor as TEditor,
  EditorContent as TEditorContent,
  useEditor,
} from '@gitee/wysiwyg-editor-react';
import { ExtensionsOpts, getExtensions } from './extensions';
import {
  EditorRemoteDataProvider,
  BulkFetcherRequestFunc,
} from '@gitee/wysiwyg-editor-presets-mentions';
import { useExternalLinkRedirect } from '../hooks/useExternalLinkRedirect';

export type EditorContentProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  defaultValue?: Content | undefined;
  autoFocus?: boolean;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: (editor: MarkdownEditor) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onReady?: (editor: MarkdownEditor) => void;
  fetchResources?: BulkFetcherRequestFunc;
} & ExtensionsOpts;

const MarkdownEditorClass = createMarkdownEditor(TEditor);

const Editor = forwardRef<MarkdownEditor, EditorContentProps>(
  (
    {
      className,
      style,
      defaultValue = undefined,
      autoFocus = false,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
      mention,
      imageUpload,
      fetchResources = () => Promise.resolve(undefined),
    },
    ref
  ) => {
    const onFocusRef = useRef(onFocus);
    onFocusRef.current = onFocus;
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const [ready, setReady] = useState(false);
    const editor = useEditor<MarkdownEditor, MarkdownEditorOptions>(
      MarkdownEditorClass,
      {
        markdown: {
          linkify: true,
          breaks: true,
          tightLists: true,
        },
        content: defaultValue,
        extensions: getExtensions({ mention, imageUpload }),
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
          onReadyRef.current?.(e as MarkdownEditor);
          setReady(true);
        },
        onUpdate: ({ editor }) => {
          onChangeRef.current?.(editor as MarkdownEditor);
        },
        onFocus: () => {
          onFocusRef.current?.();
        },
        onBlur: () => {
          onBlurRef.current?.();
        },
      },
      []
    );

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useExternalLinkRedirect(
      editor?.options.element as HTMLDivElement,
      editor && !editor.isEditable,
      [defaultValue, ready]
    );

    useImperativeHandle(ref, () => editor as MarkdownEditor, [editor]);

    const fullClassName = classNames('gwe-content', className);

    if (editor && editor.isEmpty && !editor.isEditable) {
      return <div className={fullClassName}>{readOnlyEmptyView || null}</div>;
    }

    return (
      <EditorRemoteDataProvider fetchResources={fetchResources}>
        <TEditorContent
          className={fullClassName}
          style={style}
          editor={editor as unknown as TEditor}
        >
          {children}
        </TEditorContent>
      </EditorRemoteDataProvider>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
