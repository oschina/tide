import React from 'react';
import classNames from 'classnames';

export type MenuBarDividerProps = {
  className?: string;
};

export const MenuBarDivider: React.FC<MenuBarDividerProps> = ({
  className,
}) => {
  return <span className={classNames('tide-menu-bar__divider', className)} />;
};
