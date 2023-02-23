import { Extension } from '@tiptap/core';
import { listBackspace } from '../helpers/listBackspace';
import * as commands from '../commands';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highPriorityKeymap: {
      /**
       * Handle backspace in a list item.
       */
      listBackspace: () => ReturnType;
    };
  }
}

export const Commands = Extension.create({
  name: 'coreCommands',

  // !! 警告 !!
  // tiptap extension 加载顺序是按 priority 从高到低 加载
  // 但 commands 是通过 reduce 重组的, 后面覆盖前面, 所以此处优先级应设置最低
  priority: 1,

  addCommands() {
    return {
      ...commands,

      listBackspace:
        () =>
        ({ tr, state, dispatch, view }) =>
          listBackspace(tr, state, dispatch, view),
    };
  },
});
