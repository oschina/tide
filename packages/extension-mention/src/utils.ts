import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import type { Editor } from '@tiptap/core';
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from '@tiptap/suggestion';
import { ReactRenderer } from '@gitee/tide-react';

export interface BaseMentionListProps<ItemDataType = any, AttrsType = any>
  extends Omit<SuggestionProps<ItemDataType>, 'command'> {
  command: (attrs: AttrsType) => void;
}

export type BaseMentionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type BuildSuggestionOptionsParams<
  ItemDataType = any,
  ListProps extends BaseMentionListProps<ItemDataType> = BaseMentionListProps<ItemDataType>,
  ListRef extends BaseMentionListRef = BaseMentionListRef
> = Omit<SuggestionOptions, 'editor'> & {
  /** mention list component */
  component: ForwardRefExoticComponent<ListProps & RefAttributes<ListRef>>;

  /** mention list component props */
  componentProps?: Partial<ListProps> | undefined;

  /** tippy options */
  tippyOptions?: Partial<TippyInstance['props']>;

  /** mention items */
  items?: (props: {
    query: string;
    editor: Editor;
  }) => ItemDataType[] | Promise<ItemDataType[]>;
};

export const buildSuggestionOptions = <
  ItemDataType = any,
  ListProps extends BaseMentionListProps = BaseMentionListProps,
  ListRef extends BaseMentionListRef = BaseMentionListRef
>({
  component: MentionListComponent,
  componentProps,
  tippyOptions,
  ...otherOptions
}: BuildSuggestionOptionsParams<ItemDataType, ListProps, ListRef>) => {
  const options: Omit<SuggestionOptions, 'editor'> = {
    render: () => {
      let component: ReactRenderer<ListRef, ListProps>;
      let popup: TippyInstance[];

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionListComponent, {
            props: { ...props, ...componentProps },
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
            ...tippyOptions,
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
