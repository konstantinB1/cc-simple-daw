import type AudioChannel from "./AudioSource";

export default class MasterMixer {
    private channels: Map<string, AudioChannel> = new Map();

    constructor(_: AudioContext) {}

    addChannel(channel: AudioChannel): void {
        this.channels.set(channel.id, channel);
        channel.setVolume(1); // Set default volume
    }

    removeChannel(channelId: string): void {
        this.channels.delete(channelId);
    }

    getChannel(channelId: string): AudioChannel | undefined {
        return this.channels.get(channelId);
    }
}
