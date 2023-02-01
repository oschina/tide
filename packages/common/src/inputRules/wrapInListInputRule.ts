import {
  Fragment,
  Node as ProseMirrorNode,
  NodeRange,
  NodeType,
  Slice,
} from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';
import {
  InputRule,
  InputRuleFinder,
  ExtendedRegExpMatchArray,
  findParentNode,
  isList,
  Extensions,
  callOrReturn,
} from '@tiptap/core';
import { joinListBackwards, joinListForwards } from '../helpers';

/**
 * Wraps list items in `range` to a list.
 */
function wrapItems({
  listType,
  itemType,
  tr,
  range,
}: {
  listType: NodeType;
  itemType: NodeType;
  tr: Transaction;
  range: NodeRange;
}): boolean {
  const oldList = range.parent;

  // A slice that contianes all selected list items
  const slice: Slice = tr.doc.slice(range.start, range.end);

  if (
    oldList.type === listType &&
    slice.content.firstChild?.type === itemType
  ) {
    return false;
  }

  const newItems: ProseMirrorNode[] = [];

  for (let i = 0; i < slice.content.childCount; i++) {
    const oldItem = slice.content.child(i);

    if (!itemType.validContent(oldItem.content)) {
      return false;
    }

    const newItem = itemType.createChecked(null, oldItem.content);
    newItems.push(newItem);
  }

  const newList = listType.createChecked(null, newItems);

  tr.replaceRange(
    range.start,
    range.end,
    new Slice(Fragment.from(newList), 0, 0)
  );
  return true;
}

/**
 * Wraps existed list items to a new type of list, which only containes these list items.
 */
export function wrapSelectedItems({
  extensions,
  listType,
  itemType,
  tr,
}: {
  extensions: Extensions;
  listType: NodeType;
  itemType: NodeType;
  tr: Transaction;
}): boolean {
  const { $from, $to } = tr.selection;
  const range = $from.blockRange($to, (node) =>
    isList(node.type.name, extensions)
  );

  if (!range) {
    return false;
  }

  const atStart = range.startIndex === 0;

  const { from, to } = tr.selection;

  if (!wrapItems({ listType, itemType, tr, range })) {
    return false;
  }

  tr.setSelection(
    TextSelection.between(
      tr.doc.resolve(atStart ? from : from + 2),
      tr.doc.resolve(atStart ? to : to + 2)
    )
  );
  tr.scrollIntoView();

  return true;
}

/**
 * Build an input rule for automatically wrapping a textblock to
 * another list type when a given string is typed in list block.
 */
export function wrapInListInputRule(config: {
  find: InputRuleFinder;
  listType: NodeType;
  itemType: NodeType;
  extensions: Extensions;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
  joinBefore?: (
    match: ExtendedRegExpMatchArray,
    node: ProseMirrorNode
  ) => boolean;
  joinAfter?: (
    match: ExtendedRegExpMatchArray,
    node: ProseMirrorNode
  ) => boolean;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, match, range, chain }) => {
      const { selection, tr } = state;
      const attributes =
        callOrReturn(config.getAttributes, undefined, match) || {};
      const $start = tr.doc.resolve(range.from);
      const blockRange = $start.blockRange();
      const wrapping =
        blockRange && findWrapping(blockRange, config.listType, attributes);

      if (wrapping) {
        return null;
      }

      const parentList = findParentNode((node) =>
        isList(node.type.name, config.extensions)
      )(selection);

      if (!parentList || parentList.node.type === config.listType) {
        return null;
      }

      return chain()
        .command(({ tr }) =>
          wrapSelectedItems({
            extensions: config.extensions,
            listType: config.listType,
            itemType: config.itemType,
            tr,
          })
        )
        .command(({ tr }) => {
          tr.deleteRange(
            tr.selection.$from.pos - (range.to - range.from),
            tr.selection.$from.pos
          );
          return true;
        })
        .command(({ tr }) =>
          joinListBackwards(
            tr,
            config.listType,
            config.joinBefore
              ? (before) => config.joinBefore(match, before)
              : undefined
          )
        )
        .command(({ tr }) =>
          joinListForwards(
            tr,
            config.listType,
            config.joinAfter
              ? (after) => config.joinAfter(match, after)
              : undefined
          )
        )
        .run();
    },
  });
}
