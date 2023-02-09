import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';
import { UploaderFunc } from '../types';
import './placeholder.less';

function findPlaceholder(state, id) {
  const decos = ImagePlaceholderPlugin.getState(state);
  const found = decos.find(null, null, (spec) => spec.id === id);
  return found.length ? found[0].from : null;
}

export const handleUploadImages = (
  view: EditorView,
  pos: number,
  images: File[],
  uploadFunc: UploaderFunc
) => {
  const { schema } = view.state;

  images.forEach(async (image, index) => {
    const id = {};
    const blobUrl = URL.createObjectURL(image);
    const tr = view.state.tr;
    if (!tr.selection.empty) {
      tr.deleteSelection();
    }
    tr.setMeta(ImagePlaceholderPlugin, {
      add: {
        id,
        pos: pos + index,
        src: blobUrl,
      },
    });
    view.dispatch(tr);

    // const reader = new FileReader();
    // reader.onload = (readerEvent) => {
    //   const tr = view.state.tr;
    //   if (!tr.selection.empty) {
    //     tr.deleteSelection();
    //   }
    //   tr.setMeta(ImagePlaceholderPlugin, {
    //     add: {
    //       id,
    //       pos: pos + index,
    //       src: readerEvent.target.result,
    //     },
    //   });
    //   view.dispatch(tr);
    // };
    // reader.readAsDataURL(image);

    const src = await uploadFunc(image, (progress) => {
      view.dispatch(
        view.state.tr.setMeta(ImagePlaceholderPlugin, {
          progress: { id, progress },
        })
      );
    });

    if (src) {
      URL.revokeObjectURL(blobUrl);

      const plpos = findPlaceholder(view.state, id);
      if (plpos == null) {
        return;
      }

      view.dispatch(
        view.state.tr
          .replaceWith(plpos, plpos, schema.nodes.image.create({ src }))
          .setMeta(ImagePlaceholderPlugin, { remove: { id } })
      );
    }
  });
};

export const ImagePlaceholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },

    apply(tr, state) {
      state = state.map(tr.mapping, tr.doc);
      const action = tr.getMeta(this);
      if (!action) {
        return state;
      }

      if (action.add) {
        const template = document.createElement('template');
        template.innerHTML = `<div class='gwe-uploader__img'>
          <div class='gwe-uploader__img-placeholder'>
            <img src='${action.add.src}' alt='upload placeholder'>
            <span class='gwe-uploader__img-progress'><span class='gwe-uploader__img-progress-inner' style='width: 10%;'></span></span>
          </div>
        </div>`;
        const widget = template.content.firstChild;

        const deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        });
        state = state.add(tr.doc, [deco]);
      } else if (action.progress) {
        const ds = state.find(
          null,
          null,
          (spec) => spec.id === action.progress.id
        );
        const dec = ds[0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const el = dec.type.toDOM.querySelector(
          '.gwe-uploader__img-progress-inner'
        );
        el.style.width = action.progress.progress + '%';
      } else if (action.remove) {
        state = state.remove(
          state.find(null, null, (spec) => spec.id === action.remove.id)
        );
      }
      return state;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});
