import { RawCommands } from '@tiptap/core';
import { NodeType } from 'prosemirror-model';
import { dedentList } from '../utilities/list/list-command-dedent';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    liftListItem: {
      /**
       * Lift the list item into a wrapping list.
       */
      liftListItem: (typeOrName: string | NodeType) => ReturnType;
    };
  }
}

export const liftListItem: RawCommands['liftListItem'] =
  () =>
  ({ tr }) => {
    return dedentList(tr);
  };
