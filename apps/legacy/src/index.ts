import { renderOnEl } from './component';

export const createEditor = ({
  el,
  content,
}: {
  el: HTMLElement;
  content?: string;
}) => {
  renderOnEl({ el, content });
};
