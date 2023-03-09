import { EditorRenderProps, renderOnEl } from './component';

export * from './component';

export const createEditor = ({
  el,
  options,
}: {
  el: HTMLElement;
  options?: EditorRenderProps;
}) => {
  renderOnEl({ el, options });
};
