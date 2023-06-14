import AwesomeDebouncePromise from 'awesome-debounce-promise';

export const mockFetchMemberMention = (query: string) => {
  return [
    'Gitee',
    'OSCHINA',
    '开源中国',
    '马建仓',
    'Tiptap',
    'Google',
    'Apple',
    'Microsoft',
  ]
    .map((label, index) => ({
      id: `${index + 1}`,
      label,
      desc: label.toLowerCase(),
      attrs: {
        name: label,
        username: label.toLowerCase(),
        url: `/members/${label.toLowerCase()}`,
      },
    }))
    .filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 5);
};

export const mockFetchMemberMentionDebounced = AwesomeDebouncePromise(
  mockFetchMemberMention,
  300,
  {
    onlyResolvesLast: false,
  }
);
