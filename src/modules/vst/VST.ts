import type MasterAudio from "@/lib/audio/MasterAudio";

export class SoundChannel {
    ctx: MasterAudio;
    id: string;
    name: string;
    volume: number;
    pan: number;
    mute: boolean;
    solo: boolean;
    isActive: boolean;

    constructor(
        id: string,
        name: string,
        ctx: MasterAudio,
        volume: number = 1.0,
        pan: number = 0.0,
        mute: boolean = false,
        solo: boolean = false,
        isActive: boolean = true,
    ) {
        this.id = id;
        this.name = name;
        this.ctx = ctx;
        this.volume = volume;
        this.pan = pan;
        this.mute = mute;
        this.solo = solo;
        this.isActive = isActive;
    }
}

export class VSTInstrument {
    id: string;
    name: string;
    soundChannels: SoundChannel[];

    constructor(id: string, name: string, soundChannels: SoundChannel[] = []) {
        this.id = id;
        this.name = name;
        this.soundChannels = soundChannels;
    }

    addSoundChannel(
        ctx: MasterAudio,
        channelId: string,
        channelName: string,
        volume: number = 1.0,
        pan: number = 0.0,
        mute: boolean = false,
        solo: boolean = false,
        isActive: boolean = true,
    ): void {
        const newChannel = new SoundChannel(
            channelId,
            channelName,
            ctx,
            volume,
            pan,
            mute,
            solo,
            isActive,
        );

        this.soundChannels.push(newChannel);
    }
}
