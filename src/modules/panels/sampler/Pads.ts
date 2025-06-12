import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property, state } from "lit/decorators.js";

import type { AudioFile, Program } from "@lib/ProgramManager";

import type { PadClickData } from "./Pad";
import type { ProgramLoadedData } from "./Load";

import "./PadBank";
import "./Load";
import "./Pad";

import {
    KeyMappingWithPressed,
    SimpleKeyboardKanager,
} from "@/lib/KeyboardManager";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import WithScreenManager from "@/mixins/WithScreenManager";
import AudioSource from "@/lib/AudioSource";

const noop = () => {};

export const padMappings: string[] = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
];

export class MappedPadKeyWithPressed extends KeyMappingWithPressed {
    data: AudioFile;
    bank: PadBankSelector;
    index: number;

    sample: AudioSource;

    constructor(
        ctx: AudioContext,
        mapping: KeyMappingWithPressed,
        data: AudioFile,
        bank: PadBankSelector,
        index: number,
        master: AudioSource,
    ) {
        super(
            mapping.keys,
            mapping.index,
            mapping.handler,
            mapping.active,
            mapping.description,
            mapping.name,
            false,
        );

        this.data = data;
        this.bank = bank;
        this.index = index;

        this.sample = new AudioSource(
            `pad-${mapping.name}-${bank}-${index}`,
            ctx,
            mapping.name,
            master,
        );

        this.sample.load(data.data).catch((err) => {
            console.error(
                `Failed to load sample for pad ${mapping.name} in bank ${bank}:`,
                err,
            );
        });
    }
}

export const PADS_PER_BANK = padMappings.length;

export enum PadBankSelector {
    A,
    B,
    C,
    D,
}

const getBank = (index: number) => {
    let nextBank: PadBankSelector = PadBankSelector.A;

    if (index >= PADS_PER_BANK && index < PADS_PER_BANK * 2) {
        nextBank = PadBankSelector.B;
    } else if (index >= PADS_PER_BANK * 2 && index < PADS_PER_BANK * 3) {
        nextBank = PadBankSelector.C;
    } else if (index >= PADS_PER_BANK * 3) {
        nextBank = PadBankSelector.D;
    }

    return nextBank;
};

const element = "sampler-view";

