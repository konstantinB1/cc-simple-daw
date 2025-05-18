import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property, state } from "lit/decorators.js";
import { padKeys } from "../constants";
import { KeyManager, KeyMapping, type Key } from "../lib/KeyManager";

import "./PadBank";
import type { AudioFile, Program } from "../lib/ProgramManager";
import { PadBankSelector, PADS_PER_BANK } from "./PadBank";
import AudioManager from "../lib/audio/Context";
import type Sampler from "../lib/audio/Sampler";

class MappedPadKey {
    mapping: KeyMapping;
    data: AudioFile;
    bank: PadBankSelector;
    index: number;

    constructor(
        mapping: KeyMapping,
        data: AudioFile,
        bank: PadBankSelector,
        index: number,
    ) {
        this.mapping = mapping;
        this.data = data;
        this.bank = bank;
        this.index = index;
    }
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

@customElement("pads-container")
export default class Pads extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    private unsub: (() => void) | null = null;

    @property({ type: Array })
    protected keys: Key[] = padKeys;

    @property({ type: Array })
    private padMappings: KeyMapping[] = padKeys.map(
        (key) => new KeyMapping(key),
    );

    @property({ type: Object })
    private sampler: Sampler | null = null;

    @state()
    private mappedKeyPads: MappedPadKey[] = [];

    @property({ type: Object })
    public programData: Program | null = null;

    static styles: CSSResultGroup = css`
        .pads {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            grid-gap: 6px;
            align-items: center;
            justify-items: center;
            justify-content: center;
            align-content: center;
            height: 100%;
            padding: 20px 0;
        }
    `;

    connectedCallback(): void {
        super.connectedCallback();
        this.keyManager.addKeys(padKeys);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.unsub) {
            this.unsub();
            this.unsub = null;
        }
    }

    update(changedProperties: Map<PropertyKey, unknown>): void {
        super.update(changedProperties);
        const changed = Array.from(changedProperties.keys());

        if (changed.find((p) => p === "programData")) {
            this.unsub?.();

            this.mappedKeyPads = this.padMappings.map((key, index) => {
                const file = this.programData?.data[index];

                if (!file) {
                    throw new Error("No file found for pad key");
                }

                if (this.sampler) {
                    this.sampler.add(file.name, file.data);
                    console.info(
                        `Added ${file.name} to sampler with key ${key.key}`,
                    );
                } else {
                    throw new Error("No sampler found");
                }

                return new MappedPadKey(key, file, getBank(index), index);
            });

            this.unsub = this.keyManager.subscribe(({ mapping }) => {
                const getMappingKey = this.padMappings.findIndex(
                    (keyMapping) => keyMapping.key === mapping.key,
                );

                if (getMappingKey !== -1) {
                    this.mappedKeyPads = this.mappedKeyPads.map((pad) => ({
                        ...pad,
                        mapping:
                            pad.mapping.key === mapping.key
                                ? mapping
                                : pad.mapping,
                    }));

                    if (mapping.isPressed) {
                        const pad = this.mappedKeyPads[getMappingKey];
                        this.sampler?.play(pad.data.name);
                    }
                }
            });
        }
    }

    render() {
        return html`
            <div class="pads">
                ${this.mappedKeyPads.map(
                    ({ mapping, data }) => html`
                        <daw-pad
                            id="${mapping.id}"
                            key-binding="${mapping.key}"
                            .name="${data.name}"
                            .isPressed="${mapping.isPressed}"
                            class="pad"
                        ></daw-pad>
                    `,
                )}
            </div>
        `;
    }
}
