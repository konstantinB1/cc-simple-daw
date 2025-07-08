import { Signal, signal } from "@lit-labs/signals";
import { createContext } from "@lit/context";

export const configContext = createContext<ConfigContextStore>(
    Symbol("configContext"),
);

export interface ConfigContextStoreData {
    persistPlaybackData: Signal.State<boolean>;
}

export class ConfigContextStore {
    persistPlaybackData = signal<boolean>(true);

    setPersistPlaybackData(value: boolean): void {
        const current = this.persistPlaybackData.get();

        if (current === value) {
            return;
        }

        this.persistPlaybackData.set(value);
    }
}
