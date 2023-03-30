import classNames from 'classnames';
import React from 'react';
import { IconPr } from '@gitee/icons-react';
import './index.less';

export function StateIcon({
  state,
  className,
  ...props
}: {
  state: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const stateColors: Record<string, string> = {
    opened: 'gwe-pr-state-blue',
    closed: 'gwe-pr-state-muted',
    merged: 'gwe-pr-state-green',
  };
  return (
    <IconPr className={classNames(stateColors[state], className)} {...props} />
  );
}
