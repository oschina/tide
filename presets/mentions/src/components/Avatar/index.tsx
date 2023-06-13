import React from 'react';
import cls from 'classnames';
import getTextAvatarColor from './getTextAvatarColor';
import './index.less';

const Avatar = ({
  className,
  src,
  username,
}: {
  className?: string;
  src: string;
  username: string;
  size?: string;
}) => {
  const matchFlag = 'no_portrait.png';

  if (
    src &&
    typeof src === 'string' &&
    src.startsWith('http') &&
    !src.endsWith(matchFlag)
  ) {
    return (
      <span className={cls('tide-member-avatar', className)}>
        <img className="tide-member-avatar__img" src={src} alt="" />
      </span>
    );
  }

  const showLetter = username.charAt(0).toUpperCase();
  const backgroundColor = getTextAvatarColor(username);
  return (
    <span
      className={cls('tide-member-avatar', className)}
      style={{ backgroundColor }}
    >
      <span className="tide-member-avatar__text">{showLetter}</span>
    </span>
  );
};

export default Avatar;
