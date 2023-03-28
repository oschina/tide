import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash-es';
import { EntityType, EntityPKValueType, EntityResultType } from './types';
import { entityPKMap } from './constants';

type FetchParam<T extends EntityType> = {
  type: T;
  value: EntityPKValueType[T];
  resolve: (value: EntityResultType[T] | null) => void;
};

export type BulkFetcherRequestFunc = (
  params: Record<EntityType, EntityPKValueType[EntityType][]>
) => Promise<Record<EntityType, EntityResultType[EntityType][]> | undefined>;

export type BulkFetcherOptions = {
  request: BulkFetcherRequestFunc;
  wait: number;
};

type BulkFetcherReturnType = {
  fetch: <T extends EntityType>(
    type: T,
    pkValue: EntityPKValueType[T]
  ) => Promise<EntityResultType[T] | null>;
};

export type BulkFetcher = (
  options: BulkFetcherOptions
) => BulkFetcherReturnType;

const mergedDebounce = <T extends EntityType>(
  callback: (params: FetchParam<T>[]) => Promise<void>,
  delay: number
) => {
  let mergedParams: FetchParam<T>[] = [];

  const debouncedCallback = debounce(() => {
    callback(mergedParams);
    mergedParams = [];
  }, delay);

  return (param: FetchParam<T>) => {
    mergedParams = [...mergedParams, param];
    debouncedCallback();
  };
};

export const useMergedBulkFetcher: BulkFetcher = ({ request, wait = 500 }) => {
  const loadedDataRef =
    useRef<
      Record<
        EntityType,
        Record<EntityPKValueType[EntityType], EntityResultType[EntityType]>
      >
    >(null);

  const realFetch = useMemoizedFn(async (params: FetchParam<EntityType>[]) => {
    // request params
    // { "issues": ["I001", "I002", ...], "members": [...], "pull_requests": [...] }
    const keyValuesMap: Record<EntityType, EntityPKValueType[EntityType][]> =
      params.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item.value);
        return acc;
      }, {} as Record<EntityType, EntityPKValueType[EntityType][]>);

    // request
    let keyResultMap:
      | Record<EntityType, EntityResultType[EntityType][]>
      | undefined;
    try {
      keyResultMap = await request(keyValuesMap);
    } catch (err) {
      console.error(err);
    }

    // response data
    // { "issues": { "I001": issue1, "I002": issue2, ... }, "members": { ... }, "pull_requests": { ... } }
    const keyValueResultMap:
      | Record<
          EntityType,
          Record<EntityPKValueType[EntityType], EntityResultType[EntityType]>
        >
      | undefined = (Object.keys(keyResultMap) as EntityType[])?.reduce(
      (acc, entityType) => {
        acc[entityType] = keyResultMap[entityType]?.reduce(
          (entityResultAcc, entityResult) => {
            const pkValue = entityResult?.[
              entityPKMap[entityType] as keyof EntityResultType[EntityType]
            ] as EntityPKValueType[EntityType];
            if (pkValue) {
              // eslint-disable-next-line no-param-reassign
              entityResultAcc[pkValue] = entityResult;
            }
            return entityResultAcc;
          },
          {} as Record<
            EntityPKValueType[EntityType],
            EntityResultType[EntityType]
          >
        );
        return acc;
      },
      {} as Record<
        EntityType,
        Record<EntityPKValueType[EntityType], EntityResultType[EntityType]>
      >
    );

    // resolve
    params.forEach((item) => {
      if (!loadedDataRef.current) {
        loadedDataRef.current = {} as typeof loadedDataRef.current;
      }
      if (!loadedDataRef.current[item.type]) {
        loadedDataRef.current[item.type] = {};
      }
      loadedDataRef.current[item.type][item.value] =
        keyValueResultMap?.[item.type]?.[item.value] || null;
      item.resolve(keyValueResultMap?.[item.type]?.[item.value] || null);
    });
  });

  const mergedDebounceFetch = useMemoizedFn(mergedDebounce(realFetch, wait));

  const fetch = useMemoizedFn<BulkFetcherReturnType['fetch']>(
    async (type, value) => {
      if (loadedDataRef.current?.[type]?.[value]) {
        return loadedDataRef.current[type][
          value
        ] as EntityResultType[typeof type];
      }
      return new Promise((resolve) => {
        mergedDebounceFetch({ type, value, resolve } as FetchParam<
          typeof type
        >);
      });
    }
  );

  return {
    fetch,
  };
};
