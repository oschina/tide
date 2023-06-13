import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';
import { UploaderFunc } from '../types';
import { selectionCellInfo } from '@gitee/tide-common';

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

    let imgWidth = 350;

    // 表格内插入图片 宽度处理
    const { isInTableCel, tableCellWidth } = selectionCellInfo(view);
    if (isInTableCel) {
      imgWidth = tableCellWidth;
    }

    tr.setMeta(ImagePlaceholderPlugin, {
      add: {
        id,
        pos: pos + index,
        src: blobUrl,
        width: imgWidth,
      },
    });
    view.dispatch(tr);

    let src = '';
    try {
      src = await uploadFunc(image, (progress) => {
        view.dispatch(
          view.state.tr.setMeta(ImagePlaceholderPlugin, {
            progress: { id, progress },
          })
        );
      });
    } catch (e) {
      console.log(e);
    }

    //  上传成功
    if (src && typeof src === 'string') {
      const plpos = findPlaceholder(view.state, id);
      if (plpos == null) {
        return;
      }

      view.dispatch(
        view.state.tr
          .replaceWith(
            plpos,
            plpos,
            schema.nodes.image.create({ src, width: imgWidth })
          )
          .setMeta(ImagePlaceholderPlugin, { remove: { id } })
      );
    } else {
      // todo 完善上传失败处理
      setTimeout(() => {
        view.dispatch(
          view.state.tr.setMeta(ImagePlaceholderPlugin, { remove: { id } })
        );
      }, 1000);
    }

    // 释放 URL 对象
    URL.revokeObjectURL(blobUrl);
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
        template.innerHTML = `<div class='tide-uploader__img'>
          <div class='tide-uploader__img-placeholder' style='width: ${action.add.width}px;'>
            <img src='${action.add.src}' alt='upload placeholder' />
            <div class='tide-uploader__img-progress-wrap'> 
              <span class='tide-uploader__img-progress'>
                <span class='tide-uploader__img-progress-inner' style='width: 10%;'></span>
              </span>
              <span class='tide-uploader__img-progress-text'>0%</span>
            </div>
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
          '.tide-uploader__img-progress-inner'
        );
        el.style.width = action.progress.progress + '%';

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const text = dec.type.toDOM.querySelector(
          '.tide-uploader__img-progress-text'
        );
        text.innerHTML = action.progress.progress + '%';
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
