import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorRender, EditorRenderProps } from '@gitee/tide';
import { LegacyExtOpts } from './type';

import {
  EditorRemoteDataProvider,
  MentionMember,
  MentionIssue,
  MentionPullRequest,
} from '@gitee/tide-presets-mentions';
import { pulls, issues, members } from './utils/mentionLink';

import '@gitee/tide/dist/style.css';
import '@gitee/tide-presets-mentions/dist/style.css';

import 'highlight.js/styles/default.css';

export type TideEditorProps = Omit<EditorRenderProps, 'extensionOptions'> &
  LegacyExtOpts;

const TideEditor = forwardRef<Editor, TideEditorProps>(({ ...props }, ref) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useImperativeHandle(ref, () => editor as Editor, [editor]);

  const extensionOptions: EditorRenderProps['extensionOptions'] = {
    taskItem: {
      onReadOnlyChecked: () => true,
    },
    uploader: {
      image: {
        uploader: props.imageUpload,
      },
    },
  };

  const editorOptions: EditorRenderProps['editorOptions'] = {
    extensions: [
      MentionMember.configure({
        suggestion: {
          items: ({ query }) => props.mention.fetchMentionMember(query),
        },
        getLink: members.getLink,
      }),
      MentionIssue.configure({
        suggestion: {
          items: ({ query }) => props.mention.fetchMentionIssue(query),
        },
        getLink: issues.getLink,
      }),
      MentionPullRequest.configure({
        suggestion: {
          items: ({ query }) => props.mention.fetchMentionPR(query),
        },
        getLink: pulls.getLink,
      }),
    ],
  };

  return (
    <EditorRemoteDataProvider fetchResources={props.fetchResources}>
      <EditorRender
        ref={setEditor}
        editorOptions={editorOptions}
        extensionOptions={extensionOptions}
        {...props}
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
