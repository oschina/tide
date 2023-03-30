export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        indent: 0,
        level: 1,
      },
      content: [
        {
          type: 'emoji',
          attrs: {
            name: 'brown_heart',
          },
        },
        {
          type: 'emoji',
          attrs: {
            name: 'blue_heart',
          },
        },
        {
          type: 'emoji',
          attrs: {
            name: 'yellow_heart',
          },
        },
        {
          type: 'text',
          text: '12312123131331232131232123123',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: '123123123',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionMember',
          attrs: {
            name: 'ceshi',
            username: 'ceshi',
            url: '/ceshi',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionMember',
          attrs: {
            name: 'ceshi',
            username: 'ceshi',
            url: '/ceshi',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mentionMember',
          attrs: {
            name: 'git',
            username: 'git',
            url: '/git',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mentionMember',
          attrs: {
            name: 'git',
            username: 'git',
            url: '/git',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mentionMember',
          attrs: {
            name: 'neil',
            username: 'nanzm',
            url: '/nanzm',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                textAlign: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: '123123',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                textAlign: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: '12313213131231231',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                textAlign: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: '1231231231231',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionMember',
          attrs: {
            name: 'ceshi',
            username: 'ceshi',
            url: '/ceshi',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionMember',
          attrs: {
            name: 'neil',
            username: 'nanzm',
            url: '/nanzm',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mentionMember',
          attrs: {
            name: 'git',
            username: 'git',
            url: '/git',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionPullRequest',
          attrs: {
            id: '59',
            iid: '59',
            title: 'qeqweqwewqe',
            url: '/nanzm/java-web-demo/pulls/59',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'mentionIssue',
          attrs: {
            ident: 'I5',
            title:
              '我是 neil 账号的我是 neil 账号的我是 neil 账号的我是 neil 账号的我是 neil 账号的',
            url: '/nanzm/java-web-demo/issues/I5',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        language: 'plaintext',
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: '1231231231',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: '12312',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: '31231231233',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: '1231212331231231',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://file.nancode.cn/1678423410064-184890170.jpeg',
        alt: '',
        title: '',
        width: 72,
        height: 72,
        align: 'left',
      },
    },
  ],
};
