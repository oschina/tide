import {
  OrderedList as TOrderedList,
  OrderedListOptions as TOrderedListOptions,
} from '@tiptap/extension-ordered-list';
import { wrappingInputRule } from '@test-pkgs/common';

export type OrderedListOptions = TOrderedListOptions;

export const inputRegex = /^(\d+)[.)）]\s$/;

export const OrderedList = TOrderedList.extend<OrderedListOptions>({
  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => ({ start: +match[1] }),
        joinBefore: (match, node) =>
          node.childCount + node.attrs.start === +match[1],
      }),
    ];
  },
});
