import { isWindows } from '@gitee/wysiwyg-editor-common';

export const command = isWindows() ? 'Ctrl' : '⌘';

export const option = isWindows() ? 'Alt' : 'Option';
