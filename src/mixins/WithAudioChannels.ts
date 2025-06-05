import type { ChannelsContext } from "@/context/channelsContext";
import channelsContext from "@/context/channelsContext";
import AudioChannel from "@/lib/AudioChannel";
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

        hasChannel(channel: AudioChannel): boolean {
            return this.audioChannels.channels.some((c) => c.id === channel.id);
        }

        $addChannel(channel: AudioChannel): void {
            this.dispatchEvent(
                new CustomEvent<AudioChannel>("channels-context/add-channel", {
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
