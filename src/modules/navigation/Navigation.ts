import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import "./recoder/Recorder";

@customElement("top-nav")
export default class Navigation extends LitElement {
    static styles = [
        css`
            header {
                background-color: var(--nav-bg-color);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 80px;
                box-shadow: 0 0px 4px rgba(0, 0, 0, 1);
                z-index: 1000;
                display: flex;
            }

            .container {
                display: flex;
                margin: 0 auto;
                width: 70%;
                align-items: center;
                align-items: center;
            }

            .nav {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                width: 100%;
            }

            .recorder-wrapper {
                flex: 3;
            }
        `,
    ];
    render(): TemplateResult {
        return html`
            <header>
                <div class="container">
                    <div class="recorder-wrapper">
                        <recorder-component></recorder-component>
                    </div>
                    <nav>
                        <icon-button size=${50} label-text="Tracks List">
                            <eq-icon size=${30}></eq-icon>
                        </icon-button>
                    </nav>
                </div>
            </header>
        `;
    }
}
