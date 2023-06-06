import React from 'react';
import { IconCodeSquareBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';

export type CodeBlockProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'codeBlock'),
    disabled: () =>
      !editor.state.schema.nodes.codeBlock ||
      !editor.can().chain().focus().toggleCodeBlock?.().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || '代码块'}>
        <Button
          onClick={() => editor?.chain().focus().toggleCodeBlock?.().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconCodeSquareBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
