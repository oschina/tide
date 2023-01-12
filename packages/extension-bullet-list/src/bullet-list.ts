import {
  BulletList as TBulletList,
  BulletListOptions as TBulletListOptions,
} from '@tiptap/extension-bullet-list';
import { wrapInListInputRule, wrappingInputRule } from '@test-pkgs/common';

export type BulletListOptions = TBulletListOptions;

export const inputRegex = /^\s*([-*])\s$/;

export const BulletList = TBulletList.extend<BulletListOptions>({
  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
      wrapInListInputRule({
        find: inputRegex,
        listType: this.type,
        extensions: this.editor.extensionManager.extensions,
      }),
    ];
  },
});
