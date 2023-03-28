import React, { createContext, useContext } from 'react';
import {
  useMergedBulkFetcher,
  BulkFetcherRequestFunc,
} from './useMergedBulkFetcher';
import { EntityPKValueType, EntityResultType, EntityType } from './types';

export type EditorRemoteDataContextType = {
  fetchData: <T extends EntityType>(
    type: T,
    pkValue: EntityPKValueType[T]
  ) => Promise<EntityResultType[T] | null>;
};

const EditorRemoteDataContext = createContext<EditorRemoteDataContextType>({
  fetchData: async () => null,
});

export const useEditorRemoteDataContext = () =>
  useContext(EditorRemoteDataContext);

export type EditorRemoteDataProviderProps = {
  children: React.ReactNode;
  fetchResources: BulkFetcherRequestFunc;
};

export const EditorRemoteDataProvider: React.FC<
  EditorRemoteDataProviderProps
> = ({ fetchResources, children }) => {
  const { fetch } = useMergedBulkFetcher({
    request: fetchResources,
    wait: 500,
  });

  const ctx: EditorRemoteDataContextType = {
    fetchData: (type, pkValue) => fetch(type, pkValue),
  };

  return (
    <EditorRemoteDataContext.Provider value={ctx}>
      {children}
    </EditorRemoteDataContext.Provider>
  );
};
