import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property, state } from "lit/decorators.js";
import { padKeys } from "../constants";
import { KeyManager, KeyMapping, type Key } from "../lib/KeyManager";
import type Program from "./Program";

import "./PadBank";

@customElement("pads-container")
export default class Pads extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    private unsub: (() => void) | null = null;

    @property({ type: Array })
    protected keys: Key[] = padKeys;

    @property({ type: Array })
    protected padMappings: KeyMapping[] = padKeys.map(
        (key) => new KeyMapping(key),
    );

    @property({ type: Object })
    public programData: Program | null = null;

    @state()
    private soundsAssigned: boolean = false;

    connectedCallback(): void {
        super.connectedCallback();

        this.keyManager.addKeys(padKeys);
        this.unsub = this.keyManager.subscribe(({ mapping }) => {
            const getMappingKey = this.padMappings.findIndex(
                (keyMapping) => keyMapping.key === mapping.key,
            );

            this.padMappings = this.padMappings.map((key, index) =>
                index === getMappingKey ? mapping : key,
            );
        });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.unsub) {
            this.unsub();
            this.unsub = null;
        }
    }

    update(changedProperties: Map<string | number | symbol, unknown>): void {
        super.update(changedProperties);

        if (!this.soundsAssigned) {
            for (const key of changedProperties.keys()) {
                if (key === "programData") {
                }
            }
        }
    }

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

    render() {
        return html`
            <div class="pads">
                ${this.padMappings.map(
                    (key) => html`
                        <daw-pad
                            id="${key.id}"
                            key-binding="${key.key}"
                            .isPressed="${key.isPressed}"
                            class="pad"
                        />
                    `,
                )}
            </div>
        `;
    }
}
