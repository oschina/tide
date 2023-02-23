import { Extension } from '@tiptap/core';

export const HighPriorityKeymap = Extension.create({
  name: 'highPriorityKeymap',

  priority: 1001,

  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.listBackspace(),
    };
  },
});
