import {
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing } from '@tiptap/prosemirror-tables';
import { columnResizing } from './columnresizing';
import { TableView } from './TableView';

export const Table = TTable.extend<TTableOptions>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: false,
      handleWidth: 5,
      cellMinWidth: 48,
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },

  addProseMirrorPlugins() {
    const isResizable = this.options.resizable && this.editor.isEditable;
    return [
      ...(isResizable
        ? [
            columnResizing({
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              View: this.options.View,
              lastColumnResizable: this.options.lastColumnResizable,
            }),
          ]
        : []),
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection,
      }),
    ];
  },
});
