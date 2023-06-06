import React from 'react';
import { IconCodeBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type CodeProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Code: React.FC<CodeProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'code'),
    disabled: () =>
      !editor.state.schema.marks.code ||
      !editor.can().chain().focus().toggleCode?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `行内代码 (${command} + E)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleCode?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconCodeBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
