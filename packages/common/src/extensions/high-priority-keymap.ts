import {
  Extension,
  findParentNode,
  findParentNodeClosestToPos,
} from '@tiptap/core';
import {
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from '@tiptap/pm/state';
import { ResolvedPos } from '@tiptap/pm/model';
import { CellSelection, TableMap } from '@tiptap/pm/tables';

const findParentSelectableNode = ($pos: ResolvedPos) => {
  return findParentNodeClosestToPos($pos, (node) => {
    if (node.type.spec.tableRole) {
      return node.type.spec.tableRole === 'cell';
    }
    return node.type.spec.selectable;
  });
};

const isTableSelected = (selection: Selection) => {
  if (selection instanceof CellSelection) {
    const table = selection.$anchorCell.node(-1);
    const map = TableMap.get(table);
    const start = selection.$anchorCell.start(-1);
    const cells = map.cellsInRect({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    });
    const selectedCells = map.cellsInRect(
      map.rectBetween(
        selection.$anchorCell.pos - start,
        selection.$headCell.pos - start
      )
    );
    for (let i = 0, count = cells.length; i < count; i++) {
      if (selectedCells.indexOf(cells[i]) === -1) {
        return false;
      }
    }
    return true;
  }
  return false;
};

const selectTable = (tr: Transaction) => {
  const table = findParentNode(
    (node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table'
  )(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);
    const head = table.start + map.map[0];
    const anchor = table.start + map.map[map.map.length - 1];
    const $head = tr.doc.resolve(head);
    const $anchor = tr.doc.resolve(anchor);
    tr.setSelection(new CellSelection($anchor, $head));
    return true;
  }
  return false;
};

export const HighPriorityKeymap = Extension.create({
  name: 'highPriorityKeymap',

  priority: 1001,

  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.listBackspace(),
      'Mod-a': () => {
        const { state, dispatch } = this.editor.view;
        const { tr, selection, doc } = state;
        const { $from, $to } = selection;

        if (selection instanceof TextSelection) {
          const start = $from.start();
          const end = $from.end();

          const fullSelection = TextSelection.between(
            doc.resolve(0),
            doc.resolve(doc.content.size)
          );

          if (selection.eq(fullSelection)) {
            return false;
          }

          const range = $from.blockRange($to);
          const multiNode = range && range.startIndex + 1 !== range.endIndex;
          const selectCurNodeFullText = $from.pos === start && $to.pos === end;

          if (multiNode || selectCurNodeFullText) {
            const parentSelectableNode = findParentSelectableNode($from);
            if (!parentSelectableNode) {
              return false;
            }

            // select parent node
            tr.setSelection(
              NodeSelection.create(doc, parentSelectableNode.pos)
            );
            dispatch(tr);
            return true;
          } else {
            // select text
            tr.setSelection(TextSelection.create(doc, start, end));
            dispatch(tr);
            return true;
          }
        } else {
          const parentSelectableNode = findParentSelectableNode($from);
          if (!parentSelectableNode) {
            return false;
          }

          if (
            parentSelectableNode.node.type.spec.tableRole === 'cell' &&
            selection instanceof CellSelection
          ) {
            if (isTableSelected(selection)) {
              return false;
            }

            if (selectTable(tr)) {
              dispatch(tr);
              return true;
            }
          } else {
            tr.setSelection(
              NodeSelection.create(doc, parentSelectableNode.pos)
            );
            dispatch(tr);
            return true;
          }
        }

        return this.editor.commands.selectAll();
      },
    };
  },
});
