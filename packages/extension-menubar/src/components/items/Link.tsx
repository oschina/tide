import React from 'react';
import { IconChainBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type LinkProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Link: React.FC<LinkProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'link'),
    disabled: () =>
      !editor.state.schema.marks.link ||
      !editor.can().chain().focus().toggleMark('link').run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `链接 (${command} + K)`}>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleLink?.({ href: '' }).run()
          }
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconChainBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
