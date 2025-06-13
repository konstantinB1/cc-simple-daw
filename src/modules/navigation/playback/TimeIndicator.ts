import { typography } from "@/global-styles";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("time-indicator")
export default class TimeIndicator extends WithPlaybackContext(LitElement) {
    static styles = [
        typography,
        css`
            .time-indicator {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--color-text);
                border-radius: var(--border-radius);
                width: 170px;
                height: 50px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);

                & > p {
                    text-align: center;
                    letter-spacing: 0.25em;
                    width: 170px;
                    color: var(--color-success);
                }
            }
        `,
    ];

    formatedDisplayTime(): string {
        const ms = this.playbackContext.currentTime;

        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const mil = (ms % 1000).toFixed(0);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(mil).slice(0, 2).padStart(2, "0")}`;
    }

    render() {
        return html`
            <div class="time-indicator typography-400">
                <p>${this.formatedDisplayTime()}</p>
            </div>
        `;
    }
}
