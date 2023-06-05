import {
  TableRow as TTableRow,
  TableRowOptions as TTableRowOptions,
} from '@tiptap/extension-table-row';

export type TableRowOptions = TTableRowOptions;

export const TableRow = TTableRow.extend<TTableRowOptions>({
  content: 'tableCell*',
});
