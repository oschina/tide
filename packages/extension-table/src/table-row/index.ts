import {
  TableRow as TTableRow,
  TableRowOptions as TTableRowOptions,
} from '@tiptap/extension-table-row';

export const TableRow = TTableRow.extend<TTableRowOptions>({
  content: 'tableCell*',
});
