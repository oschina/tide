import { Extension } from '@tiptap/core';
import * as commands from '../commands';

export const Commands = Extension.create({
  name: 'coreCommands',

  addCommands() {
    return {
      ...commands,
    };
  },
});
