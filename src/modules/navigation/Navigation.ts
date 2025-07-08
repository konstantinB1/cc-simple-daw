import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./playback/Playback";
import "./TrackList";
import "./PanelIndicator";
import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";

import { helperStyles } from "@/styles";
import {
    NestedMenuItemType,
    type NestedMenuItem,
} from "@/components/NestedMenu";
import { configContext, ConfigContextStore } from "@/context/configContext";
import { consume } from "@lit/context";

@customElement("top-nav")
export default class Navigation extends LitElement {
    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    @consume({ context: configContext, subscribe: true })
    configStore!: ConfigContextStore;

    @property({ type: Array })
    menuItems: NestedMenuItem[] = [];

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

    firstUpdated(): void {
        this.menuItems = [
            {
                label: "Persist playback data",
                description: "Saves current playback state into local storage",
                type: NestedMenuItemType.Bool,
                onClick: () => {
                    const value = this.configStore.persistPlaybackData.get();
                    this.configStore.setPersistPlaybackData(!value);
                    this.menuItems[0].checked = !value;
                },
                checked: this.configStore.persistPlaybackData.get(),
            },
        ];
    }

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
                        <nested-menu
                            .items=${this.menuItems}
                            menu-title="Menu"
                        ></nested-menu>
                    </div>
                </div>
            </header>
        `;
    }
}
