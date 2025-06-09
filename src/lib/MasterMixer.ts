import type AudioSource from "./AudioSource";

export default class MasterMixer {
    private channels: Map<string, AudioSource> = new Map();

    constructor(_: AudioContext) {}

    addChannel(channel: AudioSource): void {
        this.channels.set(channel.id, channel);
        channel.setVolume(1); // Set default volume
    }

    removeChannel(channelId: string): void {
        this.channels.delete(channelId);
    }

    getChannel(channelId: string): AudioSource | undefined {
        return this.channels.get(channelId);
    }
}
