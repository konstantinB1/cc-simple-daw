import { css, html, LitElement, type CSSResultGroup } from "lit";

import { customElement, property } from "lit/decorators.js";
import { padKeys } from "../constants";
import { KeyManager, KeyMapping, type Key } from "../lib/KeyManager";

@customElement("pads-container")
export default class Pads extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    @property({ type: Array })
    keys: Key[] = padKeys;

    @property({ type: Array })
    padMappings: KeyMapping[] = [];

    constructor() {
        super();
        this.padMappings = padKeys.map((key) => new KeyMapping(key));

        this.keyManager.addKeys(padKeys);
        this.keyManager.subscribe(({ mapping }) => {
            const getMappingKey = this.padMappings.findIndex(
                (keyMapping) => keyMapping.key === mapping.key,
            );

            if (getMappingKey !== -1) {
                this.padMappings = this.padMappings.map((key, index) => {
                    if (index === getMappingKey) {
                        return {
                            ...key,
                            isPressed: mapping.isPressed,
                        };
                    }

                    return key;
                });
            } else {
                console.error(
                    `Key mapping ${mapping.key} not found in pad mappings`,
                    mapping,
                );
            }
        });
    }

    static styles: CSSResultGroup = css`
        .pads {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            grid-gap: 10px;
            align-items: center;
            justify-items: center;
            justify-content: center;
            align-content: center;
            height: 100%;
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
