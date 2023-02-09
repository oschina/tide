import { NodeType } from '@tiptap/pm/model';

export function isListItem(type: NodeType): boolean {
  return !!type.spec.group?.split(' ').includes('listItem');
}
