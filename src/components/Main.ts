import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Program } from "../lib/ProgramManager";
import Sampler from "../lib/audio/Sampler";
import { PadBankSelector } from "./PadBank";
import BankManager from "../lib/BankManager";

@customElement("main-init")
export default class Root extends LitElement {
    private ctx: AudioContext = new AudioContext();

    private sampler: Sampler;

    @property({ type: Object })
    private currentProgram: Program | null = null;

    @property({ type: Number })
    private padBank: PadBankSelector = PadBankSelector.A;

    private bankManager: BankManager = new BankManager();

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

    private setPadBankFromEvent(
        e: CustomEvent<{
            bank: PadBankSelector;
        }>,
    ) {
        this.padBank = e.detail.bank;
    }

    render() {
        return html`
            <program-container
                @program-loaded=${this.setProgramFromEvent}
            ></program-container>
            <pads-bank
                @pad-bank-changed=${this.setPadBankFromEvent}
                .current=${this.padBank}
            ></pads-bank>
            <card-component>
                <pads-container
                    .bankMgr=${this.bankManager}
                    .currentBank=${this.padBank}
                    .programData=${this.currentProgram as any /* WTF? */}
                    .sampler=${this.sampler}
                ></pads-container>
            </card-component>
        `;
    }
}
