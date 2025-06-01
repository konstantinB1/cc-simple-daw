import type { LitElement } from "lit";

export interface BaseControlInterface {
    name: string;
    host: LitElement;
    register(): void;
    unregister(): void;
}

export class BaseControls {
    private controls: Map<string, BaseControlInterface> = new Map();

    public add(control: BaseControlInterface): void {
        this.controls.set(control.name, control);
    }

    public register(): void {
        this.controls.forEach((control) => {
            control.register();
        });
    }

    public unregister(): void {
        this.controls.forEach((control) => {
            control.unregister();
        });
    }

    public getControls(): Map<string, BaseControlInterface> {
        return this.controls;
    }
}
