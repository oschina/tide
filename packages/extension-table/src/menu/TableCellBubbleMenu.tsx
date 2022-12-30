import React, { useCallback, useState } from 'react';
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core';
import { BubbleMenu } from '@test-pkgs/react';
import type { BubbleMenuProps } from '@test-pkgs/react';
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

export type TableCellBubbleMenuProps = {
  editor: Editor;
};

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
      const hasRowSelected = !!getCellsInColumn(0)(
        editor.state.selection
      )?.some((_cell, index) => isRowSelected(index)(editor.state.selection));
      setRowSelected(hasRowSelected);

      // selected column
      const hasColumnSelected = !!getCellsInRow(0)(
        editor.state.selection
      )?.some((_cell, index) =>
        isColumnSelected(index)(editor.state.selection)
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
      // FIXME: 显示位置
      if (isNodeSelection(state.selection)) {
        const node = view.nodeDOM(from) as HTMLElement;
        if (node) {
          return node.getBoundingClientRect();
        }
      }
      return posToDOMRect(view, from, to);
    },
  };

  const selectedCellsCount = selectedCells?.length || 0;
  const canSplitCell = editor.can().splitCell();

  return (
    <BubbleMenu
      pluginKey="tableCellBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
    >
      <div className={styles['table-cell-bubble-menu']}>
        {(selectedCellsCount > 1 || canSplitCell) && (
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
