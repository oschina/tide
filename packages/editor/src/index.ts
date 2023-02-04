import { renderApp } from './renderApp';

export const createEditor = ({
  el,
  content,
}: {
  el: HTMLElement;
  content?: string;
}) => {
  renderApp({ el, content });
};
