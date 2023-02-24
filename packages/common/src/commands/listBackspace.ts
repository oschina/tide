import { RawCommands } from '@tiptap/core';
import { listBackspace as originalListBackspace } from '../helpers/listBackspace';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    listBackspace: {
      /**
       * Handle backspace in a list item.
       */
      listBackspace: () => ReturnType;
    };
  }
}

export const listBackspace: RawCommands['listBackspace'] =
  () =>
  ({ tr, state, dispatch, view }) =>
    originalListBackspace(tr, state, dispatch, view);
