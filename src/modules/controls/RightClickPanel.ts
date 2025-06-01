import type { BaseControlInterface } from "./BaseControls";
import RightClickPanelView from "./RightClickPanelView";

export default class RightClickPanelControl implements BaseControlInterface {
    name: string = "right-click-panel";
    host: RightClickPanelView;

    constructor() {
        this.host = document.createElement(
            "c-right-click-panel",
        ) as RightClickPanelView;
    }

    register(): void {
        this.host.addEventListener(
            "contextmenu",
            this.handleContextMenu.bind(this),
        );
    }

    unregister(): void {
        this.host.removeEventListener(
            "contextmenu",
            this.handleContextMenu.bind(this),
        );
    }

    private handleContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }
}
