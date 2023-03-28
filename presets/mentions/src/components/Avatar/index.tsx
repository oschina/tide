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

  if (src && typeof src === 'string' && src.endsWith(matchFlag)) {
    const showLetter = username.charAt(0).toUpperCase();
    const backgroundColor = getTextAvatarColor(username);
    return (
      <div
        className={cls('gwe-member-avatar', className)}
        style={{ backgroundColor }}
      >
        <span className="gwe-member-avatar__text">{showLetter}</span>
      </div>
    );
  }

  return (
    <div className={cls('gwe-member-avatar', className)}>
      <img className="gwe-member-avatar__img" src={src} alt="" />
    </div>
  );
};

export default Avatar;
