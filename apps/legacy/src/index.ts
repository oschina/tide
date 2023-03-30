import { EditorRenderProps, renderOnEl } from './component';
import './component/index.less';

export * from './component';
export * from './utils';

export const createEditor = ({
  el,
  options,
}: {
  el: HTMLElement;
  options?: EditorRenderProps;
}) => {
  renderOnEl({ el, options });
};
