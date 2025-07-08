import { store } from "@/store/AppStore";
import { storeSubscriber } from "@/store/StoreLit";
import { litStyles } from "@/styles";
import { msToSeconds } from "@/utils/TimeUtils";

import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("time-indicator")
export default class TimeIndicator extends LitElement {
    static styles = [
        litStyles,
        css`
            .time-indicator {
                width: 200px;
                height: 40px;
            }
        `,
    ];

    @storeSubscriber(store, (state) => ({
        currentTime: state.playback.currentTime,
    }))
    private store = {
        currentTime: 0,
    };

    formatedDisplayTime(): string {
        const ms = this.store.currentTime;
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
