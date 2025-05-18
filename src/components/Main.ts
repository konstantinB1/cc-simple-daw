import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Program } from "../lib/ProgramManager";
import Sampler from "../lib/audio/Sampler";

@customElement("main-init")
export default class Root extends LitElement {
    private ctx: AudioContext = new AudioContext();

    private sampler: Sampler | null = null;

    @property({ type: Object })
    private currentProgram: Program | null = null;

    constructor() {
        super();

        this.sampler = new Sampler(this.ctx);
    }

    static styles = [
        css`
            .container {
                width: var(--container-width);
                margin: 20vh auto;
            }
        `,
    ];

    private setProgramFromEvent(e: CustomEvent) {
        const program = e.detail.program;

        if (program) {
            this.currentProgram = program;
        } else {
            throw new Error("No program found in event");
        }
    }

    render() {
        return html`
            <program-container
                @program-loaded=${this.setProgramFromEvent}
            ></program-container>
            <pads-bank></pads-bank>
            <card-component>
                <pads-container
                    .programData=${this.currentProgram as any /* WTF? */}
                    .sampler=${this.sampler}
                ></pads-container>
            </card-component>
        `;
    }
}
