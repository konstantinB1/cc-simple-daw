import type { VSTInstrument } from "@/modules/vst/VST";

export default class VSTRegistry {
    private vstPlugins: Map<string, VSTInstrument> = new Map();

    public register(plugin: VSTInstrument): void {
        if (this.vstPlugins.has(plugin.id)) {
            console.warn(
                `VST plugin with id ${plugin.id} is already registered.`,
            );
            return;
        }
        this.vstPlugins.set(plugin.id, plugin);
    }
}
