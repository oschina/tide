import React from 'react';
import { IconRedoBold } from '@gitee/icons-react';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type RedoProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Redo: React.FC<RedoProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    disabled: () => !editor.can().chain().focus().redo?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `重做 (${command} + Shift + Z)`}>
        <Button
          onClick={() => editor.chain().focus().redo?.().run()}
          disabled={statusMap?.disabled}
        >
          <IconRedoBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
