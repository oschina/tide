import React from 'react';
import { mergeAttributes } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import {
  buildSuggestionOptions,
  Mention,
  MentionList,
  MentionListProps,
  MentionOptions,
} from '@gitee/wysiwyg-editor-extension-mention';
import { ReactNodeViewRenderer } from '@gitee/wysiwyg-editor-react';
import { MentionPullRequestNodeView } from './MentionPullRequestNodeView';
import MentionPullRequestItemRender from './MentionPullRequestItemRender';
import {
  MentionPullRequestAttributes,
  MentionPullRequestItemDataType,
} from './types';
import MentionNoResult from '../components/MentionNoResult';

export const MentionPullRequestSuggestionPluginKey = new PluginKey(
  'mentionPullRequestSuggestion'
);

export const MentionPullRequest = Mention.extend<
  MentionOptions<MentionPullRequestItemDataType>
>({
  name: 'mentionPullRequest',

  addOptions() {
    const parentOptions = this.parent?.();
    return {
      ...parentOptions,
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.iid ?? node.attrs.id}`;
      },
      suggestion: buildSuggestionOptions<
        MentionPullRequestItemDataType,
        MentionListProps<
          MentionPullRequestItemDataType,
          MentionPullRequestAttributes
        >
      >({
        ...parentOptions?.suggestion,
        pluginKey: MentionPullRequestSuggestionPluginKey,
        char: '!',
        component: MentionList as any,
        componentProps: {
          itemRender: (item) => <MentionPullRequestItemRender item={item} />,
          emptyRender: () => <MentionNoResult />,
        },
        tippyOptions: {
          maxWidth: 400,
        },
      }),
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => `${element.getAttribute('data-id') ?? ''}`,
        renderHTML: (attributes) => ({
          'data-id': attributes.id || '',
        }),
      },

      iid: {
        default: null,
        parseHTML: (element) => `${element.getAttribute('data-iid') ?? ''}`,
        renderHTML: (attributes) => ({
          'data-iid': attributes.iid || '',
        }),
      },

      title: {
        default: null,
        parseHTML: (element) => `${element.getAttribute('data-title') ?? ''}`,
        renderHTML: (attributes) => ({
          'data-title': attributes.title || '',
        }),
      },

      url: {
        default: null,
        parseHTML: (element) => `${element.getAttribute('data-url') ?? ''}`,
        renderHTML: (attributes) => ({
          'data-url': attributes.url,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `a[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        {
          'data-type': this.name,
          href: node.attrs.url,
          target: '_blank',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MentionPullRequestNodeView);
  },
});
