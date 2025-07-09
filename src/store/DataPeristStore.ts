import Store from "./Store";

export type ConfigState = {
    persist: boolean;
    data: PersistedEvent<string, object>[];
};

const initialConfigState: ConfigState = {
    persist: true,
    data: [],
};

export type PersistedEvent<T extends string, S extends object> = {
    type: T;
    data: S;
};

export default class ConfigStore extends Store<ConfigState> {
    constructor(initialState: ConfigState = initialConfigState) {
        super(initialState);
    }

    // Method to set the persistPlaybackData flag
    setPersistPlaybackData(value: boolean): void {
        const shouldPersist = this.state.persist;

        if (!shouldPersist) {
            // If the flag is already false, no need to update
            return;
        }

        this.setState((state) => {});
    }
}
