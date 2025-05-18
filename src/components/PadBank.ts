import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { KeyManager } from "../lib/KeyManager";
import type BankManager from "../lib/BankManager";

export enum PadBankSelector {
    A,
    B,
    C,
    D,
}

@customElement("pads-bank")
export default class PadBank extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    private bankManager: BankManager;

    @property({ type: Number })
    private current: PadBankSelector = PadBankSelector.A;

    private isCurrentBank(bank: PadBankSelector): boolean {
        return this.current === bank;
    }

    constructor(mgr: BankManager) {
        super();
        this.bankManager = mgr;
    }

    static styles = [
        css`
            .container {
                margin-bottom: 30px;
            }

            .pad-container {
                display: flex;
                justify-content: space-between;
            }

            .pad-bank {
                display: flex;
                gap: 20px;
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();
        this.keyManager.addKeys([
            {
                key: "ArrowLeft",
                id: "pad-bank-left",
                handler: () => {
                    this.current = this.bankManager.previous(this.current);
                },
            },
            {
                key: "ArrowRight",
                id: "pad-bank-right",
                handler: () => {
                    this.current = this.bankManager.next(this.current);
                },
            },
        ]);
    }

    private onChangeBank(bank: PadBankSelector): void {
        this.dispatchEvent(
            new CustomEvent("pad-bank-changed", {
                detail: { bank },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private renderBankButton(bank: PadBankSelector): TemplateResult {
        return html`
            <mpc-button
                label="${PadBankSelector[bank]}"
                .active=${this.isCurrentBank(bank)}
                @click=${() => this.onChangeBank(bank)}
            >
                ${PadBankSelector[bank]}
            </mpc-button>
        `;
    }

    private get renderPadButtons(): TemplateResult {
        return html`
            <div class="pad-bank">
                ${this.renderBankButton(PadBankSelector.A)}
                ${this.renderBankButton(PadBankSelector.B)}
                ${this.renderBankButton(PadBankSelector.C)}
                ${this.renderBankButton(PadBankSelector.D)}
            </div>
        `;
    }

    render(): TemplateResult {
        return html`<div class="container">
            <card-component>
                <div class="pad-container">
                    <div></div>
                    ${this.renderPadButtons}
                </div>
            </card-component>
        </div>`;
    }
}
