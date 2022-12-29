import {
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing } from '@tiptap/prosemirror-tables';
import { columnResizing } from './columnresizing';

export const Table = TTable.extend<TTableOptions>({
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
