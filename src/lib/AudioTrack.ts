import type AudioSource from "./AudioSource";

export default class Track {
    channel: AudioSource;

    id: string;

    parent?: Track;

    constructor(channel: AudioSource, parent?: Track) {
        this.channel = channel;
        this.id = channel.id;
        this.parent = parent;
    }
}
