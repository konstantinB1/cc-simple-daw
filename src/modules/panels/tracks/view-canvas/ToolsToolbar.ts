import { css, html, LitElement } from "lit";

export default class ToolsToolbar extends LitElement {
    static styles = [css``];

    override render() {
        return html` <div class="root">
            <div class="tools-toolbar">
                <icon-button size=${24}>
                    <select-icon></select-icon>
                </icon-button>
            </div>
        </div>`;
    }
}
