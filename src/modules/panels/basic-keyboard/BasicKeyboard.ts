import { VSTIPanel } from "@/lib/PanelScreenManager";
import "./KeyboardView";
import { html, LitElement } from "lit";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { customElement } from "lit/decorators.js";
import { VSTInstrument } from "@/modules/vst/VST";
import WithScreenManager from "@/mixins/WithScreenManager";

const elementName = "keyboard-view";

@customElement(elementName)
export default class SamplerPanel extends WithScreenManager(LitElement) {
    private keyboardManager: LayeredKeyboardManager =
        new LayeredKeyboardManager();

    connectedCallback(): void {
        super.connectedCallback();

        const vstInstrument = new VSTInstrument("Sampler", "sampler");

        this.screenManager.add(
            elementName,
            new VSTIPanel(
                this.screenManager,
                "sampler-view",
                this,
                true,
                true,
                vstInstrument,
            ),
        );
    }

    private onSamplePlay(_: CustomEvent): void {}

    override render() {
        return html`
            <div class="sampler-root">
                <panel-card
                    card-height="auto"
                    card-width="500px"
                    card-id="sampler-view"
                    .startPos=${[10, 80] as const}
                    .isDraggable=${true}
                    padded
                    .keyboardManager=${this.keyboardManager}
                >
                    <sampler-view
                        .keyManager=${this.keyboardManager}
                        @sample-play=${this.onSamplePlay.bind(this)}
                    ></sampler-view>
                </panel-card>
            </div>
        `;
    }
}
