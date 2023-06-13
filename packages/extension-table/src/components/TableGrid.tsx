import classNames from 'classnames';
import React, { useState } from 'react';
import './TableGrid.less';

export type TableGridProps = {
  rows: number;
  columns: number;
  onChange?: (rows: number, columns: number) => void;
  onClick?: (row: number, column: number) => void;
};

export const TableGrid: React.FC<TableGridProps> = ({
  rows,
  columns,
  onChange,
  onClick,
}) => {
  const [selectedRows, setSelectedRows] = useState<number>(0);
  const [selectedColumns, setSelectedColumns] = useState<number>(0);
  if (rows < 1 || columns < 1) {
    return null;
  }
  return (
    <div
      className="tide-editor-table-grid"
      onMouseLeave={() => {
        setSelectedRows(0);
        setSelectedColumns(0);
        onChange?.(0, 0);
      }}
      onClick={() => onClick?.(selectedRows, selectedColumns)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={`row-${i}`} className="tide-editor-table-grid__row">
          {Array.from({ length: columns }, (_, j) => (
            <div
              key={`cell-${i}-${j}`}
              className={classNames('tide-editor-table-grid__cell', {
                ['tide-editor-table-grid__cell--selected']:
                  i + 1 <= selectedRows && j + 1 <= selectedColumns,
              })}
              onMouseOver={() => {
                setSelectedRows(i + 1);
                setSelectedColumns(j + 1);
                onChange?.(i + 1, j + 1);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
