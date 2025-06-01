import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export default class Track extends LitElement {
    static styles = [];

    @property({ type: String })
    name: string = "";

    @property({ type: Number })
    index: number = 1;

    render() {
        return this.isCurrent
            ? `<div style="background-color: ${this.color};">${this.name}</div>`
            : `<div>${this.name}</div>`;
    }
}
