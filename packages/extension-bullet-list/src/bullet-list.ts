import {
  BulletList as TBulletList,
  BulletListOptions as TBulletListOptions,
} from '@tiptap/extension-bullet-list';
import { wrapInListInputRule, wrappingInputRule } from '@gitee/tide-common';
import { getNodeType } from '@tiptap/core';

export type BulletListOptions = TBulletListOptions;

export const inputRegex = /^\s*([-*])\s$/;

export const BulletList = TBulletList.extend<BulletListOptions>({
  addInputRules() {
    const listItemType = getNodeType('listItem', this.editor.schema);
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
      wrapInListInputRule({
        find: inputRegex,
        listType: this.type,
        itemType: listItemType,
        extensions: this.editor.extensionManager.extensions,
      }),
    ];
  },
});
