import { RawCommands } from '@tiptap/core';
import { indentList } from '../utilities/list/list-command-indent';

export const sinkListItem: RawCommands['sinkListItem'] =
  () =>
  ({ tr }) => {
    return indentList(tr);
  };
