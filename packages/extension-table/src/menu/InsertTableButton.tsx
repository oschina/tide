import React, { cloneElement, forwardRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import { Editor } from '@tiptap/core';
import { TableGrid } from '../components/TableGrid';
import './InsertTableButton.less';

export type InsertTableButtonProps = {
  editor: Editor;
  children: React.ReactElement;
};

export const InsertTableButton = forwardRef<
  HTMLElement,
  InsertTableButtonProps
>(({ editor, children }, ref) => {
  const [size, setSize] = useState<{ rows: number; columns: number }>({
    rows: 0,
    columns: 0,
  });
  const [visible, setVisible] = useState(false);
  return (
    <Tippy
      content={
        <div className="tide-editor-popup tide-insert-table-popup">
          <div className="tide-insert-table-popup__header">
            <span>插入表格</span>
            <span className="tide-insert-table-popup__size">
              {size.rows > 0 &&
                size.columns > 0 &&
                `${size.columns} x ${size.rows}`}
            </span>
          </div>
          <hr className="tide-insert-table-popup__divider" />
          <TableGrid
            rows={5}
            columns={5}
            onChange={(rows, columns) => setSize({ rows, columns })}
            onClick={() => {
              if (size.rows && size.columns) {
                editor
                  ?.chain()
                  .focus()
                  .insertTable?.({
                    rows: size.rows,
                    cols: size.columns,
                    withHeaderRow: false,
                  })
                  .run();
                setVisible(false);
                setSize({ rows: 0, columns: 0 });
              }
            }}
          />
        </div>
      }
      placement="bottom-start"
      interactive
      onClickOutside={() => setVisible(false)}
      visible={visible}
    >
      {cloneElement(children, {
        ref,
        onClick: (...args: unknown[]) => {
          if (typeof children.props.onClick === 'function') {
            children.props.onClick(...args);
          }
          setVisible(true);
        },
      })}
    </Tippy>
  );
});

InsertTableButton.displayName = 'InsertTableButton';
