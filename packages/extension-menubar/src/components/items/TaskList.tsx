import React from 'react';
import { IconListTaskBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type TaskListProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const TaskList: React.FC<TaskListProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'taskList'),
    disabled: () =>
      !editor.state.schema.nodes.taskList ||
      !editor.can().chain().focus().toggleTaskList?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `任务列表 (${command} + Shift + 9)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleTaskList?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconListTaskBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
