import React from 'react';
import { IconStrikethroughBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type StrikeProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Strike: React.FC<StrikeProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'strike'),
    disabled: () =>
      !editor.state.schema.marks.strike ||
      !editor.can().chain().focus().toggleStrike?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `删除线 (${command} + Shift + X)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleStrike?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconStrikethroughBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
