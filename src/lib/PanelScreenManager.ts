import type { VSTInstrument } from "@/modules/vst/VST";

export enum PanelType {
    VSTI,
    Custom,
    Effect,
}

export interface FocusablePanel {
    dispatchFocusEvent: (cb: () => void) => void;
}

export type FocusPanelEvent = {
    panel?: Panel;
};

export type PanelArgs = [
    PanelScreenManager,
    string,
    HTMLElement,
    PanelType,
    boolean?,
    boolean?,
];

export type PanelHTMLElement = HTMLElement & {
    screenManagerInstance: PanelScreenManager;
    startPos?: [number, number];
    isDraggable?: boolean;
};

export interface RenderCardOptions {
    cardId: string;
    startPos?: [number, number];
    cardWidth?: string;
    cardHeight?: string;
    isDraggable?: boolean;
}

export interface PanelRenderer {
    render(): void;
}

export abstract class Panel extends EventTarget {
    name: string;
    element: HTMLElement;
    isVisible: boolean;
    isFullscreen: boolean = false;

    readonly displayName: string;

    // The instance of PanelScreenManager that this panel belongs to.
    // This is used to manage the panel's state and interactions.
    readonly screenManagerInstance: PanelScreenManager;
    readonly type: PanelType;
    readonly canFullscreen: boolean = false;

    constructor(
        screenManagerInstance: PanelScreenManager,
        displayName: string,
        name: string,
        element: HTMLElement,
        type: PanelType,
        isVisible: boolean = false,
        canFullscreen: boolean = false,
    ) {
        super();

        this.screenManagerInstance = screenManagerInstance;
        this.displayName = displayName;
        this.name = name;
        this.element = element;
        this.type = type;
        this.isVisible = isVisible;
        this.canFullscreen = canFullscreen;
    }

    setVisible(isVisible: boolean): void {
        this.isVisible = isVisible;
    }

    toggleFullscreen(): void {
        if (!this.canFullscreen) {
            return;
        }

        this.isFullscreen = !this.isFullscreen;

        this.dispatchEvent(
            new CustomEvent("fullscreen-change", {
                detail: { isFullscreen: this.isFullscreen },
                bubbles: true,
                composed: true,
            }),
        );
    }

    onFullscreenChange(callback: (isFullscreen: boolean) => void): void {
        if (!this.canFullscreen) {
            return;
        }

        this.addEventListener("fullscreen-change", (event: Event) => {
            callback((event as CustomEvent).detail.isFullscreen);
        });
    }
}

export class VSTIPanel extends Panel {
    vstData: VSTInstrument;

    constructor(
        screenManagerInstance: PanelScreenManager,
        displayName: string,
        name: string,
        element: HTMLElement,
        isVisible: boolean = false,
        vstData: VSTInstrument,
        canFullscreen: boolean = false,
    ) {
        super(
            screenManagerInstance,
            displayName,
            name,
            element,
            PanelType.VSTI,
            isVisible,
            canFullscreen,
        );

        this.vstData = vstData;
    }
}

export class CustomPanel extends Panel {
    constructor(
        screenManagerInstance: PanelScreenManager,
        displayName: string,
        name: string,
        element: HTMLElement,
        isVisible: boolean = false,
        canFullscreen: boolean = false,
    ) {
        super(
            screenManagerInstance,
            displayName,
            name,
            element,
            PanelType.Custom,
            isVisible,
            canFullscreen,
        );
    }
}

export default class PanelScreenManager extends EventTarget {
    readonly panels: Panel[] = [];

    container: HTMLElement | null = null;

    current: Panel | undefined;

    constructor() {
        super();
    }

    public onPanelFocused(callback: (panel?: Panel) => void): void {
        this.addEventListener("panel-focus", (event: Event) => {
            callback((event as CustomEvent).detail.panel);
        });
    }

    getPanel(name: string): Panel | undefined {
        const panel = this.panels.find((panel) => panel.name === name);

        if (!panel) {
            throw new Error(`Panel with name ${name} does not exist.`);
        }

        return panel;
    }

    public add(name: string, panel: Panel): PanelScreenManager {
        if (this.panels.find((p) => p.name === name)) {
            throw new Error(`Panel with name ${name} already exists.`);
        }

        this.panels.push(panel);

        this.dispatchEvent(
            new CustomEvent("panel-added", {
                detail: { panel },
                bubbles: true,
                composed: true,
            }),
        );

        return this;
    }

    onPanelAdded(callback: (panel: Panel) => void): void {
        this.addEventListener("panel-added", (event: Event) => {
            callback((event as CustomEvent).detail.panel);
        });
    }

    private dispatchFocusEvent(context?: Panel): void {
        this.dispatchEvent(
            new CustomEvent<FocusPanelEvent>("panel-focus", {
                detail: { panel: context },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // Unfocuses all panels but does not dispatch an event.
    public quetlyUnfocus(): void {}

    public focusNext(): Panel | undefined {
        const currentPanel = this.current;

        if (!currentPanel) {
            const first = this.panels[0];

            if (!first) {
                console.warn("No panels available to focus.");
                return undefined;
            }

            return this.focus(first.name);
        }

        const currentIndex = this.panels.indexOf(currentPanel);
        const nextIndex = (currentIndex + 1) % this.panels.length;
        const nextPanel = this.panels[nextIndex];

        if (nextPanel) {
            return this.focus(nextPanel.name);
        }

        console.warn("No next panel to focus.");

        return undefined;
    }

    public focusPrevious(): Panel | undefined {
        const currentPanel = this.current;

        if (!currentPanel) {
            const last = this.panels[this.panels.length - 1];

            if (!last) {
                console.warn("No panels available to focus.");
                return undefined;
            }

            return this.focus(last.name);
        }

        const currentIndex = this.panels.indexOf(currentPanel);
        const previousIndex =
            (currentIndex - 1 + this.panels.length) % this.panels.length;
        const previousPanel = this.panels[previousIndex];

        if (previousPanel) {
            return this.focus(previousPanel.name);
        }

        console.warn("No previous panel to focus.");

        return undefined;
    }

    public focus(name: string): Panel | undefined {
        const panel = this.panels.find((p) => p.name === name);

        if (!panel) {
            throw new Error(`Panel with name ${name} does not exist.`);
        }

        if (this.current === panel) {
            return panel;
        }

        this.current = panel;
        this.dispatchFocusEvent(panel);

        return panel;
    }
}

export interface PanelCardRenderer extends RenderCardOptions {
    screenManagerInstance: PanelScreenManager;
    contents: HTMLElement;
}
