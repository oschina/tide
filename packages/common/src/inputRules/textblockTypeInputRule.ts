import {
  callOrReturn,
  ExtendedRegExpMatchArray,
  InputRule,
  InputRuleFinder,
} from '@tiptap/core';
import { NodeType } from '@tiptap/pm/model';

/**
 * Build an input rule that changes the type of a textblock when the
 * matched text is typed into it. When using a regular expresion you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 *
 * 基于 tiptap 的 textblockTypeInputRule 方法，修改了 handler 方法，使其支持在输入规则后，自动聚焦到编辑器
 */
export function textblockTypeInputRule(config: {
  find: InputRuleFinder;
  type: NodeType;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
  autoFocus?: boolean;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match, commands }) => {
      const $start = state.doc.resolve(range.from);
      const attributes =
        callOrReturn(config.getAttributes, undefined, match) || {};

      if (
        !$start
          .node(-1)
          .canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)
      ) {
        return null;
      }

      state.tr
        .delete(range.from, range.to)
        .setBlockType(range.from, range.from, config.type, attributes);

      // auto focus
      if (config.autoFocus) {
        setTimeout(() => commands.focus(true), 0);
      }
    },
  });
}
