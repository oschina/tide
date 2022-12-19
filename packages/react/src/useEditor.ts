import { DependencyList, useEffect, useState } from 'react';
import type { Editor, EditorOptions } from '@tiptap/core';

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue((value) => value + 1);
}

export const useEditor = <
  T extends Editor = Editor,
  O extends EditorOptions = EditorOptions
>(
  EditorClass: { new (...args: any[]): T },
  options: Partial<O> = {},
  deps: DependencyList = []
): T | null => {
  const [editor, setEditor] = useState<T | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let isMounted = true;

    const instance = new EditorClass(options);

    setEditor(instance);

    instance.on('transaction', () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMounted) {
            forceUpdate();
          }
        });
      });
    });

    return () => {
      instance.destroy();
      isMounted = false;
    };
  }, deps);

  return editor;
};
