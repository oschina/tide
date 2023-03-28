import { EntityType } from './types';

export const entityPKMap = {
  [EntityType.MEMBER]: 'username',
  [EntityType.ISSUE]: 'ident',
  [EntityType.PULL_REQUEST]: 'id',
};
