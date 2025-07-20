import type DragPanelRoot from "@/lib/DragPanelRoot";
import type PanelScreenManager from "@/lib/PanelScreenManager";
import type {
    Panel,
    PanelCreateOptions,
    PanelElement,
} from "@/lib/PanelScreenManager";

class PanelScreenManagerStub implements PanelScreenManager {
    panels: Panel[];
    container: HTMLElement | null;
    current: Panel | undefined;
    dragPanelRoot: DragPanelRoot;

    dispatchFocusEvent(panel?: Panel): void {
        throw new Error("Method not implemented.");
    }

    registerPanelElement(element: PanelElement): void {
        throw new Error("Method not implemented.");
    }

    public onPanelFocused(callback: (panel?: Panel) => void): void {
        throw new Error("Method not implemented.");
    }
    getPanel(name: string): Panel | undefined {
        throw new Error("Method not implemented.");
    }
    onPanelAdded(callback: (panel: Panel) => void): void {
        throw new Error("Method not implemented.");
    }
    public quetlyUnfocus(): void {
        throw new Error("Method not implemented.");
    }
    public focusNext(): Panel | undefined {
        throw new Error("Method not implemented.");
    }
    public focusPrevious(): Panel | undefined {
        throw new Error("Method not implemented.");
    }
    public focus(name: string): Panel | undefined {
        throw new Error("Method not implemented.");
    }
    public createAndAppend(_: PanelCreateOptions): Panel {
        throw new Error("Method not implemented.");
    }
    addEventListener(): void {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }
    removeEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): void {
        throw new Error("Method not implemented.");
    }
    screenManager: any;
}

describe("PanelCard", () => {
    it("should render without crashing", () => {
        const panelCard = document.createElement("panel-card") as PanelElement;
        panelCard.screenManager = new PanelScreenManagerStub();

        document.body.appendChild(panelCard);
        expect(panelCard.screenManager).toBeDefined();
    });
});
