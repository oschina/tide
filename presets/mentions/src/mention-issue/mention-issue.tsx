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
import { MentionIssueNodeView } from './MentionIssueNodeView';
import MentionIssueItemRender from './MentionIssueItemRender';
import { MentionIssueAttributes, MentionIssueItemDataType } from './types';
import MentionNoResult from '../components/MentionNoResult';

export const MentionIssueSuggestionPluginKey = new PluginKey(
  'mentionIssueSuggestion'
);

export const MentionIssue = Mention.extend<
  MentionOptions<MentionIssueItemDataType>
>({
  name: 'mentionIssue',

  addOptions() {
    const parentOptions = this.parent?.();
    return {
      ...parentOptions,
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.ident}`;
      },
      suggestion: buildSuggestionOptions<
        MentionIssueItemDataType,
        MentionListProps<MentionIssueItemDataType, MentionIssueAttributes>
      >({
        ...parentOptions?.suggestion,
        pluginKey: MentionIssueSuggestionPluginKey,
        char: '#',
        component: MentionList as any,
        componentProps: {
          itemRender: (item) => <MentionIssueItemRender item={item} />,
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
      ident: {
        default: null,
        parseHTML: (element) => `${element.getAttribute('data-ident') ?? ''}`,
        renderHTML: (attributes) => ({
          'data-ident': attributes.ident || '',
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
    return ReactNodeViewRenderer(MentionIssueNodeView);
  },
});
