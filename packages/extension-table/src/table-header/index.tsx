import {
  TableHeader as TTableHeader,
  TableHeaderOptions as TTableHeaderOptions,
} from '@tiptap/extension-table-header';
import { mergeAttributes } from '@tiptap/core';

// TODO: tableHeaderHeight
export const tableHeaderHeight = 38;

export const TableHeader = TTableHeader.extend<TTableHeaderOptions>({
  content:
    '(paragraph | heading | blockquote | list | codeBlock | image | horizontalRule)+',

  addAttributes() {
    return {
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute('colspan');
          const value = colspan ? parseInt(colspan, 10) : 1;
          return value;
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute('rowspan');
          const value = rowspan ? parseInt(rowspan, 10) : 1;
          return value;
        },
      },
      colwidth: {
        default: [100],
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map((item) => parseInt(item, 10))
            : null;
          return value;
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const rowspan = Math.max(parseInt(HTMLAttributes.rowspan, 10), 1);
    return [
      'th',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        rowspan > 1
          ? {
              style: `height: ${rowspan * tableHeaderHeight}px`,
            }
          : {}
      ),
      0,
    ];
  },
});
