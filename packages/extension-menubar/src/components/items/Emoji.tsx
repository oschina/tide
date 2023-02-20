import React from 'react';
import { IconSmileCircleBold } from '@gitee/icons-react';
import { isActive } from '@gitee/wysiwyg-editor-react';
import { InsertEmojiButton } from '@gitee/wysiwyg-editor-extension-emoji';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';

export type EmojiProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Emoji: React.FC<EmojiProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'emoji'),
    disabled: () => !editor.can().chain().focus().insertEmoji('smile').run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || 'Emoji'}>
        <InsertEmojiButton editor={editor}>
          <Button isActive={statusMap?.isActive} disabled={statusMap?.disabled}>
            <IconSmileCircleBold />
          </Button>
        </InsertEmojiButton>
      </Tooltip>
    </MenuBarItem>
  );
};
