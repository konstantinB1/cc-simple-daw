import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import "./icons/DragIcon";
import "./icons/RecordIcon";
import "./icons/PlayIcon";
import "./icons/StopIcon";
import "./icons/UpAndDownIcon";
import "./icons/MetronomeIcon";
import "./icons/EqIcon";
import "./icons/ForwardIcon";
import "./icons/RewindIcon";
import "./icons/ClockIcon";
import "./icons/ArrowDownIcon";
import "./icons/ArrowRightIcon";
import "./icons/ArrowLeftIcon";
import "./icons/IconFullscreen";
import "./icons/PanelsIcon";
import "./icons/KeyboardIcon";

export interface SVGIconInterface {
    name: string;
    color: string;
}

@customElement("icon-component")
export default class Icon extends LitElement {
    @property({ type: Number })
    size: number = 50;

    static styles = [
        css`
            .icon {
                display: block;
                position: relative;
            }
        `,
    ];

    render() {
        return html`
            <div
                class="icon"
                style=${styleMap({
                    width: this.size + "px",
                    height: this.size + "px",
                })}
            >
                <slot></slot>
            </div>
        `;
    }
}
