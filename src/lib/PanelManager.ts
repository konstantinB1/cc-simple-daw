import Observer from "./Observer";

type Panel = {
    isCurrent: boolean;
};

export default class PanelManager {
    private panels: string[] = [];

    private obs: Observer<Panel> = new Observer();

    private static instance: PanelManager;

    public static getInstance(): PanelManager {
        if (!PanelManager.instance) {
            PanelManager.instance = new PanelManager();
        }

        return PanelManager.instance;
    }

    public add(name: string): PanelManager {
        this.panels.push(name);
        return this;
    }

    public notify(name: string): void {
        for (const key of this.panels) {
            this.obs.notify(key, {
                isCurrent: key === name,
            });
        }
    }

    public listen(name: string, fn: (panels: Panel) => void): void {
        this.obs.subscribe(name, fn);
    }
}
