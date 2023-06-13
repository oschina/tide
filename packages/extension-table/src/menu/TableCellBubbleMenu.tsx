import React, { useCallback, useRef, useState } from 'react';
import { sticky } from 'tippy.js';
import Tippy from '@tippyjs/react';
import { PluginKey } from '@tiptap/pm/state';
import { Editor, posToDOMRect } from '@tiptap/core';
import { BubbleMenu } from '@gitee/tide-react';
import type { BubbleMenuProps } from '@gitee/tide-react';
import {
  IconAlignCenterBold,
  IconAlignRightBold,
  IconAlignLeftBold,
  IconTrashBold,
  IconCellMergeBold,
  IconCellSplitBold,
  IconCopyBold,
  IconCutBold,
} from '@gitee/icons-react';
import {
  getCellsInColumn,
  getCellsInRow,
  getSelectedCells,
  isCellSelection,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
} from '../utilities';

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
  const [selectedState, setSelectedState] = useState<{
    rowSelected: boolean;
    columnSelected: boolean;
    tableSelected: boolean;
  }>({
    rowSelected: false,
    columnSelected: false,
    tableSelected: false,
  });

  const selectedStateRef = useRef(selectedState);
  selectedStateRef.current = selectedState;

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
      // selected table
      const hasTableSelected = isTableSelected(editor.state.selection);

      setSelectedState({
        rowSelected: hasRowSelected,
        columnSelected: hasColumnSelected,
        tableSelected: hasTableSelected,
      });

      // selected cells
      const cells = getSelectedCells(editor.state.selection);
      setSelectedCells(cells);

      return isCellSelection(editor.state.selection);
    },
    [editor]
  );

  if (!editor.state.schema.nodes.table) {
    return null;
  }

  const tippyOptions: BubbleMenuProps['tippyOptions'] = {
    plugins: [sticky],
    sticky: true,
    interactive: true,
    placement: 'top',
    offset: () => {
      if (
        selectedStateRef &&
        (selectedStateRef.current.tableSelected ||
          selectedStateRef.current.columnSelected)
      ) {
        return [0, 16];
      }
      return [0, 8];
    },
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
      const node = view.nodeDOM(posFrom) as HTMLElement;
      if (
        node &&
        selectedStateRef.current &&
        (selectedStateRef.current.tableSelected ||
          selectedStateRef.current.rowSelected)
      ) {
        return node.getBoundingClientRect();
      }
      return posToDOMRect(view, posFrom, posTo);
    },
  };

  const selectedCellsCount = selectedCells?.length || 0;
  const canSplitCell = editor.can().splitCell?.();
  const canMergeCells = editor.can().mergeCells?.();

  const divider = <span className="tide-menu-bar__divider" />;

  const mergeOrSplitItems = ((selectedCellsCount > 1 && canMergeCells) ||
    canSplitCell) && (
    <Tippy
      interactive
      content={
        <div className={'tide-menu-bar__tooltip'}>
          {canSplitCell ? '拆分' : '合并'}
        </div>
      }
    >
      <button
        className="tide-menu-bar__btn tide-menu-bar__item"
        onClick={() => editor.commands.mergeOrSplit()}
      >
        {canSplitCell ? <IconCellSplitBold /> : <IconCellMergeBold />}
      </button>
    </Tippy>
  );

  const textAlignItems = (
    <>
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>居左</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => (editor.commands as any).unsetTextAlign?.()}
        >
          <IconAlignLeftBold />
        </button>
      </Tippy>
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>居中</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => (editor.commands as any).setTextAlign?.('center')}
        >
          <IconAlignCenterBold />
        </button>
      </Tippy>
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>居右</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => (editor.commands as any).setTextAlign?.('right')}
        >
          <IconAlignRightBold />
        </button>
      </Tippy>
    </>
  );

  let deleteButton = null;
  if (selectedState.tableSelected) {
    deleteButton = (
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>删除表格</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => editor.commands.deleteTable()}
        >
          <IconTrashBold />
        </button>
      </Tippy>
    );
  } else if (selectedState.rowSelected) {
    deleteButton = (
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>删除行</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => editor.commands.deleteRow()}
        >
          <IconTrashBold />
        </button>
      </Tippy>
    );
  } else if (selectedState.columnSelected) {
    deleteButton = (
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>删除列</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => editor.commands.deleteColumn()}
        >
          <IconTrashBold />
        </button>
      </Tippy>
    );
  }

  const copyAndCutItems = (
    <>
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>复制</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => document.execCommand('copy')}
        >
          <IconCopyBold />
        </button>
      </Tippy>
      <Tippy
        interactive
        content={<div className={'tide-menu-bar__tooltip'}>剪切</div>}
      >
        <button
          className="tide-menu-bar__btn tide-menu-bar__item"
          onClick={() => {
            document.execCommand('cut');
            editor.commands.deleteTable();
            editor.commands.focus();
          }}
        >
          <IconCutBold />
        </button>
      </Tippy>
    </>
  );

  return (
    <BubbleMenu
      pluginKey={tableCellBubbleMenuPluginKey}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
    >
      <div className="tide-menu-bar tide-menu-bar-bubble">
        {selectedState.tableSelected ? (
          <>
            {copyAndCutItems}
            {divider}
            {deleteButton}
          </>
        ) : (
          <>
            {mergeOrSplitItems}
            {mergeOrSplitItems && divider}
            {textAlignItems}
            {deleteButton && divider}
            {deleteButton}
          </>
        )}
      </div>
    </BubbleMenu>
  );
};
