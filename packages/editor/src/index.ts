import { renderApp } from "./renderApp";

const createEditor = ({
  el,
  content,
}: {
  el: HTMLElement;
  content?: string;
}) => {
  renderApp({ el, content });
};

export default createEditor;