@customElement(element)
export default class Pads extends WithPlaybackContext(
    WithScreenManager(LitElement),
) {
    private samplerKeyMgr: SimpleKeyboardKanager = new SimpleKeyboardKanager();

    // Do not use this for rendering view, this is only used
    // to store all pads across all banks for reference
    // to be used by the key manager and for mapping pads
    // to the current bank view
    @state()
    private mappedKeyPads: MappedPadKeyWithPressed[] = [];

    // Use exclusively for rendering the current bank view
    @state()
    currentView: MappedPadKeyWithPressed[] = [];

    @property({ type: Object })
    public programData: Program | null = null;

    @property({ type: Number })
    private currentBank: PadBankSelector = PadBankSelector.A;

    @property({ type: Boolean })
    isFocused: boolean = false;

    private samplerMaster!: AudioSource;

    static styles: CSSResultGroup = css`
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;

            .program-container {
                flex: 3;
            }

            .pad-bank-selector {
                flex: 2;
            }
        }

        .pads {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            grid-gap: 6px;
            align-items: center;
            justify-items: center;
            justify-content: center;
            align-content: center;
            height: 100%;
            padding: 20px 0;
            min-height: 450px;
        }
    `;

    connectedCallback(): void {
        super.connectedCallback();

        this.samplerMaster = new AudioSource(
            "sampler-master",
            this.playbackContext.audioContext,
            "Sampler Master",
            this.playbackContext.master,
            true,
        );

        this.playbackContext.master.addSubChannel(this.samplerMaster);

        this.screenManager.onPanelFocused((p) => {
            if (p?.name === this.nodeName.toLowerCase()) {
                this.samplerKeyMgr.attachEventListeners();
            } else {
                this.samplerKeyMgr.detachEventListeners();
            }
        });

        this.samplerKeyMgr?.onMappingHit(({ detail: { mapping, pressed } }) => {
            this.currentView = this.currentView.map((pad) => {
                if (pad.name === mapping.name) {
                    if (pressed) {
                        // Only trigger sample playback on keydown
                        pad.sample.play().catch((err) => {
                            console.error(
                                `Failed to play sample for pad ${pad.name}:`,
                                err,
                            );
                        });
                    } else if (!pressed && pad.pressed) {
                        pad.sample.stop();
                    }

                    return {
                        ...pad,
                        pressed,
                    };
                }

                return pad;
            });
        });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        this.samplerKeyMgr.detachEventListeners();
    }

    private getBankAndRealIndex(index: number): {
        bank: PadBankSelector;
        realIndex: number;
    } {
        const bank = getBank(index);
        const realIndex = index % PADS_PER_BANK;
        return { bank, realIndex };
    }

    private createMappings() {
        this.mappedKeyPads = (this.programData?.data ?? []).map(
            (data, index) => {
                const { realIndex, bank } = this.getBankAndRealIndex(index);
                const key = [padMappings[realIndex]];
                const mapping = new KeyMappingWithPressed(
                    key,
                    realIndex,
                    noop, // Let the key manager handle the click
                    true,
                    padMappings[realIndex],
                    data.name,
                );

                const ctx = this.playbackContext.audioContext;

                return new MappedPadKeyWithPressed(
                    ctx,
                    mapping,
                    data,
                    bank,
                    index,
                    this.samplerMaster,
                );
            },
        );

        this.currentView = this.mappedKeyPads.filter(
            (pad) => pad.bank === this.currentBank,
        );

        this.samplerKeyMgr.addKeys(this.currentBankPads);
    }

    private get currentBankPads(): MappedPadKeyWithPressed[] {
        return this.mappedKeyPads.filter(
            (pad) => pad.bank === this.currentBank,
        );
    }

    update(changedProperties: Map<PropertyKey, unknown>): void {
        super.update(changedProperties);
        const changed = Array.from(changedProperties.keys());

        if (changed.includes("programData")) {
            this.createMappedKeysFromProgram();
        }
    }

    private createMappedKeysFromProgram() {
        this.createMappings();

        this.mappedKeyPads.forEach(({ sample }) => {
            this.samplerMaster.addSubChannel(sample);
            this.consumer.$addChannel(sample);
        });
    }

    private setPadBankFromEvent(
        e: CustomEvent<{
            bank: PadBankSelector;
        }>,
    ) {
        const bank = e.detail.bank;

        this.samplerKeyMgr.removeKeys(this.currentBankPads);
        this.currentBank = bank;

        const next = this.mappedKeyPads
            .filter((pad) => pad.bank === this.currentBank)
            .map((pad) => ({
                ...pad,
                pressed: false, // Reset pressed state when changing bank
            }));

        this.samplerKeyMgr.addKeys(next);
        this.currentView = next;
    }

    private setProgramFromEvent(e: CustomEvent<ProgramLoadedData>) {
        const program = e.detail.program;

        if (!program) {
            throw new Error("No program data provided");
        }

        this.programData = program;
    }

    private handleClick(_: CustomEvent<PadClickData>) {}

    render() {
        return html`
            <div class="top-bar">
                <div class="program-container">
                    <program-container
                        @program-loaded=${this.setProgramFromEvent}
                    ></program-container>
                </div>
                <div class="pad-bank-selector">
                    <pads-bank
                        @pad-bank-changed=${this.setPadBankFromEvent}
                        .current=${this.currentBank}
                    ></pads-bank>
                </div>
            </div>
            <div class="pads">
                ${this.currentView.map(
                    (mappedPad) => html`
                        <daw-pad
                            @pad-click=${this.handleClick}
                            .mappedPad=${mappedPad}
                        ></daw-pad>
                    `,
                )}
            </div>
        `;
    }
}
