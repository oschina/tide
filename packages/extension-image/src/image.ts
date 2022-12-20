import {
  Image as TImage,
  ImageOptions as TImageOptions,
} from '@tiptap/extension-image';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { defaultExtraAttributes, defaultSettings } from './default';
import { Plugin } from 'prosemirror-state';
import { ReactNodeViewRenderer } from '@test-pkgs/react';
import { imagePluginKey } from './utils';
import pasteHandler from './plugin/pasteHandler';
import dropHandler from './plugin/dropHandler';
import imageNodeView from './plugin/imageNodeView';
import ImageNodeView from './ImageNodeView';

import './styles/common.css';
import './styles/sideResize.css';
import './styles/withResize.css';

export type ImageOptions = TImageOptions;

const attributeKeys = [...Object.keys(defaultExtraAttributes), 'src', 'alt'];

export const Image = TImage.extend<ImageOptions>({
  name: 'image',

  allowGapCursor() {
    return !this.options.inline;
  },

  addAttributes() {
    return {
      align: { default: null },
      src: { default: null },
      alt: { default: null },
      height: { default: null },
      width: { default: null },
      maxWidth: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.imagePluginRoot',
        getAttrs(dom: HTMLElement) {
          return (
            attributeKeys
              .map((attrKey) => ({
                [attrKey]: dom.getAttribute(`imageplugin-${attrKey}`),
              }))
              // merge
              .reduce((acc, curr) => ({ ...acc, ...curr }), {})
          );
        },
      },
    ];
  },

  renderHTML({ node }) {
    const toAttributes = attributeKeys
      .map((attrKey) => ({ [`imageplugin-${attrKey}`]: node.attrs[attrKey] }))
      // merge
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return [
      'div',
      {
        class: `imagePluginRoot`,
        ...toAttributes,
      },
    ];
  },

  addProseMirrorPlugins() {
    const schema = this.editor.schema;
    return [
      new Plugin({
        key: imagePluginKey,
        // state: {
        // init() {
        //   return DecorationSet.empty;
        // },
        // apply(tr, value: DecorationSet) {
        //   let set = value.map(tr.mapping, tr.doc);
        //   const action = tr.getMeta(imagePluginKey);
        //   if (action?.type === 'add') {
        //     const widget = document.createElement('placeholder');
        //     const deco = Decoration.widget(action.pos, widget, {
        //       id: action.id,
        //     });
        //     set = set.add(tr.doc, [deco]);
        //   } else if (action?.type === 'remove') {
        //     set = set.remove(
        //       set.find(undefined, undefined, (spec) => spec.id === action.id),
        //     );
        //   }
        //   return set;
        // },
        // },
        props: {
          decorations: (state: EditorState) =>
            imagePluginKey.getState(state) || DecorationSet.empty,
          handleDOMEvents: {
            paste: pasteHandler(schema),
            drop: dropHandler(schema),
          },
          nodeViews: {
            image: imageNodeView(defaultSettings),
          },
        },
      }),
    ];
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(ImageNodeView);
  // },
});
