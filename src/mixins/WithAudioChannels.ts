import type { ChannelsContext } from "@/context/channelsContext";
import channelsContext from "@/context/channelsContext";
import AudioSource from "@/lib/AudioSource";
import type { Constructor } from "@/utils/types";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

const WithAudioChannelsContext = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class AudioChannelsConsumer extends superClass {
        @consume({ context: channelsContext, subscribe: true })
        @state()
        protected audioChannels!: ChannelsContext;

        hasChannel(channel: AudioSource): boolean {
            return this.audioChannels.channels.some((c) => c.id === channel.id);
        }

        $addChannel(channel: AudioSource): void {
            this.dispatchEvent(
                new CustomEvent<AudioSource>("channels-context/add-channel", {
                    detail: channel,
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    return AudioChannelsConsumer as unknown as T &
        Constructor<AudioChannelsConsumer>;
};

export default WithAudioChannelsContext;
