import classNames from 'classnames';
import { forwardRef } from 'react';

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
        className={classNames('gwe-menu-bar__btn', {
          'gwe-menu-bar__btn--active': isActive,
          'gwe-menu-bar__btn--disabled': disabled,
        })}
      >
        {children}
      </button>
    );
  }
);
