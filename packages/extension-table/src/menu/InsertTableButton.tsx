import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { Editor } from '@tiptap/core';
import { TableGrid } from '../components/TableGrid';
import './InsertTableButton.less';

export const InsertTableButton: React.FC<{
  editor: Editor;
  children: React.ReactElement;
}> = ({ editor, children }) => {
  const [size, setSize] = useState<{ rows: number; columns: number }>({
    rows: 0,
    columns: 0,
  });
  const [visible, setVisible] = useState(false);
  return (
    <Tippy
      interactive
      content={<div className="gwe-menu-bar__tooltip">Table</div>}
    >
      <Tippy
        content={
          <div className="gwe-editor-popup gwe-insert-table-popup">
            <div className="gwe-insert-table-popup__header">
              <span>插入表格</span>
              <span className="gwe-insert-table-popup__size">
                {size.rows > 0 &&
                  size.columns > 0 &&
                  `${size.columns} x ${size.rows}`}
              </span>
            </div>
            <hr className="gwe-insert-table-popup__divider" />
            <TableGrid
              rows={5}
              columns={5}
              onChange={(rows, columns) => setSize({ rows, columns })}
              onClick={() => {
                if (size.rows && size.columns) {
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({
                      rows: size.rows,
                      cols: size.columns,
                      withHeaderRow: false,
                    })
                    .run();
                  setVisible(false);
                }
              }}
            />
          </div>
        }
        offset={[0, 4]}
        placement="bottom-start"
        interactive
        onClickOutside={() => setVisible(false)}
        visible={visible}
      >
        <div className="gwe-menu-bar__item" onClick={() => setVisible(true)}>
          {children}
        </div>
      </Tippy>
    </Tippy>
  );
};
