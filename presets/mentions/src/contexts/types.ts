export enum EntityType {
  MEMBER = 'member',
  ISSUE = 'issue',
  PULL_REQUEST = 'pull_request',
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
