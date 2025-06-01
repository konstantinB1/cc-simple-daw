import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PadBankSelector } from "./Pads";

@customElement("pads-bank")
export default class PadBank extends LitElement {
    @property({ type: Number })
    private current: PadBankSelector = PadBankSelector.A;

    private isCurrentBank(bank: PadBankSelector): boolean {
        return this.current === bank;
    }

    static styles = [
        css`
            .pad-container {
                display: flex;
                justify-content: space-between;
            }

            .pad-bank {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }
        `,
    ];

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
            <div class="pad-container">
                <div></div>
                ${this.renderPadButtons}
            </div>
        </div>`;
    }
}
