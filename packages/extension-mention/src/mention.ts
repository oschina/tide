import { Mention as TMention } from '@tiptap/extension-mention';
import type { MentionOptions as TMentionOptions } from '@tiptap/extension-mention';
import type { SuggestionOptions } from '@tiptap/suggestion';

export type MentionOptions<I = any> = TMentionOptions & {
  suggestion: Omit<SuggestionOptions<I>, 'editor'>;
};

export const Mention = TMention.extend<MentionOptions>({
  name: 'mention',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    const parentOptions = this.parent?.();
    return {
      ...parentOptions,
      HTMLAttributes: {
        ...parentOptions?.HTMLAttributes,
        class: 'mention',
      },
    };
  },
});
