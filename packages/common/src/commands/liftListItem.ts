import { RawCommands } from '@tiptap/core';
import { dedentList } from '../utilities/list/list-command-dedent';

export const liftListItem: RawCommands['liftListItem'] =
  () =>
  ({ tr }) => {
    return dedentList(tr);
  };
