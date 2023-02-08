import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import type { Editor } from '@tiptap/core';
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from '@tiptap/suggestion';
import { ReactRenderer } from '@gitee/wysiwyg-editor-react';

export interface MentionListProps<I = any, A = any>
  extends Omit<SuggestionProps<I>, 'command'> {
  command: (attrs: A) => void;
}

export type MentionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type BuildSuggestionOptionsParams<I = any, A = any> = Omit<
  SuggestionOptions,
  'editor'
> & {
  /** mention list component */
  component: ForwardRefExoticComponent<
    MentionListProps<I, A> & RefAttributes<MentionListRef>
  >;

  /** mention items */
  items?: (props: { query: string; editor: Editor }) => I[] | Promise<I[]>;
};

export const buildSuggestionOptions = <I = any, A = any>({
  component: MentionListComponent,
  ...otherOptions
}: BuildSuggestionOptionsParams) => {
  const options: Omit<SuggestionOptions, 'editor'> = {
    render: () => {
      let component: ReactRenderer<MentionListRef, MentionListProps>;
      let popup: TippyInstance[];

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionListComponent, {
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
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore getReferenceClientRect null
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide();
            component?.destroy();
            return true;
          }
          return !!component?.ref?.onKeyDown(props);
        },

        onExit() {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },

    ...otherOptions,
  };

  return options;
};
