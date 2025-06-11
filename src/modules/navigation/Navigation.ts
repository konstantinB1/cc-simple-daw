import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./playback/Playback";
import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";

@customElement("top-nav")
export default class Navigation extends LitElement {
    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

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
        `,
    ];

    render(): TemplateResult {
        return html`
            <header>
                <div class="container">
                    <div class="controls-and-time">
                        <div class="recorder-wrapper">
                            <playback-element
                                .keyboardManager=${this.keyboardManager}
                            ></playback-element>
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
