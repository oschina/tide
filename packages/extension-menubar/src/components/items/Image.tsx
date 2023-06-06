import React from 'react';
import { IconImageBold } from '@gitee/icons-react';
import { isActive } from '@gitee/tide-common';
import { selectImageUpload } from '@gitee/tide-extension-uploader';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';

export type ImageProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Image: React.FC<ImageProps> = ({ className, style, title }) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'image'),
    disabled: () =>
      !editor.state.schema.nodes.image ||
      !editor.can().chain().focus().uploadImage?.([]).run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || '图片'}>
        <Button
          onClick={() => selectImageUpload(editor)}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconImageBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
