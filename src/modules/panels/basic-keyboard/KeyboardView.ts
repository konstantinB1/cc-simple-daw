import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import SimpleOscillator from "./SimpleOscilator";
import { playbackContext } from "@/context/playbackContext";
import type AudioSource from "@/lib/AudioSource";
import {
    KeyMappingWithPressed,
    SimpleKeyboardKanager,
} from "@/lib/KeyboardManager";
import type { Panel } from "@/lib/PanelScreenManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";
import { storeSubscriber } from "@/store/StoreLit";
import { store } from "@/store/AppStore";

const notesMap = [
    {
        note: "C",
        key: "q",
    },
    {
        note: "C#",
        key: "w",
    },
    {
        note: "D",
        key: "e",
    },
    {
        note: "D#",
        key: "r",
    },
    {
        note: "E",
        key: "t",
    },
    {
        note: "F",
        key: "y",
    },
    {
        note: "F#",
        key: "u",
    },
    {
        note: "G",
        key: "i",
    },
    {
        note: "G#",
        key: "o",
    },
    {
        note: "A",
        key: "p",
    },
    {
        note: "A#",
        key: "a",
    },
    {
        note: "B",
        key: "s",
    },
].map(
    ({ note, key }, index) =>
        new KeyMappingWithPressed(
            [key],
            index,
            undefined,
            true,
            note,
            note,
            false,
        ),
);

@customElement("keyboard-view")
export default class KeyboardView extends LitElement {
    @property({ type: Object })
    panel!: Panel;

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    private osc!: SimpleOscillator;

    private keyboardController: SimpleKeyboardKanager =
        new SimpleKeyboardKanager();

    private keyData = notesMap;

    static styles = [
        css`
            :host {
                display: block;
                height: 170px;
                width: 100%;
                overflow: hidden;

                --note-width: 30px;
                --black-note-width: 25px;
                --black-note-offset: -25px;
            }

            .root {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            }

            .note.note-white {
                width: var(--note-width);
                background-color: white;
                border: 1px solid black;
                left: -20px;

                margin-left: var(--black-note-offset);
            }

            .note-white:not(.E) {
                margin-left: var(--black-note-offset);
            }

            .note-white.E {
                margin-right: var(--black-note-width);
            }

            .note-black {
                width: var(--black-note-width);
                height: 70px;
                left: -15px;
                background-color: black;
                position: relative;
                z-index: 1;
            }

            .note {
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 0;
            }

            .notes-container {
                height: 100px;
                width: 100%;
                display: flex;
                position: relative;
                margin-left: var(--black-note-width);
            }

            .note-pressed {
                outline: 2px solid var(--color-primary);
                outline-offset: -2px;
            }

            .note:active {
                outline: 2px solid var(--color-primary);
                outline-offset: -2px;
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();

        this.osc = new SimpleOscillator(store.ctx, store.master);

        this.keyboardController.addKeys(this.keyData);

        this.screenManager.onPanelFocused((p) =>
            p?.name === this.panel.name
                ? this.keyboardController.attachEventListeners()
                : this.keyboardController.detachEventListeners(),
        );

        this.keyboardController.onMappingHit(({ detail }) => {
            const getKey = this.keyData.find(
                (key) => key.name === detail.mapping.name,
            );

            if (!getKey) {
                throw new Error(
                    `Key mapping not found for ${detail.mapping.name}`,
                );
            }

            this.keyData = this.keyData.map((key) => {
                if (key.name === getKey.name) {
                    if (detail.pressed) {
                        this.osc.playNoteAtOctave(key.name!, 4);
                    } else {
                        this.osc.stopNote(key.name!, 4);
                    }

                    return { ...key, pressed: detail.pressed };
                }

                return key;
            });
        });
    }

    private handleNoteClick(note: string) {
        this.osc.playNoteAtOctave(note, 4);
    }

    private get renderNotes() {
        return this.keyData.map(({ name, pressed }) => {
            name = name!;
            const isBlack = name.endsWith("#");

            const classes = classMap({
                "note-white": !isBlack,
                "note-black": isBlack,
                note: true,
                [name]: true,
                "note-pressed": pressed,
            });

            return html`
                <button
                    class="${classes}"
                    @click=${this.handleNoteClick.bind(this, name)}
                ></button>
            `;
        });
    }

    protected render(): unknown {
        return html`<div class="root">
            <div class="notes-container">${this.renderNotes}</div>
        </div>`;
    }
}
