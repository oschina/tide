import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { mergeAttributes, Node, getNodeType, PasteRule } from '@tiptap/core';
import { wrapInListInputRule, wrappingInputRule } from '@gitee/tide-common';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    taskItem: {
      insertTaskItem: (
        text: string,
        checked: boolean,
        from: number,
        to: number
      ) => ReturnType;
    };
  }
}

export interface TaskItemOptions {
  onReadOnlyChecked?: (
    node: ProseMirrorNode,
    checked: boolean,
    position?: number
  ) => boolean;
  nested: boolean;
  HTMLAttributes: Record<string, any>;
}

export const inputRegex = /^\s*([[【]([( |x])?[\]】])\s$/;

export const pasteRegex = /^\s*(?:-\s)*(\[([( |x])?\])\s(.*)$/g;

export const TaskItem = Node.create<TaskItemOptions>({
  name: 'taskItem',

  group: 'listItem',

  addOptions() {
    return {
      onReadOnlyChecked: undefined,
      nested: true,
      HTMLAttributes: {},
    };
  },

  content() {
    return this.options.nested ? 'paragraph block*' : 'paragraph+';
  },

  defining: true,

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.getAttribute('data-checked') === 'true',
        renderHTML: (attributes) => ({
          'data-checked': attributes.checked,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'li',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': this.name,
      }),
      [
        'label',
        [
          'input',
          {
            type: 'checkbox',
            checked: node.attrs.checked ? 'checked' : null,
          },
        ],
        ['span'],
      ],
      ['div', 0],
    ];
  },

  addKeyboardShortcuts() {
    const shortcuts = {
      Enter: () => this.editor.commands.splitListItem(this.name),
      'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
    };

    if (!this.options.nested) {
      return shortcuts;
    }

    return {
      ...shortcuts,
      Tab: () => this.editor.commands.sinkListItem(this.name),
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement('li');
      const checkboxWrapper = document.createElement('label');
      const checkboxStyler = document.createElement('span');
      const checkbox = document.createElement('input');
      const content = document.createElement('div');

      checkboxWrapper.contentEditable = 'false';
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', (event) => {
        const { checked } = event.target as HTMLInputElement;

        // if the editor isn’t editable and we don't have a handler for
        // readonly checks we have to undo the latest change
        if (
          !editor.isEditable &&
          (!this.options.onReadOnlyChecked ||
            (this.options.onReadOnlyChecked &&
              !this.options.onReadOnlyChecked(
                node,
                checked,
                typeof getPos === 'function' ? getPos() : undefined
              )))
        ) {
          checkbox.checked = !checkbox.checked;
          return;
        }

        if (typeof getPos === 'function') {
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .command(({ tr }) => {
              const position = getPos();
              const currentNode = tr.doc.nodeAt(position);

              tr.setNodeMarkup(position, undefined, {
                ...currentNode?.attrs,
                checked,
              });

              return true;
            })
            .run();
        }
      });

      Object.entries(this.options.HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });

      listItem.dataset.checked = node.attrs.checked;
      if (node.attrs.checked) {
        checkbox.setAttribute('checked', 'checked');
      }

      checkboxWrapper.append(checkbox, checkboxStyler);
      listItem.append(checkboxWrapper, content);

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });

      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }

          listItem.dataset.checked = updatedNode.attrs.checked;
          if (updatedNode.attrs.checked) {
            checkbox.setAttribute('checked', 'checked');
          } else {
            checkbox.removeAttribute('checked');
          }

          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      insertTaskItem:
        (text, checked, from, to) =>
        ({ state }) => {
          const { schema, tr } = state;
          const { paragraph } = schema.nodes;

          const textNode = schema.text(text);
          const newParagraph = paragraph.create(undefined, textNode);
          const newTaskItem = this.type.create({ checked }, newParagraph);

          tr.replaceRangeWith(from, to, newTaskItem);
          return true;
        },
    };
  },

  addInputRules() {
    const taskListType = getNodeType('taskList', this.editor.schema);
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => ({
          checked: match[match.length - 1] === 'x',
        }),
        joinBefore: (_match, node) => node.type === taskListType,
        joinAfter: (_match, node) => node.type === taskListType,
      }),
      wrapInListInputRule({
        find: inputRegex,
        listType: taskListType,
        itemType: this.type,
        extensions: this.editor.extensionManager.extensions,
        getAttributes: (match) => ({
          checked: match[match.length - 1] === 'x',
        }),
        joinBefore: (_match, node) => node.type === taskListType,
        joinAfter: (_match, node) => node.type === taskListType,
      }),
    ];
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ match, range, commands }) => {
          const [, , checked, text] = match;
          if (text) {
            commands.insertTaskItem(
              text,
              checked === 'x',
              range.from - 1,
              range.to
            );
            return true;
          }
        },
      }),
    ];
  },
});
