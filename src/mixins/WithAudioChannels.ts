import type { ChannelsContext } from "@/context/channelsContext";
import channelsContext from "@/context/channelsContext";
import AudioSource from "@/lib/AudioSource";
import type { Constructor } from "@/utils/types";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

const WithAudioSourcesContext = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class AudioSourcesConsumer extends superClass {
        @consume({ context: channelsContext, subscribe: true })
        @state()
        protected AudioSources!: ChannelsContext;

        hasChannel(channel: AudioSource): boolean {
            return this.AudioSources.channels.some((c) => c.id === channel.id);
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

    return AudioSourcesConsumer as unknown as T &
        Constructor<AudioSourcesConsumer>;
};

export default WithAudioSourcesContext;
