import React from 'react';
import { IconItalicBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type ItalicProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Italic: React.FC<ItalicProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'italic'),
    disabled: () =>
      !editor.state.schema.marks.italic ||
      !editor.can().chain().focus().toggleItalic?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `斜体 (${command} + I)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleItalic?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconItalicBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
