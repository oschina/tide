import React, { forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import {
  Editor,
  EditorRender,
  EditorRenderProps,
  useEditor,
} from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { LegacyExtOpts } from './type';

import {
  EditorRemoteDataProvider,
  MentionMember,
  MentionIssue,
  MentionPullRequest,
} from '@gitee/tide-presets-mentions';
import { pulls, issues, members } from './mentionLink';

import '@gitee/tide/dist/style.css';
import '@gitee/tide-presets-mentions/dist/style.css';

import 'highlight.js/styles/default.css';

export type TideEditorProps = Omit<EditorRenderProps, 'editor'> & LegacyExtOpts;

const TideEditor = forwardRef<Editor, TideEditorProps>(({ ...props }, ref) => {
  const { imageUpload, fetchResources, mention, ...restProps } = props;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        taskItem: {
          onReadOnlyChecked: () => true,
        },
        uploader: {
          image: {
            uploader: imageUpload,
          },
        },
      }),
      MentionMember.configure({
        suggestion: {
          items: ({ query }) => mention.fetchMentionMember(query),
        },
        getLink: members.getLink,
      }),
      MentionIssue.configure({
        suggestion: {
          items: ({ query }) => mention.fetchMentionIssue(query),
        },
        getLink: issues.getLink,
      }),
      MentionPullRequest.configure({
        suggestion: {
          items: ({ query }) => mention.fetchMentionPR(query),
        },
        getLink: pulls.getLink,
      }),
    ],
  });

  useImperativeHandle(ref, () => editor as Editor, [editor]);

  return (
    <EditorRemoteDataProvider fetchResources={fetchResources}>
      <EditorRender editor={editor} {...restProps} />
    </EditorRemoteDataProvider>
  );
});

TideEditor.displayName = 'TideEditor';

export const createEditor = (props: {
  el: HTMLElement;
  options: TideEditorProps;
}): void => {
  const { el, options } = props;
  ReactDOM.render(<TideEditor {...options} />, el);
};
