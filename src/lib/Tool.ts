export default class Tool extends EventTarget {
    icon: string;
    name: string;
    description: string;
    isActive: boolean;

    constructor(icon: string, name: string, description: string) {
        super();
        this.icon = icon;
        this.name = name;
        this.description = description;
        this.isActive = false;
    }

    activate() {
        if (this.isActive) return;
        this.isActive = true;
        this.dispatchEvent(new CustomEvent("activate", { detail: this }));
    }

    deactivate() {
        if (!this.isActive) return;
        this.isActive = false;
        this.dispatchEvent(new CustomEvent("deactivate", { detail: this }));
    }

    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    onActivate(handler: (event: Event) => void) {
        this.addEventListener("activate", handler);
    }
}
