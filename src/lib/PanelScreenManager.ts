import type { VSTInstrument } from "@/modules/vst/VST";
import type { TemplateResult } from "lit";

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
    PanelHTMLElement,
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

export abstract class Panel extends EventTarget implements PanelRenderer {
    name: string;
    element: HTMLElement;
    isCurrent: boolean;
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
            isCurrent = false,
            isVisible = false,
        ]: PanelArgs
    ) {
        super();

        this.screenManagerInstance = screenManagerInstance;
        this.name = name;
        this.element = element;
        this.type = type;
        this.isCurrent = isCurrent;
        this.isVisible = isVisible;
    }

    setCurrent(isCurrent: boolean): void {
        this.isCurrent = isCurrent;
    }

    setVisible(isVisible: boolean): void {
        this.isVisible = isVisible;
    }

    // Initially it was implemented to render a specific
    // card web component. PanelCardRenderer is now used and this
    // method only exists to satisfy the PanelRenderer interface.
    render(): TemplateResult {
        throw new Error("Method 'render' not implemented.");
    }
}

export class VSTIPanel extends Panel {
    vstData: VSTInstrument;

    constructor(vstData: VSTInstrument, ...args: PanelArgs) {
        super(...args);
        this.vstData = vstData;
    }
}

export class CustomPanel extends Panel {
    constructor(...args: PanelArgs) {
        super(...args);
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

        this.dispatchFocusEvent(panel);
        panel.setCurrent(true);

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
