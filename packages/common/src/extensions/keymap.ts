import { Extension } from '@tiptap/core';

export const Keymap = Extension.create({
  name: 'coreKeymap',

  priority: 1,

  addKeyboardShortcuts() {
    return {
      // prevent default tab behavior
      Tab: () => true,
      'Shift-Tab': () => true,
    };
  },
});
