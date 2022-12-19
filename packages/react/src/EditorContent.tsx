import React from 'react';
import { flushSync } from 'react-dom';
import { PureEditorContent as CorePureEditorContent } from '@tiptap/react';

export class PureEditorContent extends CorePureEditorContent {
  maybeFlushSync(fn: () => void) {
    // Avoid calling flushSync until the editor is initialized.
    // Initialization happens during the componentDidMount or componentDidUpdate
    // lifecycle methods, and React doesn't allow calling flushSync from inside
    // a lifecycle method.
    if (this.initialized) {
      // fix: Queue flushSync call
      // @see https://github.com/ueberdosis/tiptap/pull/3533
      queueMicrotask(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  }
}

export const EditorContent = React.memo(PureEditorContent);
