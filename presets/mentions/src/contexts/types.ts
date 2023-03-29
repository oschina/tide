export enum EntityType {
  MEMBER = 'users',
  ISSUE = 'issues',
  PULL_REQUEST = 'pull_requests',
}

export type EntityPKValueType = {
  [EntityType.MEMBER]: string;
  [EntityType.ISSUE]: string;
  [EntityType.PULL_REQUEST]: number;
};

export type EntityResultType = {
  [EntityType.MEMBER]: any;
  [EntityType.ISSUE]: any;
  [EntityType.PULL_REQUEST]: any;
};
