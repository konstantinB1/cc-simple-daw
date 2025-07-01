import "./Pads";
import { html, LitElement } from "lit";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { customElement, property } from "lit/decorators.js";
import WithScreenManager from "@/mixins/WithScreenManager";

const elementName = "sampler-root";

@customElement(elementName)
export default class SamplerPanel extends WithScreenManager(
    WithPlaybackContext(LitElement),
) {
    private keyboardManager: LayeredKeyboardManager =
        new LayeredKeyboardManager();

    @property({ type: Array })
    startPos: [number, number] = [0, 0];

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
                        .keyManager=${this.keyboardManager}
                    ></sampler-view>
                </panel-card>
            </div>
        `;
    }
}
