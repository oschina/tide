import { EditorView } from '@tiptap/pm/view';
import { findParentNode } from '@tiptap/core';

export function getElementContentWidth(element) {
  const styles = window.getComputedStyle(element);
  const padding =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);

  return element.clientWidth - padding;
}

// 获取选区 在单元格信息
export const selectionCellInfo = (view: EditorView) => {
  let isInTableCel = false;
  let tableCellWidth = 0;
  const predicate = (node) => node.type === view.state.schema.nodes.tableCell;
  const tableCell = findParentNode(predicate)(view.state.selection);
  if (tableCell) {
    isInTableCel = true;

    const el = view.nodeDOM(tableCell.pos);
    if (el) {
      tableCellWidth = getElementContentWidth(el as Element);
    }
  }
  return { isInTableCel, tableCellWidth };
};
