import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { litStyles } from "@/styles";
import { msToSeconds } from "@/utils/TimeUtils";
import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("time-indicator")
export default class TimeIndicator extends WithPlaybackContext(LitElement) {
    static styles = [
        litStyles,
        css`
            .time-indicator {
                width: 130px;
                height: 40px;
            }
        `,
    ];

    protected shouldUpdate(_changedProperties: PropertyValues): boolean {
        super.shouldUpdate(_changedProperties);

        return true;
    }

    formatedDisplayTime(): string {
        const ms = this.playbackContext.currentTime;
        const sec = msToSeconds(ms);

        return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}:${String(
            Math.floor((ms % 1000) / 100),
        )}`;
    }

    render() {
        return html`
            <div
                class="time-indicator flex flex-center radius-normal bg-secondary"
            >
                <text-element variant="mono" color="success" size="md"
                    >${this.formatedDisplayTime()}</text-element
                >
            </div>
        `;
    }
}
