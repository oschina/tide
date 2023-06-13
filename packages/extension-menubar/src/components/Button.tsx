import classNames from 'classnames';
import React, { forwardRef } from 'react';

export type ButtonProps = {
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, isActive, children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={classNames('tide-menu-bar__btn', {
          'tide-menu-bar__btn--active': isActive,
          'tide-menu-bar__btn--disabled': disabled,
        })}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
