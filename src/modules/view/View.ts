import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("app-view")
export default class AppView extends LitElement {
    static styles = css`
        .container {
            position: relative;
            width: 100%;
            height: 100%;
        }
    `;

    render() {
        return html` <top-nav></top-nav>
            <div class="container">
                <sampler-pads></sampler-pads>
                <tracks-component></tracks-component>
            </div>`;
    }
}
