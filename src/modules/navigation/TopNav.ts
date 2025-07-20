import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";

import { helperStyles } from "@/styles";
import NestedMenu, {
    NestedMenuItemType,
    type NestedMenuItem,
} from "@/components/NestedMenu";
import { storeSubscriber } from "@/store/StoreLit";
import { store } from "@/store/AppStore";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import PlaybackElement from "./playback/Playback";
import PanelIndicator from "./PanelIndicator";
import TimeIndicator from "./playback/TimeIndicator";

@customElement("top-nav")
export default class TopNav extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "playback-element": PlaybackElement,
        "panel-indicator": PanelIndicator,
        "nested-menu": NestedMenu,
        "time-indicator": TimeIndicator,
    };

    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    @property({ type: Array })
    menuItems: NestedMenuItem[] = [];

    @storeSubscriber(store, (state) => ({
        persistPlaybackData: state.config.persistPlaybackData,
    }))
    configStore!: {
        persistPlaybackData: boolean;
    };

    static styles = [
        helperStyles,
        css`
            header {
                height: var(--navbar-height);
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
                    const value = this.configStore.persistPlaybackData;
                    this.menuItems[0].checked = !value;
                    store.setState((state) => {
                        state.config.persistPlaybackData = !value;
                    });
                },
                checked: this.configStore.persistPlaybackData,
            },
        ];
    }

    render(): TemplateResult {
        return html`
            <header
                class="relative full-width top left flex bg-card elevated-navbar"
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
