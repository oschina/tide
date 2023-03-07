import { renderApp } from './component/render';

export const createEditor = ({
  el,
  content,
}: {
  el: HTMLElement;
  content?: string;
}) => {
  renderApp({ el, content });
};
