import {
  OrderedList as TOrderedList,
  OrderedListOptions as TOrderedListOptions,
} from '@tiptap/extension-ordered-list';
import { wrapInListInputRule, wrappingInputRule } from '@gitee/tide-common';
import { getNodeType } from '@tiptap/core';

export type OrderedListOptions = TOrderedListOptions;

export const inputRegex = /^(\d+)[.)）]\s$/;

export const OrderedList = TOrderedList.extend<OrderedListOptions>({
  addInputRules() {
    const listItemType = getNodeType('listItem', this.editor.schema);
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => ({ start: +match[1] }),
        joinBefore: (match, node) =>
          node.type === this.type &&
          node.childCount + node.attrs.start === +match[1],
        joinAfter: (_match, node) => node.type === this.type,
      }),
      wrapInListInputRule({
        find: inputRegex,
        listType: this.type,
        itemType: listItemType,
        extensions: this.editor.extensionManager.extensions,
        getAttributes: (match) => ({ start: +match[1] }),
        joinBefore: (match, node) =>
          node.type === this.type &&
          node.childCount + node.attrs.start === +match[1],
        joinAfter: (_match, node) => node.type === this.type,
      }),
    ];
  },
});
