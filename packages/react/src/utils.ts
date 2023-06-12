import {
  Editor,
  getMarkRange,
  getMarkType,
  isNodeSelection,
  posToDOMRect,
} from '@tiptap/core';
import tippy, { Instance, Props as TippyOptions, sticky } from 'tippy.js';
import type { MarkType } from '@tiptap/pm/model';
import type { ReactRenderer } from './ReactRenderer';

export type ShowBubbleMenuOptions = {
  editor: Editor;
  placement?: TippyOptions['placement'];
  componentRender: (tippyRef: { instance: Instance }) => ReactRenderer;
  tippyOptions?: Partial<TippyOptions>;
} & (
  | {
      reference?: never;
      referenceMarkType?: never;
    }
  | {
      reference: 'selection';
      referenceMarkType?: never;
    }
  | {
      reference: 'mark';
      referenceMarkType: string | MarkType;
    }
);

export const showBubbleMenu = ({
  editor,
  placement,
  componentRender,
  tippyOptions,
  reference,
  referenceMarkType,
}: ShowBubbleMenuOptions) => {
  // eslint-disable-next-line prefer-const
  const tippyRef: { instance: Instance } = {} as { instance: Instance };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const component = componentRender(tippyRef);

  tippyRef.instance = tippy(editor.options.element, {
    plugins: [sticky],
    sticky: true,
    appendTo: () => editor.options.element,
    getReferenceClientRect: () => {
      const { state, view } = editor;
      const { from, to } = state.selection;

      if (isNodeSelection(state.selection)) {
        const node = view.nodeDOM(from) as HTMLElement;
        if (node) {
          return node.getBoundingClientRect();
        }
      }

      if (reference === 'mark' && referenceMarkType) {
        const range = getMarkRange(
          state.doc.resolve(from),
          getMarkType(referenceMarkType, state.schema)
        );
        if (range) {
          return posToDOMRect(view, range.from, range.to);
        }
      }

      return posToDOMRect(view, from, to);
    },
    content: component.element,
    showOnCreate: true,
    interactive: true,
    trigger: 'manual',
    placement: placement || 'top',
    arrow: false,
    ...tippyOptions,
    onHide(instance) {
      tippyOptions?.onHide?.(instance);
      component.destroy();
    },
  });
};
