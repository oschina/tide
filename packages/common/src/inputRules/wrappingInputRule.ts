import { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model';
import { canJoin, findWrapping } from '@tiptap/pm/transform';
import {
  InputRule,
  InputRuleFinder,
  ExtendedRegExpMatchArray,
  callOrReturn,
} from '@tiptap/core';

/**
 * Build an input rule for automatically wrapping a textblock when a
 * given string is typed. When using a regular expression you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 *
 * `type` is the type of node to wrap in.
 *
 * By default, if there’s a node with the same type above/below the newly
 * wrapped node, the rule will try to join those
 * two nodes. You can pass a join before/after, which takes a regular
 * expression match and the node before/after the wrapped node, and can
 * return a boolean to indicate whether a join should happen.
 */
export function wrappingInputRule(config: {
  find: InputRuleFinder;
  type: NodeType;
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
    handler: ({ state, range, match }) => {
      const attributes =
        callOrReturn(config.getAttributes, undefined, match) || {};
      const tr = state.tr.delete(range.from, range.to);
      const $start = tr.doc.resolve(range.from);
      const blockRange = $start.blockRange();
      const wrapping =
        blockRange && findWrapping(blockRange, config.type, attributes);

      if (!wrapping) {
        return null;
      }

      tr.wrap(blockRange, wrapping);

      const currentStartPos = range.from - 1;
      const before = tr.doc.resolve(currentStartPos).nodeBefore;
      // const current = tr.doc.resolve(currentStartPos).nodeAfter;
      // const afterPos = currentStartPos + current.nodeSize;
      const afterPos = tr.selection.$from.after(1);
      const after = tr.doc.resolve(afterPos).nodeAfter;

      const canJoinBefore =
        before &&
        canJoin(tr.doc, currentStartPos) &&
        (!config.joinBefore
          ? before.type === config.type
          : config.joinBefore(match, before));

      const canJoinAfter =
        after &&
        canJoin(tr.doc, afterPos) &&
        (!config.joinAfter
          ? after.type === config.type
          : config.joinAfter(match, after));

      let joinedBefore = false;
      if (canJoinBefore) {
        tr.join(currentStartPos);
        joinedBefore = true;
      }

      if (canJoinAfter) {
        if (joinedBefore) {
          tr.join(tr.selection.$from.after(1));
        } else {
          tr.join(afterPos);
        }
      }
    },
  });
}
