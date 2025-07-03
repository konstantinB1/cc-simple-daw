import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./playback/Playback";
import "./TrackList";
import "./PanelIndicator";
import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";

import { helperStyles } from "@/styles";

@customElement("top-nav")
export default class Navigation extends LitElement {
    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    static styles = [
        helperStyles,
        css`
            header {
                height: 60px;
            }

            .panel-indicator {
                width: 180px;
            }
        `,
    ];

    render(): TemplateResult {
        return html`
            <header
                class="fixed full-width top left flex bg-card elevated-navbar"
            >
                <div class="x-margin full-width">
                    <div class="flex flex-start gap-5 full-height">
                        <div class="flex flex-space-between gap-4 full-height">
                            <div>
                                <panel-indicator
                                    .screenManager=${this.screenManager}
                                ></panel-indicator>
                            </div>
                            <playback-element
                                .keyboardManager=${this.keyboardManager}
                            ></playback-element>
                        </div>
                        <div class="time-indicator-wrapper">
                            <time-indicator></time-indicator>
                        </div>
                    </div>
                    <!-- <nav>
                        <nav-track-list></nav-track-list>
                    </nav> -->
                </div>
            </header>
        `;
    }
}
