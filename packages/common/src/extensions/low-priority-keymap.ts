import { Extension } from '@tiptap/core';

export const LowPriorityKeymap = Extension.create({
  name: 'lowPriorityKeymap',

  priority: 1,

  addKeyboardShortcuts() {
    return {
      // prevent default tab, shift-tab behavior
      Tab: () => true,
      'Shift-Tab': () => true,
    };
  },
});
