import {
  combineTransactionSteps,
  escapeForRegEx,
  getChangedRanges,
  findChildrenInRange,
  InputRule,
  Node,
  nodeInputRule,
  PasteRule,
  mergeAttributes,
} from '@tiptap/core';
import { Suggestion, SuggestionOptions } from '@tiptap/suggestion';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import emojiRegex from 'emoji-regex';
import { appleEmojis } from './emojis';
import {
  checkEmojiSupport,
  findEmoji,
  getEmojiName,
  saveEmojiToStorage,
} from './utils';

export type EmojiItem = {
  emoji?: string;
  name: string;
  shortcodes: string[];
  tags: string[];
  group: string;
  emoticons?: string[];
  version?: number;
  fallbackImage?: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      /**
       * Insert a emoji node
       */
      insertEmoji: (name: string) => ReturnType;
    };
  }
}

export type EmojiOptions = {
  HTMLAttributes: Record<string, any>;
  emojis: EmojiItem[];
  enableEmoticons: boolean;
  forceFallbackImages: boolean;
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

export type EmojiStorage = {
  emojis: EmojiItem[];
  isSupported: (emoji: EmojiItem) => boolean;
};

export const EmojiPluginKey = new PluginKey('emojiSuggestion');

export const pasteRegex = /:([a-zA-Z0-9_+-]+):/g;

export const Emoji = Node.create<EmojiOptions, EmojiStorage>({
  name: 'emoji',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      emojis: appleEmojis,
      enableEmoticons: false,
      forceFallbackImages: false,
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
        command: ({ editor, range: r, props }) => {
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const { nodeAfter } = editor.view.state.selection.$to;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');
          const range = { ...r };

          if (overrideSpace) {
            range.to += 1;
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();

          window.getSelection()?.collapseToEnd();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },

  addStorage() {
    const { emojis } = this.options;
    const versionSupportedMap: Record<number, boolean> = Array.from(
      new Set(emojis.map((e) => e.version))
    )
      .filter((version) => typeof version == 'number')
      .reduce((acc, version) => {
        const e = emojis.find((item) => item.version === version && item.emoji);
        return {
          ...acc,
          [version!]: e ? checkEmojiSupport(e.emoji!) : false,
        };
      }, {});
    return {
      emojis: this.options.emojis,
      isSupported: (emoji: EmojiItem) =>
        emoji.version ? versionSupportedMap[emoji.version] : false,
    };
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.dataset.name,
        renderHTML: (attributes) => ({
          'data-name': attributes.name,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const emoji = findEmoji(node.attrs.name, this.options.emojis);
    const attributes = mergeAttributes(
      HTMLAttributes,
      this.options.HTMLAttributes,
      {
        'data-type': this.name,
      }
    );

    if (!emoji) {
      return ['span', attributes, `:${node.attrs.name}:`];
    }

    const isSupported = this.storage.isSupported(emoji);
    const picture =
      !emoji.emoji ||
      (this.options.forceFallbackImages && emoji.fallbackImage) ||
      (!isSupported && emoji.fallbackImage);

    return [
      'span',
      attributes,
      picture
        ? [
            'img',
            {
              src: emoji.fallbackImage,
              draggable: 'false',
              loading: 'lazy',
              align: 'absmiddle',
              class: 'emoji',
            },
          ]
        : emoji.emoji,
    ];
  },

  renderText({ node }) {
    const emoji = findEmoji(node.attrs.name, this.options.emojis);
    return emoji?.emoji || `:${node.attrs.name}:`;
  },

  addCommands() {
    return {
      insertEmoji:
        (name) =>
        ({ commands }) => {
          const emoji = findEmoji(name, this.options.emojis);
          if (!emoji) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: {
              name: emoji.name,
            },
          });
        },
    };
  },

  addInputRules() {
    const rules: InputRule[] = [];

    rules.push(
      new InputRule({
        find: /:([a-zA-Z0-9_+-]+):$/,
        handler: ({ range, match, commands }) => {
          const name = match[1];
          const emoji = findEmoji(name, this.options.emojis);
          if (emoji) {
            commands.insertContentAt(range, {
              type: this.name,
              attrs: {
                name,
              },
            });
            saveEmojiToStorage(emoji);
          }
        },
      })
    );

    if (this.options.enableEmoticons) {
      const emoticons = this.options.emojis
        .map((emoji) => emoji.emoticons)
        .flat()
        .filter((emoji) => emoji) as string[];

      const emoticonsRegex = new RegExp(
        `(?:^|\\s)(${emoticons
          .map((emoticon) => escapeForRegEx(emoticon))
          .join('|')}) $`
      );

      rules.push(
        nodeInputRule({
          find: emoticonsRegex,
          type: this.type,
          getAttributes: (match) => {
            const emoji = this.options.emojis.find((e) =>
              e?.emoticons?.includes(match[1])
            );
            if (emoji) {
              return {
                name: emoji.name,
              };
            }
            return false;
          },
        })
      );
    }

    return rules;
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ range, match, commands }) => {
          const name = match[1];
          if (findEmoji(name, this.options.emojis)) {
            commands.insertContentAt(
              range,
              {
                type: this.name,
                attrs: {
                  name,
                },
              },
              {
                updateSelection: false,
              }
            );
          }
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      new Plugin({
        key: new PluginKey('emoji'),
        props: {
          handleDoubleClickOn: (_, pos, node) => {
            if (node.type !== this.type) {
              return false;
            }
            return this.editor.commands.setTextSelection({
              from: pos,
              to: pos + node.nodeSize,
            });
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          const docChanges =
            transactions.some((transaction) => transaction.docChanged) &&
            !oldState.doc.eq(newState.doc);

          if (!docChanges) {
            return;
          }

          const { tr } = newState;
          const transform = combineTransactionSteps(oldState.doc, [
            ...transactions,
          ]);
          const changes = getChangedRanges(transform);

          changes.forEach(({ newRange }) => {
            if (newState.doc.resolve(newRange.from).parent.type.spec.code) {
              return;
            }

            const nodesInChangedRanges = findChildrenInRange(
              newState.doc,
              newRange,
              (node) => node.type.isText
            );

            nodesInChangedRanges.forEach(({ node, pos }) => {
              if (!node.text) {
                return;
              }

              // replace emoji symbol (unicode) to emoji node
              [...node.text.matchAll(emojiRegex())].forEach((match) => {
                if (match.index === undefined) {
                  return;
                }
                const symbol = match[0];
                const emoji = getEmojiName(symbol, this.options.emojis);
                if (!emoji) {
                  return;
                }
                const from = tr.mapping.map(pos + match.index);
                const to = from + symbol.length;
                const newNode = this.type.create({
                  name: emoji,
                });
                tr.replaceRangeWith(from, to, newNode);
              });
            });
          });

          if (!tr.steps.length) {
            return;
          }

          return tr;
        },
      }),
    ];
  },
});
