import React from 'react';
import { IconLineBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command, option } from '../../utils';

export type HorizontalRuleProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const HorizontalRule: React.FC<HorizontalRuleProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'horizontalRule'),
    disabled: () =>
      !editor.state.schema.nodes.horizontalRule ||
      !editor.can().chain().focus().setHorizontalRule?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `分割线 (${command} + ${option} + S)`}>
        <Button
          onClick={() => editor?.chain().focus().setHorizontalRule?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconLineBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
