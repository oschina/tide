import { NodeType } from 'prosemirror-model';

export function isListItem(type: NodeType): boolean {
  return !!type.spec.group?.split(' ').includes('listItem');
}
