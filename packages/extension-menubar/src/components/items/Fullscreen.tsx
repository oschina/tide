import React from 'react';
import { IconMaximizeBold, IconMinimizeBold } from '@gitee/icons-react';
import { Button } from '../Button';
import { MenuBarItem } from '../MenuBarItem';
import { Tooltip } from '../Tooltip';

export type FullscreenProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  fullscreen: boolean;
  onFullscreenChange: (fullscreen: boolean) => void;
};

export const Fullscreen: React.FC<FullscreenProps> = ({
  className,
  style,
  title,
  fullscreen,
  onFullscreenChange,
}) => (
  <MenuBarItem className={className} style={style}>
    <Tooltip text={title || '全屏'}>
      <Button
        isActive={fullscreen}
        onClick={() => onFullscreenChange(!fullscreen)}
      >
        {fullscreen ? <IconMinimizeBold /> : <IconMaximizeBold />}
      </Button>
    </Tooltip>
  </MenuBarItem>
);
