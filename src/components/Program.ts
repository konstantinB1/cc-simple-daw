import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { typography } from "../global-styles";

@customElement("program-container")
export default class Program extends LitElement {
    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.getPrograms();
    }

    private async getPrograms() {
        const meta = import.meta.glob("../assets/kits/**/*.wav");
        console.log(meta);
    }

    static styles = [
        typography,
        css`
            .content-1 {
            }
        `,
    ];

    render() {
        return html`
            <section class="content-1">
                <h1 class="typography-100">
                    <daw-select />
                </h1>
            </section>
        `;
    }
}
