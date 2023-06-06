import React from 'react';
import { IconListBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type BulletListProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const BulletList: React.FC<BulletListProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'bulletList'),
    disabled: () =>
      !editor.state.schema.nodes.bulletList ||
      !editor.can().chain().focus().toggleBulletList?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `无序列表 (${command} + Shift + 8)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleBulletList?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconListBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
