import { PluginKey } from 'prosemirror-state';
import {
  buildSuggestionOptions,
  Mention,
  MentionItem,
  MentionList,
  MentionOptions,
} from '@gitee/wysiwyg-editor-extension-mention';

export type MentionMemberAttributes = {
  id: string;
  label: string;
};

export type MentionMemberItem = MentionItem<MentionMemberAttributes>;

export const MentionMemberSuggestionPluginKey = new PluginKey(
  'mentionMemberSuggestion'
);

export const MentionMember = Mention.extend<MentionOptions<MentionMemberItem>>({
  name: 'mentionMember',

  addOptions() {
    const parentOptions = this.parent?.();
    return {
      ...parentOptions,
      suggestion: buildSuggestionOptions<
        MentionMemberItem,
        MentionMemberAttributes
      >({
        ...parentOptions?.suggestion,
        pluginKey: MentionMemberSuggestionPluginKey,
        char: '@',
        component: MentionList,
      }),
    };
  },
});
