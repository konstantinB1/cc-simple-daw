import type { VSTPlugin } from "./VST";

export default class VSTRegistry {
    private vstPlugins: Map<string, VSTPlugin> = new Map();

    add(plugin: VSTPlugin): void {
        if (this.vstPlugins.has(plugin.id)) {
            throw new Error(`Plugin with ID ${plugin.id} already exists.`);
        }

        this.vstPlugins.set(plugin.id, plugin);
    }
}
