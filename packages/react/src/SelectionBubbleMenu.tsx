import React from 'react';
import {
  getMarkRange,
  getMarkType,
  isNodeSelection,
  posToDOMRect,
} from '@tiptap/core';
import { sticky } from 'tippy.js';
import type { Props as TippyOptions } from 'tippy.js';
import type { PluginKey } from '@tiptap/pm/state';
import type { MarkType } from '@tiptap/pm/model';
import { BubbleMenu, BubbleMenuProps } from './BubbleMenu';

export type SelectionBubbleMenuProps = BubbleMenuProps & {
  pluginKey: PluginKey | string;
  placement?: TippyOptions['placement'];
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

export const SelectionBubbleMenu: React.FC<SelectionBubbleMenuProps> = ({
  pluginKey,
  editor,
  shouldShow,
  tippyOptions: inputTippyOptions,
  placement,
  reference = 'selection',
  referenceMarkType,
  children,
  ...props
}) => {
  const tippyOptions: BubbleMenuProps['tippyOptions'] = {
    plugins: [sticky],
    sticky: true,
    interactive: true,
    placement: placement || 'top',
    arrow: false,
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
          typeof referenceMarkType === 'string'
            ? getMarkType(referenceMarkType, state.schema)
            : referenceMarkType
        );
        if (range) {
          return posToDOMRect(view, range.from, range.to);
        }
      }

      return posToDOMRect(view, from, to);
    },
    ...inputTippyOptions,
  };

  return (
    <BubbleMenu
      pluginKey={pluginKey}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
      {...props}
    >
      {children}
    </BubbleMenu>
  );
};
