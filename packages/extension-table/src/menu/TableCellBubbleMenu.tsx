import React, { useCallback } from 'react';
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core';
import { BubbleMenu } from '@test-pkgs/react';
import type { BubbleMenuProps } from '@test-pkgs/react';
import {
  getCellsInColumn,
  getCellsInRow,
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
  // selected cell
  const hasCellSelected = isCellSelection(editor.state.selection);
  // selected row
  const cellsInFirstColumn = getCellsInColumn(0)(editor.state.selection);
  const hasRowSelected = !!cellsInFirstColumn?.some((_cell, index) =>
    isRowSelected(index)(editor.state.selection)
  );
  // selected column
  const cellsInFirstRow = getCellsInRow(0)(editor.state.selection);
  const hasColumnSelected = !!cellsInFirstRow?.some((_cell, index) =>
    isColumnSelected(index)(editor.state.selection)
  );
  // selected table
  const hasTableSelected = isTableSelected(editor.state.selection);

  console.log(
    'hasCellSelected',
    hasCellSelected,
    'hasRowSelected',
    hasRowSelected,
    'hasColumnSelected',
    hasColumnSelected,
    'hasTableSelected',
    hasTableSelected
  );

  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(
    ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }
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

  const canSplitCell = editor.can().chain().focus().splitCell().run();

  return (
    <BubbleMenu
      pluginKey="tableCellBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
    >
      <div className={styles['table-cell-bubble-menu']}>
        <button onClick={() => editor.commands.mergeOrSplit()}>
          {canSplitCell ? '拆分' : '合并'}
        </button>
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
        {hasRowSelected && (
          <button onClick={() => editor.commands.deleteRow()}>删除行</button>
        )}
        {hasColumnSelected && (
          <button onClick={() => editor.commands.deleteColumn()}>删除列</button>
        )}
      </div>
    </BubbleMenu>
  );
};
