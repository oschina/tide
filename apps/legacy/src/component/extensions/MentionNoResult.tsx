// todo 国际化
const NoResult = ({ text = '没有数据' }: { text?: string }) => {
  return <div className="mention-no-result">{text}</div>;
};

export default NoResult;
