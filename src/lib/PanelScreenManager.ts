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
    isCurrent: boolean = false;
    isVisible: boolean;

    // The instance of PanelScreenManager that this panel belongs to.
    // This is used to manage the panel's state and interactions.
    screenManagerInstance: PanelScreenManager;
    type: PanelType;

    constructor(
        ...[
            screenManagerInstance,
            name,
            element,
            type,
            isVisible = false,
        ]: PanelArgs
    ) {
        super();

        this.screenManagerInstance = screenManagerInstance;
        this.name = name;
        this.element = element;
        this.type = type;
        this.isVisible = isVisible;
    }

    setCurrent(isCurrent: boolean): void {
        this.isCurrent = isCurrent;
    }

    setVisible(isVisible: boolean): void {
        this.isVisible = isVisible;
    }
}

export class VSTIPanel extends Panel {
    vstData: VSTInstrument;

    constructor(
        screenManagerInstance: PanelScreenManager,
        name: string,
        element: HTMLElement,
        isVisible: boolean = false,
        isDraggable: boolean = true,
        vstData: VSTInstrument,
    ) {
        super(
            screenManagerInstance,
            name,
            element,
            PanelType.VSTI,
            isVisible,
            isDraggable,
        );

        this.vstData = vstData;
    }
}

export class CustomPanel extends Panel {
    constructor(
        screenManagerInstance: PanelScreenManager,
        name: string,
        element: HTMLElement,
        isVisible: boolean = false,
        isDraggable: boolean = true,
    ) {
        super(
            screenManagerInstance,
            name,
            element,
            PanelType.Custom,
            isVisible,
            isDraggable,
        );
    }
}

export default class PanelScreenManager extends EventTarget {
    panels: Panel[] = [];

    static instance: PanelScreenManager | null = null;

    constructor() {
        super();
        PanelScreenManager.instance = this;
    }

    public onPanelFocused(callback: (panel?: Panel) => void): void {
        this.addEventListener("panel-focus", (event: Event) => {
            callback((event as CustomEvent).detail.panel);
        });
    }

    public add(name: string, panel: Panel): PanelScreenManager {
        if (this.panels.find((p) => p.name === name)) {
            throw new Error(`Panel with name ${name} already exists.`);
        }

        this.panels.push(panel);

        return this;
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
    public quetlyUnfocus(): void {
        for (const panel of this.panels) {
            panel.setCurrent(false);
        }
    }

    private getCurrentPanel(): Panel | undefined {
        return this.panels.find((panel) => panel.isCurrent);
    }

    public focusNext(): Panel | undefined {
        const currentPanel = this.getCurrentPanel();

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
        const currentPanel = this.getCurrentPanel();

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

    // Focuses on a panel by its name.
    // If the panel is already focused, it returns the panel.
    // If the panel does not exist, it throws an error.
    // If the panel is focused, it sets all other panels to not current.
    // It also dispatches a "panel-focused" event with the focused panel.
    public focus(name: string): Panel | undefined {
        const panel = this.panels.find((p) => p.name === name);

        if (!panel) {
            throw new Error(`Panel with name ${name} does not exist.`);
        }

        if (panel.isCurrent) {
            return panel;
        }

        for (const p of this.panels.values()) {
            if (p.name !== panel.name) {
                p.setCurrent(false);
            }
        }

        panel.setCurrent(true);
        this.dispatchFocusEvent(panel);

        return panel;
    }

    // We need to handle clicks for non panel elements
    // so we can lose the current panel and dispatch a focus event
    static handleBackgroundClick() {
        const instance = PanelScreenManager.instance;

        if (!instance) {
            console.warn("No PanelScreenManager instance found.");
            return;
        }

        instance.dispatchFocusEvent();
    }
}

export interface PanelCardRenderer extends RenderCardOptions {
    screenManagerInstance: PanelScreenManager;
    contents: HTMLElement;
}
