import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property, state } from "lit/decorators.js";
import { padKeys } from "../constants";
import { KeyManager, KeyMapping, type Key } from "../lib/KeyManager";

import "./PadBank";
import type { AudioFile, Program } from "../lib/ProgramManager";
import { PadBankSelector } from "./PadBank";
import type Sampler from "../lib/audio/Sampler";
import BankManager from "../lib/BankManager";

export class MappedPadKey {
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

    @property({ type: Number })
    private currentBank: PadBankSelector = PadBankSelector.A;

    @property({ type: Object })
    private bankMgr: BankManager | null = null;

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

        if (changed.find((p) => p === "currentBank")) {
            this.mappedKeyPads = this.bankMgr?.getData(
                this.currentBank,
            ) as MappedPadKey[];
        }

        if (changed.find((p) => p === "programData")) {
            this.unsub?.();

            if (!this.programData || this.padMappings.length === 0) {
                return;
            }

            if (!this.bankMgr) {
                throw new Error("BankManager is not defined");
            }

            this.bankMgr.create(
                this.padMappings,
                this.programData.data,
                (padKey) => {
                    this.sampler?.add(padKey.data.name, padKey.data.data);
                },
            );

            this.mappedKeyPads = this.bankMgr.getData(this.currentBank);

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
                        this.sampler?.play(
                            this.mappedKeyPads[getMappingKey].data.name,
                        );
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
