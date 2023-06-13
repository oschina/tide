import React from 'react';
import './index.less';

// todo 国际化
const NoResult = ({ text = '没有数据' }: { text?: string }) => {
  return <div className="tide-mention-no-result">{text}</div>;
};

export default NoResult;
