import { ReactRenderer } from '@tiptap/react';
import {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from '@tiptap/suggestion';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { EmojiItem } from './emoji';
import { EmojiList } from './EmojiList';

export type EmojiListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export const suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'> = {
  items: ({ editor, query }) => {
    return (editor.storage.emoji.emojis as EmojiItem[])
      .filter(({ name, shortcodes, tags }) => {
        return (
          name.startsWith(query.toLowerCase()) ||
          shortcodes.find((shortcode) =>
            shortcode.startsWith(query.toLowerCase())
          ) ||
          tags.find((tag) => tag.startsWith(query.toLowerCase()))
        );
      })
      .slice(0, 5);
  },

  allowSpaces: false,

  render: () => {
    let component: ReactRenderer<EmojiListRef, SuggestionProps<EmojiItem>>;
    let popup: TippyInstance[];

    return {
      onStart: (props) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore getReferenceClientRect null
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => props.editor.options.element,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore getReferenceClientRect null
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          component.destroy();

          return true;
        }

        return !!component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
