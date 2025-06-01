import PanelScreenManager, {
    PanelType,
    VSTIPanel,
} from "@/lib/PanelScreenManager";
import "./Pads";
import type Pads from "./Pads";
import { SoundChannel, VSTInstrument } from "@/modules/vst/VST";
import type MasterAudio from "@/lib/audio/MasterAudio";
import { html } from "lit";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";

const elementName = "sampler-pads";

export default class SamplerPanel extends VSTIPanel {
    private keyboardManager: LayeredKeyboardManager =
        new LayeredKeyboardManager();

    constructor(ctx: MasterAudio, screenManagerInstance: PanelScreenManager) {
        const id = elementName;
        const pads = document.createElement(id) as Pads;
        const channels = new Array(64)
            .fill(null)
            .map<SoundChannel>((_, index) => ({
                id: `pad-${index + 1}`,
                name: `Pad ${index + 1}`,
                ctx,
                volume: 1.0,
                pan: 0.0,
                mute: false,
                solo: false,
                isActive: true,
            }));

        super(
            new VSTInstrument(id, id, channels),
            screenManagerInstance,
            id,
            pads,
            PanelType.VSTI,
        );

        this.screenManagerInstance = screenManagerInstance;
    }

    override render() {
        return html`
            <panel-card
                card-height="auto"
                card-width="500px"
                card-id=${elementName}
                .startPos=${[10, 80] as const}
                .isDraggable=${true}
                .keyboardManager=${this.keyboardManager}
                .screenManagerInstance=${this.screenManagerInstance}
            >
                <sampler-pads
                    .keyManager=${this.keyboardManager}
                    .screenManagerInstance=${this.screenManagerInstance}
                ></sampler-pads>
            </panel-card>
        `;
    }
}
