import {
  HorizontalRule as THorizontalRule,
  HorizontalRuleOptions as THorizontalRuleOptions,
} from '@tiptap/extension-horizontal-rule';

export type HorizontalRuleOptions = THorizontalRuleOptions;

export const HorizontalRule = THorizontalRule.extend<HorizontalRuleOptions>({
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-s': () => this.editor.commands.setHorizontalRule(),
    };
  },
});
