import { playbackContext } from "@/context/playbackContext";
import { consumeProp } from "@/decorators/sync";
import type AudioSource from "@/lib/AudioSource";
import { css, html, LitElement } from "lit";

import { queryAsync, state } from "lit/decorators.js";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("nav-track-list")
export default class TrackList extends LitElement {
    @consumeProp({ context: playbackContext, subscribe: true })
    master!: AudioSource;

    @queryAsync("icon-button")
    private buttonElement!: Promise<HTMLElement>;

    @state()
    private isOpen: boolean = false;

    static styles = [
        css`
            .track-list-container {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background-color: var(--card-color);
            }

            .track-list-portal {
                position: absolute;
            }
        `,
    ];

    private portalStyles = css`
        .track-list-container {
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-card);

            padding: 10px;
            height: 100%;
            width: 100%;
        }
    `;

    private handleClick() {
        this.isOpen = !this.isOpen;
    }

    override render() {
        return html`
            <menu-list
                .visible=${this.isOpen}
                anchor="bottom-left"
                .targetElement=${this.buttonElement}
                width=${200}
                height=${200}
                .content=${html`<p>123</p>`}
                @close=${() => {
                    this.isOpen = false;
                }}
            >
            </menu-list>
            <div class="track-list">
                <icon-button
                    .isActive="${this.isOpen}"
                    size=${40}
                    @handle-click="${this.handleClick}"
                >
                    <panels-icon size=${20}></panels-icon>
                </icon-button>
            </div>
        `;
    }
}
