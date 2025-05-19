import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property, state } from "lit/decorators.js";
import { padKeys } from "../constants";
import { KeyManager, KeyMapping, type KeyData } from "../lib/KeyManager";

import "./PadBank";
import type { AudioFile, Program } from "../lib/ProgramManager";
import { PadBankSelector } from "./PadBank";
import type Sampler from "../lib/audio/Sampler";
import BankManager from "../lib/BankManager";
import type { PadClickData } from "./Pad";

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

const padMappings = padKeys.map(
    (key) =>
        new KeyMapping({
            key: key.key,
            id: key.id,
            oneShot: true,
        }),
);

@customElement("pads-container")
export default class Pads extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    private unsub: (() => void) | null = null;

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
            min-height: 450px;
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

    private playFromKeyboard({ mapping }: KeyData) {
        const getMappingKey = padMappings.findIndex(
            (keyMapping) => keyMapping.key === mapping.key,
        );

        if (getMappingKey === -1) {
            throw new Error(`Key mapping not found for ${mapping.key}`);
        }

        this.mappedKeyPads = this.mappedKeyPads.map((pad) => ({
            ...pad,
            mapping:
                pad.mapping.key === mapping.key
                    ? {
                          ...pad.mapping,
                          isPressed: mapping.isPressed,
                      }
                    : pad.mapping,
        }));

        if (mapping.isPressed) {
            this.sampler?.play(this.mappedKeyPads[getMappingKey].data.name);
        }
    }

    private playFromClick({ mapping }: PadClickData) {
        const getMappingKey = padMappings.findIndex(
            (keyMapping) => keyMapping.key === mapping.key,
        );

        if (getMappingKey === -1) {
            throw new Error(`Key mapping not found for ${mapping.key}`);
        }

        this.sampler?.play(this.mappedKeyPads[getMappingKey].data.name);
    }

    private assignPads() {
        if (!this.programData) {
            return;
        }

        if (!this.bankMgr) {
            throw new Error("BankManager is not defined");
        }

        this.unsub?.();

        this.bankMgr.create(padMappings, this.programData.data, ({ data }) => {
            this.sampler?.add(data.name, data.data);
        });

        this.mappedKeyPads = this.bankMgr.getData(this.currentBank);
        this.unsub = this.keyManager.subscribe(
            this.playFromKeyboard.bind(this),
        );
    }

    update(changedProperties: Map<PropertyKey, unknown>): void {
        super.update(changedProperties);
        const changed = Array.from(changedProperties.keys());

        if (changed.find((p) => p === "currentBank")) {
            this.mappedKeyPads = this.bankMgr?.getData(
                this.currentBank,
            ) as MappedPadKey[];
        } else if (changed.find((p) => p === "programData")) {
            this.assignPads();
        }
    }

    render() {
        return html`
            <div class="pads">
                ${this.mappedKeyPads.map(
                    ({ mapping, data }) => html`
                        <daw-pad
                            @pad-click=${({
                                detail,
                            }: CustomEvent<PadClickData>) => {
                                this.playFromClick({ mapping: detail.mapping });
                            }}
                            .mapping="${mapping}"
                            .name="${data.name}"
                            class="pad"
                        ></daw-pad>
                    `,
                )}
            </div>
        `;
    }
}
