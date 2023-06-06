import React from 'react';
import { IconTableBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { InsertTableButton } from '@gitee/tide-extension-table';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';

export type TableProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Table: React.FC<TableProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'table'),
    disabled: () =>
      !editor.state.schema.nodes.table ||
      !editor.can().chain().focus().insertTable?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || '表格'}>
        <InsertTableButton editor={editor}>
          <Button isActive={statusMap?.isActive} disabled={statusMap?.disabled}>
            <IconTableBold />
          </Button>
        </InsertTableButton>
      </Tooltip>
    </MenuBarItem>
  );
};
