import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("card-sub-header")
export default class CardSubHeader extends LitElement {
    static styles = [
        css`
            .card-sub-header {
                position: relative;
                box-sizing: content-box;
            }

            .menu-items-wrapper {
                padding: 10px 4px;
            }

            .top-bar {
                box-sizing: border-box;
                width: 100%;
                background-color: rgba(55, 55, 55, 1);
                display: flex;
                align-items: center;
                overflow: hidden;
                transition: height 0.3s ease-in-out;

                .menu-items {
                    width: inherit;
                    display: flex;
                    justify-content: space-between;
                }
            }

            .icon-button {
                transition: all 0.3s ease-in-out;
                position: absolute;
                right: 5px;
                top: 5px;
                z-index: 100;
            }
        `,
    ];

    render() {
        const classes = classMap({
            "top-bar": true,
        });

        return html`
            <div class="card-sub-header">
                <div class=${classes}>
                    <div class="menu-items">
                        <div class="menu-items-wrapper">
                            <slot name="menu-items"></slot>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
