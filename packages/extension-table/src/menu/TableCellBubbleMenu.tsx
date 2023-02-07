import React, { useCallback, useState } from 'react';
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core';
import { BubbleMenu } from '@gitee/wysiwyg-editor-react';
import type { BubbleMenuProps } from '@gitee/wysiwyg-editor-react';
import {
  getCellsInColumn,
  getCellsInRow,
  getSelectedCells,
  isCellSelection,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
} from '../utilities';
import styles from './TableCellBubbleMenu.module.less';
import { PluginKey } from 'prosemirror-state';

export type TableCellBubbleMenuProps = {
  editor: Editor;
};

export const tableCellBubbleMenuPluginKey = new PluginKey(
  'tableCellBubbleMenu'
);

export const TableCellBubbleMenu: React.FC<TableCellBubbleMenuProps> = ({
  editor,
}) => {
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  const [rowSelected, setRowSelected] = useState(false);
  const [columnSelected, setColumnSelected] = useState(false);
  const [tableSelected, setTableSelected] = useState(false);

  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(
    ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }

      // selected row
      const cellsInColumn = getCellsInColumn(0)(editor.state.selection) || [];
      let rowIndex = 0;
      const cellRowIndexMap: number[] = [];
      cellsInColumn.forEach(({ node }) => {
        const rowspan = node.attrs.rowspan || 1;
        cellRowIndexMap.push(rowIndex);
        rowIndex += rowspan;
      });
      const hasRowSelected = !!cellsInColumn.some((_cell, index) =>
        isRowSelected(cellRowIndexMap[index])(editor.state.selection)
      );
      setRowSelected(hasRowSelected);

      // selected column
      const cellsInRow = getCellsInRow(0)(editor.state.selection) || [];
      let columnIndex = 0;
      const cellColumnIndexMap: number[] = [];
      cellsInRow.forEach(({ node }) => {
        const colspan = node.attrs.colspan || 1;
        cellColumnIndexMap.push(columnIndex);
        columnIndex += colspan;
      });
      const hasColumnSelected = !!cellsInRow.some((_cell, index) =>
        isColumnSelected(cellColumnIndexMap[index])(editor.state.selection)
      );
      setColumnSelected(hasColumnSelected);

      // selected table
      const hasTableSelected = isTableSelected(editor.state.selection);
      setTableSelected(hasTableSelected);

      // selected cells
      const cells = getSelectedCells(editor.state.selection);
      setSelectedCells(cells);

      return isCellSelection(editor.state.selection);
    },
    [editor]
  );

  const tippyOptions: BubbleMenuProps['tippyOptions'] = {
    interactive: true,
    placement: 'top',
    arrow: false,
    appendTo: () => editor.options.element,
    getReferenceClientRect: () => {
      const { state, view } = editor;
      const { from, to } = state.selection;
      const selectedCells = getSelectedCells(state.selection);
      let posFrom = from;
      let posTo = to;
      if (selectedCells.length) {
        const firstCell = selectedCells[0];
        const lastCell = selectedCells[selectedCells.length - 1];
        posFrom = firstCell ? firstCell.pos : posFrom;
        posTo = lastCell ? lastCell.pos + lastCell.node.nodeSize : posTo;
      }
      if (isNodeSelection(state.selection)) {
        const node = view.nodeDOM(from) as HTMLElement;
        if (node) {
          return node.getBoundingClientRect();
        }
      }
      return posToDOMRect(view, posFrom, posTo);
    },
  };

  const selectedCellsCount = selectedCells?.length || 0;
  const canSplitCell = editor.can().splitCell();
  const canMergeCells = editor.can().mergeCells();

  return (
    <BubbleMenu
      pluginKey={tableCellBubbleMenuPluginKey}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
    >
      <div className={styles['table-cell-bubble-menu']}>
        {((selectedCellsCount > 1 && canMergeCells) || canSplitCell) && (
          <button onClick={() => editor.commands.mergeOrSplit()}>
            {canSplitCell ? '拆分' : '合并'}
          </button>
        )}
        <button onClick={() => (editor.commands as any).unsetTextAlign?.()}>
          居左
        </button>
        <button
          onClick={() => (editor.commands as any).setTextAlign?.('center')}
        >
          居中
        </button>
        <button
          onClick={() => (editor.commands as any).setTextAlign?.('right')}
        >
          居右
        </button>
        {!tableSelected && rowSelected && (
          <button onClick={() => editor.commands.deleteRow()}>删除行</button>
        )}
        {!tableSelected && columnSelected && (
          <button onClick={() => editor.commands.deleteColumn()}>删除列</button>
        )}
        {tableSelected && (
          <button onClick={() => editor.commands.deleteTable()}>
            删除表格
          </button>
        )}
      </div>
    </BubbleMenu>
  );
};
