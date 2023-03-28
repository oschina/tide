import { useEffect, useState } from 'react';
import { EntityPKValueType, EntityResultType, EntityType } from './types';
import { useEditorRemoteDataContext } from './context';

export const useRemoteData: <T extends EntityType>(
  type: T,
  pkValue: EntityPKValueType[T]
) => {
  loading: boolean;
  data: EntityResultType[T] | null;
} = (type, pkValue) => {
  const { fetchData } = useEditorRemoteDataContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EntityResultType[typeof type]>(null);

  const doRequest = async () => {
    setLoading(true);
    const data = pkValue ? await fetchData(type, pkValue) : null;
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    doRequest();
  }, [type, pkValue]);

  return {
    loading,
    data,
    refresh: fetchData,
  };
};
