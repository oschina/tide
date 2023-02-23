import { EditorState, TextSelection, Transaction } from '@tiptap/pm/state';
import { joinBackward } from '@tiptap/pm/commands';
import { EditorView } from '@tiptap/pm/view';
import { isListItem } from './isListItem';
import { joinListBackwards } from './joinListBackwards';
import { dedentList } from '../utilities/list/list-command-dedent';

/**
 * 当 光标在列表项的第一个子节点(段落)的起始位置 && 该列表项是第一项 时 按下删除键
 * (1) 如果 该列表项所在的列表 前面有紧跟着的列表, 则向上连接列表
 * (2) 否则 将当前列表项减少缩进 (dedentList)
 */
export const listBackspace = (
  tr: Transaction,
  state: EditorState,
  dispatch: ((args?: any) => any) | undefined,
  view: EditorView
) => {
  // 光标在列表项的第一个子节点(段落)的起始位置 && 该列表项是第一项
  {
    const $cursor = (state.selection as TextSelection).$cursor;

    // 光标在节点内的起始位置
    if (!$cursor || $cursor.parentOffset > 0) {
      return false;
    }

    const range = $cursor.blockRange();

    // 光标在列表项的第一个子节点
    if (!range || !isListItem(range.parent.type) || range.startIndex !== 0) {
      return false;
    }

    // current item is the n-th item in list
    const listIndex = $cursor.index(range.depth - 1);

    // 该列表项是第一项
    if (listIndex !== 0) {
      return false;
    }
  }

  // 如果 该列表项所在的列表 前面有紧跟着的列表, 则向上连接列表
  if (joinListBackwards(tr)) {
    dispatch(tr);
    return true;
  }

  {
    const $cursor = (state.selection as TextSelection).$cursor;

    // 光标在节点内的起始位置
    if (!$cursor || $cursor.parentOffset > 0) {
      return false;
    }

    const range = $cursor.blockRange();

    // 光标在列表项的第一个子节点
    if (!range || !isListItem(range.parent.type) || range.startIndex !== 0) {
      return false;
    }

    // current item is the n-th item in list
    const listIndex = $cursor.index(range.depth - 1);

    // 该列表项是第一项
    if (listIndex === 0) {
      dedentList(tr);
      dispatch(tr);
      return true;
    }
  }

  joinBackward(state, dispatch, view);

  return true;
};
