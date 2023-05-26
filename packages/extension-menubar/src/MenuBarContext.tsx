import { debounce } from 'lodash-es';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Editor } from '@tiptap/core';

export type MenuBarContextType = {
  editor: Editor;
  subscribe: (
    symbol: symbol,
    statusFuncMap: Record<string, () => boolean>
  ) => void;
  unsubscribe: (symbol: symbol) => void;
  statusMap: Record<symbol, Record<string, boolean>>;
  updateStatusMap: () => void;
};

export const MenuBarContext = createContext<MenuBarContextType>(null);

export const useMenuBarContext = () => useContext(MenuBarContext);

export type MenuBarContextProviderProps = {
  editor?: Editor | null;
  children: React.ReactNode;
};

export const MenuBarContextProvider: React.FC<MenuBarContextProviderProps> = ({
  editor,
  children,
}) => {
  const [allStatusFuncMap, setAllStatusFuncMap] = useState<
    Record<symbol, Record<string, () => boolean>>
  >({});
  const [allStatusMap, setAllStatusMap] = useState<
    Record<symbol, Record<string, boolean>>
  >({});

  const allStatusFuncMapRef = useRef(allStatusFuncMap);
  allStatusFuncMapRef.current = allStatusFuncMap;

  const subscribe = useCallback(
    (symbol: symbol, statusFuncMap: Record<string, () => boolean>) => {
      setAllStatusFuncMap((prev) => ({
        ...prev,
        [symbol]: statusFuncMap,
      }));
    },
    []
  );

  const unsubscribe = useCallback((symbol: symbol) => {
    setAllStatusFuncMap((prev) => {
      const { [symbol]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const updateAllStatusMap = useCallback(() => {
    setAllStatusMap(() => {
      const next = {};
      for (const symbol of Object.getOwnPropertySymbols(
        allStatusFuncMapRef.current
      )) {
        const statusFuncMap = allStatusFuncMapRef.current[symbol];
        next[symbol] = {};
        Object.entries(statusFuncMap).forEach(([key, func]) => {
          next[symbol][key] = func();
        });
      }
      return next;
    });
  }, []);

  const ctx: MenuBarContextType = {
    editor,
    subscribe,
    unsubscribe,
    statusMap: allStatusMap,
    updateStatusMap: updateAllStatusMap,
  };

  useEffect(() => {
    const listener = debounce(updateAllStatusMap, 200);
    editor?.on('transaction', listener);
    return () => {
      editor?.off('transaction', listener);
    };
  }, [editor]);

  return (
    <MenuBarContext.Provider value={ctx}>{children}</MenuBarContext.Provider>
  );
};

export const useStatusMap: (
  createStatusFuncMap: () => Record<string, () => boolean>
) => {
  editor: Editor;
  statusMap: Record<string, boolean>;
} = (createStatusFuncMap: () => Record<string, () => boolean>) => {
  const { editor, subscribe, unsubscribe, statusMap } = useMenuBarContext();
  const symbol = useMemo(() => Symbol(), []);

  useEffect(() => {
    subscribe(symbol, createStatusFuncMap());
    return () => unsubscribe(symbol);
  }, [editor]);

  return {
    editor,
    statusMap: statusMap[symbol],
  };
};
