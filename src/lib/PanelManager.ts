import Observer from "./Observer";

type Panel = {
    zIndex: number;
};

type PanelDataFn = (panel: Panel) => void;

export default class PanelManager {
    private panels: Map<string, Panel> = new Map();

    private obs: Observer<PanelDataFn> = new Observer();

    private static instance: PanelManager;

    public static getInstance(): PanelManager {
        if (!PanelManager.instance) {
            PanelManager.instance = new PanelManager();
        }

        return PanelManager.instance;
    }

    public add(name: string): void {
        this.panels.set(name, {
            zIndex: 0,
        });
    }

    public elevatePanel(name: string): void {
        const panel = this.panels.get(name);

        if (panel) {
            panel.zIndex = 1;

            this.panels.forEach((p, key) => {
                if (key !== name) {
                    p.zIndex = 0;
                }

                this.obs.notify(name, {
                    name: key,
                    data: p,
                });
            });
        }
    }

    public listen(name: string, fn: PanelDataFn): void {
        this.obs.subscribe(name, fn);
    }
}
