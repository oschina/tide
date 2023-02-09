import { NodeType } from '@tiptap/pm/model';

export function isList(type: NodeType): boolean {
  return !!type.spec.group?.split(' ').includes('list');
}
