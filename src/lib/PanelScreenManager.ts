import { VSTInstrument } from "@/modules/vst/VST";
import DragPanelRoot from "./DragPanelRoot";
import type { PanelDragEvent } from "@/modules/view/panel-card/PanelEvents";
import type { LitElement } from "lit";

export enum PanelType {
    VSTI,
    Essential,
    Custom,
    Effect,
}

export type PanelCreateOptions = {
    displayName: string;
    name: string;
    type: PanelType;
    startPos?: [number, number];
    icon?: string; // Optional icon for the panel
    element: CustomElementConstructor;
};

export type FocusPanelEvent = {
    panel?: Panel;
};

export type PanelElement = LitElement &
    RenderCardOptions & {
        screenManager: PanelScreenManager;
        panel: Panel;
        icon?: string;
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

const DEFAULT_START_POS: [number, number] = [0, 0];

export abstract class Panel extends EventTarget {
    readonly name: string;
    element: PanelElement;
    isVisible: boolean;
    isFullscreen: boolean = false;
    isMinimized: boolean = false;
    attached: boolean = false;

    readonly displayName: string;

    // The instance of PanelScreenManager that this panel belongs to.
    // This is used to manage the panel's state and interactions.
    readonly screenManagerInstance: PanelScreenManager;
    readonly type: PanelType;
    readonly canFullscreen: boolean = false;
    readonly startPos?: [number, number];

    constructor(
        screenManagerInstance: PanelScreenManager,
        displayName: string,
        name: string,
        element: PanelElement,
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
        element: PanelElement,
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
        element: PanelElement,
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

    // Allow multiple panels to be focused at once.
    current: Panel[] | undefined;

    private dragPanelRoot: DragPanelRoot;

    constructor(dragRoot?: DragPanelRoot) {
        super();
        this.dragPanelRoot = dragRoot ?? new DragPanelRoot();
    }

    public onPanelFocused(callback: (panel?: Panel) => void): void {
        this.addEventListener("panel-focus", (event: Event) => {
            callback((event as CustomEvent).detail.panel);
        });
    }

    public setRootContainer(container: HTMLElement): void {
        this.dragPanelRoot.container = container;

        // If the container is already set, we can append existing panels
        for (const panel of this.panels) {
            if (panel.attached) {
                continue;
            }

            const htmlElement = panel.element;
            htmlElement.screenManager = this;
            htmlElement.panel = panel;

            if (container) {
                container.appendChild(htmlElement);
                panel.attached = true;
            }
        }
    }

    get rootContainer(): HTMLElement {
        if (!this.dragPanelRoot.container) {
            throw new Error(
                "Root container is not set. Please call setRootContainer first.",
            );
        }

        return this.dragPanelRoot.container;
    }

    getPanel(name: string): Panel | undefined {
        const panel = this.panels.find((panel) => panel.name === name);

        if (!panel) {
            throw new Error(`Panel with name ${name} does not exist.`);
        }

        return panel;
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

        // Last focused panel is an array, so we take the first one.
        const last = currentPanel[currentPanel.length - 1];
        const currentIndex = this.panels.indexOf(last);
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

        const last = currentPanel[currentPanel.length - 1];
        const currentIndex = this.panels.indexOf(last);
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

        panel.element.focus();

        this.current?.push(panel);
        this.dispatchFocusEvent(panel);

        return panel;
    }

    // Consider using new CustomElementRegistry API
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry
    private registerPanelElement(
        element: CustomElementConstructor,
        name: string,
    ): void {
        const get = window.customElements.get(name);

        if (!get) {
            window.customElements.define(name, element);
        }
    }

    public createAndAppend({
        displayName,
        name,
        type,
        startPos,
        icon,
        element,
    }: PanelCreateOptions) {
        let panel: Panel;

        this.registerPanelElement(element, name);

        if (this.panels.find((p) => p.name === name)) {
            throw new Error(`Panel with name ${name} already exists.`);
        }

        const htmlElement = document.createElement(name) as PanelElement;

        htmlElement.cardId = name;
        htmlElement.startPos = startPos || DEFAULT_START_POS;
        htmlElement.screenManager = this;
        htmlElement.icon = icon;

        switch (type) {
            case PanelType.VSTI:
                panel = new VSTIPanel(
                    this,
                    displayName,
                    name,
                    htmlElement,
                    true,
                    new VSTInstrument(name, name, []), // Placeholder for VST data
                    true,
                );

                break;
            case PanelType.Essential:
                panel = new CustomPanel(
                    this,
                    displayName,
                    name,
                    htmlElement,
                    false,
                    true,
                );
                break;
            default:
                throw new Error(`Unsupported panel type: ${type}`);
        }

        htmlElement.panel = panel;

        const container = this.dragPanelRoot.container;

        if (container) {
            container.appendChild(htmlElement);
        }

        this.dragPanelRoot.addPanel(panel, htmlElement);

        htmlElement.addEventListener("panel-drag", (ev) => {
            const { position, isDragging } = ev as unknown as PanelDragEvent;
            this.dragPanelRoot.setPanelState(panel, position, isDragging);
        });

        this.panels.push(panel);

        return panel;
    }
}
