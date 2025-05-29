import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import "./recoder/Recorder";

@customElement("top-nav")
export default class Navigation extends LitElement {
    static styles = [
        css`
            header {
                background-color: var(--card-color);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 80px;
                box-shadow: 0 0px 4px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                display: flex;
            }

            .controls-and-time {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30px;
                height: 100%;
            }

            .container {
                display: flex;
                margin: 0 auto;
                width: 80%;
                align-items: center;
                justify-content: space-between;
            }

            .nav {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                width: 100%;
            }

            .recorder-wrapper {
            }
        `,
    ];

    render(): TemplateResult {
        return html`
            <header>
                <div class="container">
                    <div class="controls-and-time">
                        <div class="recorder-wrapper">
                            <recorder-component></recorder-component>
                        </div>
                        <div class="time-indicator-wrapper">
                            <time-indicator></time-indicator>
                        </div>
                    </div>
                    <nav>
                        <icon-button size=${40} label-text="Tracks List">
                            <eq-icon size=${20}></eq-icon>
                        </icon-button>
                    </nav>
                </div>
            </header>
        `;
    }
}
