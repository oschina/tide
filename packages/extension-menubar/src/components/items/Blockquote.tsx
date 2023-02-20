import React from 'react';
import { IconQuoteBold } from '@gitee/icons-react';
import { isActive } from '@gitee/wysiwyg-editor-react';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type BlockquoteProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Blockquote: React.FC<BlockquoteProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'blockquote'),
    disabled: () => !editor.can().chain().focus().toggleBlockquote().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `引用 (${command} + Shift + >)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconQuoteBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
