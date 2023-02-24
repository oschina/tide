import { RawCommands } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markLeftExit: {
      /**
       * Handle mark left exit.
       */
      markLeftExit: (markName: string) => ReturnType;
    };
  }
}

export const markLeftExit: RawCommands['markLeftExit'] =
  (markName) =>
  ({ tr, state, dispatch }) => {
    const { selection } = state;
    const currentPos = selection.$from;
    const isAtStart = currentPos.pos === currentPos.start();

    if (isAtStart) {
      const currentMarks = currentPos.marks();
      const mark = currentMarks.find((m) => m?.type.name === markName);

      if (!mark) {
        return false;
      }

      if (mark) {
        tr.removeStoredMark(mark);
      }

      tr.insertText(' ', currentPos.pos);
      tr.setSelection(TextSelection.near(tr.doc.resolve(currentPos.pos)));

      dispatch(tr);

      return true;
    }

    return false;
  };
