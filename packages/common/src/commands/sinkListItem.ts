import { RawCommands } from '@tiptap/core';
import { NodeType } from 'prosemirror-model';
import { indentList } from '../utilities/list/list-command-indent';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sinkListItem: {
      /**
       * Sink the list item down into an inner list.
       */
      sinkListItem: (typeOrName: string | NodeType) => ReturnType;
    };
  }
}

export const sinkListItem: RawCommands['sinkListItem'] =
  () =>
  ({ tr }) => {
    return indentList(tr);
  };
