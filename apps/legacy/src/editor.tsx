import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorRender, EditorRenderProps } from '@gitee/tide';
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

export type TideEditorProps = Omit<EditorRenderProps, 'extensionOptions'> &
  LegacyExtOpts;

const TideEditor = forwardRef<Editor, TideEditorProps>(({ ...props }, ref) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useImperativeHandle(ref, () => editor as Editor, [editor]);

  const { imageUpload, fetchResources, mention, ...restProps } = props;

  const editorOptions: EditorRenderProps['editorOptions'] = {
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
  };

  return (
    <EditorRemoteDataProvider fetchResources={fetchResources}>
      <EditorRender
        ref={setEditor}
        editorOptions={editorOptions}
        {...restProps}
      />
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
