import React from 'react';
import { IconBoldBold } from '@gitee/icons-react';
import { isActive } from '@gitee/wysiwyg-editor-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type BoldProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Bold: React.FC<BoldProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'bold'),
    disabled: () => !editor.can().chain().focus().toggleBold().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `加粗 (${command} + B)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconBoldBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
