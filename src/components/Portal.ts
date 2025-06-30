import { html, LitElement, render } from "lit";

export default class Portal extends LitElement {}

render(html`<slot></slot>`, document.body);
