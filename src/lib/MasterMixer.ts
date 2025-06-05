import type AudioChannel from "./AudioChannel";

export default class MasterMixer {
    private ctx: AudioContext;

    private channels: Map<string, AudioChannel> = new Map();

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
    }

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
