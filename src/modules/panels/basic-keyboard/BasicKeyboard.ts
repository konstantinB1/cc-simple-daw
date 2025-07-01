import "./KeyboardView";
import { html, LitElement } from "lit";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { customElement, property } from "lit/decorators.js";

import type { Panel } from "@/lib/PanelScreenManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";

const elementName = "simple-keyboard";

@customElement(elementName)
export default class SamplerPanel extends LitElement {
    private keyboardManager: LayeredKeyboardManager =
        new LayeredKeyboardManager();

    @property({ type: Array })
    startPos: [number, number] = [0, 0];

    @property({ type: String })
    icon: string = "keyboard-icon";

    @property({ type: Object })
    panel!: Panel;

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    override render() {
        return html`
            <panel-card
                card-height="220px"
                card-width="1140px"
                .cardId=${elementName}
                .icon=${this.icon}
                .startPos=${this.startPos}
                .isDraggable=${true}
                padded
                .keyboardManager=${this.keyboardManager}
            >
                <keyboard-view
                    .panel=${this.panel}
                    .screenManager=${this.screenManager}
                ></keyboard-view>
            </panel-card>
        `;
    }
}
