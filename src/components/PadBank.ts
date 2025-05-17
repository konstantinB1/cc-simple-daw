import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

enum PadBankSelector {
    A,
    B,
    C,
    D,
}

@customElement("pads-bank")
export default class PadBank extends LitElement {
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

    @property({ type: Number })
    private currentBank: PadBankSelector = PadBankSelector.A;

    private isCurrentBank(bank: PadBankSelector): boolean {
        return this.currentBank === bank;
    }

    private renderBankButton(bank: PadBankSelector): TemplateResult {
        return html`
            <mpc-button
                label="${PadBankSelector[bank]}"
                .active=${this.isCurrentBank(bank)}
                @click=${() => {
                    console.log(`Selected bank: ${PadBankSelector[bank]}`);
                    this.currentBank = bank;
                }}
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
