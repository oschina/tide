import React from 'react';
import { Editor } from '@gitee/tide-react';
import type { FocusPosition, EditorOptions } from '@tiptap/core';

export type TideEditorOptions = EditorOptions & {
  autoFocus?: FocusPosition;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;
  readOnlyShowMenu?: boolean;
  menuEnableUndoRedo?: boolean;
  menuEnableFullscreen?: boolean;
  fullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean, editor: TideEditor) => void;
};

export class TideEditor extends Editor {
  autoFocus?: FocusPosition;

  readOnly?: boolean;

  readOnlyEmptyView?: React.ReactNode;

  readOnlyShowMenu?: boolean;

  menuEnableUndoRedo?: boolean;

  menuEnableFullscreen?: boolean;

  fullscreen: boolean;

  private readonly onFullscreenChange?: TideEditorOptions['onFullscreenChange'];

  constructor(options: Partial<TideEditorOptions>) {
    const {
      autoFocus,
      readOnly,
      readOnlyEmptyView,
      readOnlyShowMenu = false,
      menuEnableUndoRedo = true,
      menuEnableFullscreen = true,
      fullscreen: initFullscreen = false,
      onFullscreenChange,
      ...otherEditorOptions
    } = options;
    super(otherEditorOptions);

    this.autoFocus = autoFocus;
    this.readOnly = readOnly;
    this.readOnlyEmptyView = readOnlyEmptyView;
    this.readOnlyShowMenu = readOnlyShowMenu;
    this.menuEnableUndoRedo = menuEnableUndoRedo;
    this.menuEnableFullscreen = menuEnableFullscreen;
    this.fullscreen = initFullscreen;
    this.onFullscreenChange = onFullscreenChange;
  }

  setFullscreen(fullscreen: boolean) {
    this.fullscreen = fullscreen;
    this.onFullscreenChange?.(fullscreen, this);
    if (fullscreen) {
      this.commands.focus(this.autoFocus);
    }
  }
}
