import React from 'react';
import { mergeAttributes, NodeViewRenderer } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import {
  BaseMentionListRef,
  buildSuggestionOptions,
  Mention,
  MentionList,
  MentionListProps,
  MentionOptions,
} from '@gitee/tide-extension-mention';
import { ReactNodeViewRenderer } from '@gitee/tide-react';
import { MentionMemberNodeView } from './NodeView';
import { MentionListItemRender } from './ItemRender';
import { MentionMemberAttributes, MentionMemberItemDataType } from './types';
import MentionNoResult from '../components/MentionNoResult';

export const MentionMemberSuggestionPluginKey = new PluginKey(
  'mentionMemberSuggestion'
);

type MentionMemberOptions<T> = MentionOptions<T> & {
  nodeView: NodeViewRenderer;
  getLink: (path: string) => string;
};

export const MentionMember = Mention.extend<
  MentionMemberOptions<MentionMemberItemDataType>
>({
  name: 'mentionMember',

  addOptions() {
    const parentOptions = this.parent?.();
    return {
      ...parentOptions,
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.name ?? node.attrs.id}`;
      },
      suggestion: buildSuggestionOptions<
        MentionMemberItemDataType,
        MentionListProps<MentionMemberItemDataType, MentionMemberAttributes>,
        BaseMentionListRef
      >({
        ...parentOptions?.suggestion,
        pluginKey: MentionMemberSuggestionPluginKey,
        char: '@',
        component: MentionList as any, // FIXME: type error
        componentProps: {
          itemRender: (item) => <MentionListItemRender item={item} />,
          emptyRender: () => <MentionNoResult />,
        },
      }),
      getLink: (path) => path,
      nodeView: ReactNodeViewRenderer(MentionMemberNodeView),
    };
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name') || '',
        renderHTML: (attributes) => ({
          'data-name': attributes.name || '',
        }),
      },

      username: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-username') || '',
        renderHTML: (attributes) => ({
          'data-username': attributes.username || '',
        }),
      },

      url: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-url') || '',
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
    return this.options.nodeView;
  },
});
