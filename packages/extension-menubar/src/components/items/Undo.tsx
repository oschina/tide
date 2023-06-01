import React from 'react';
import { IconUndoBold } from '@gitee/icons-react';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type UndoProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Undo: React.FC<UndoProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    disabled: () => !editor.can().chain().focus().undo?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `撤销 (${command} + Z)`}>
        <Button
          onClick={() => editor?.chain().focus().undo?.().run()}
          disabled={statusMap?.disabled}
        >
          <IconUndoBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
