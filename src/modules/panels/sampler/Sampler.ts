import "./Pads";
import { html, LitElement } from "lit";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { customElement, property } from "lit/decorators.js";
import type PanelScreenManager from "@/lib/PanelScreenManager";

const elementName = "sampler-root";

@customElement(elementName)
export default class SamplerPanel extends LitElement {
    private keyboardManager: LayeredKeyboardManager =
        new LayeredKeyboardManager();

    @property({ type: Array })
    startPos: [number, number] = [0, 0];

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    override render() {
        return html`
            <div class="sampler-root">
                <panel-card
                    card-height="auto"
                    card-width="500px"
                    .cardId=${elementName}
                    .startPos=${this.startPos}
                    .isDraggable=${true}
                    padded
                    .keyboardManager=${this.keyboardManager}
                >
                    <div slot="header"></div>
                    <sampler-view
                        .screenManager=${this.screenManager}
                        .keyManager=${this.keyboardManager}
                    ></sampler-view>
                </panel-card>
            </div>
        `;
    }
}
