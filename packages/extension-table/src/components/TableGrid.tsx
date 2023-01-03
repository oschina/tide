import classNames from 'classnames';
import React, { useState } from 'react';
import styles from './TableGrid.module.less';

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
      className={styles['table-grid']}
      onMouseLeave={() => {
        setSelectedRows(0);
        setSelectedColumns(0);
        onChange?.(0, 0);
      }}
      onClick={() => onClick?.(selectedRows, selectedColumns)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={`row-${i}`} className={styles['table-grid__row']}>
          {Array.from({ length: columns }, (_, j) => (
            <div
              key={`cell-${i}-${j}`}
              className={classNames(styles['table-grid__cell'], {
                [styles['table-grid__cell--selected']]:
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
