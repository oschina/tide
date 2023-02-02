import {
  ListItem as TListItem,
  ListItemOptions as TListItemOptions,
} from '@tiptap/extension-list-item';

export type ListItemOptions = TListItemOptions;

export const ListItem = TListItem.extend<ListItemOptions>({
  group: 'listItem',
});
