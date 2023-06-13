import React from 'react';
import classNames from 'classnames';

export type MenuBarItemProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const MenuBarItem: React.FC<MenuBarItemProps> = ({
  className,
  style,
  children,
}) => {
  return (
    <span
      className={classNames('tide-menu-bar__item', className)}
      style={style}
    >
      {children}
    </span>
  );
};
