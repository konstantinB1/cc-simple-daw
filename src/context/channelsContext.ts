import type AudioChannel from "@/lib/AudioChannel";
import { ContextProvider, createContext } from "@lit/context";
import type { LitElement } from "lit";

const channelsContext = createContext<ChannelsContext>(
    Symbol("channelsContext"),
);

export type ChannelsContext = {
    channels: AudioChannel[];
};

export function attachChannelContextEvents(
    host: LitElement,
    ctx: ContextProvider<typeof channelsContext>,
): void {
    host.addEventListener("channels-context/add-channel", (event: Event) => {
        const channel = (event as CustomEvent).detail as AudioChannel;

        const id = channel.id;

        const existingIndex = ctx.value.channels.findIndex((c) => c.id === id);

        if (existingIndex !== -1) {
            ctx.setValue({
                ...ctx.value,
                channels: ctx.value.channels.map((c, index) =>
                    index === existingIndex ? channel : c,
                ),
            });
        } else {
            ctx.setValue({
                ...ctx.value,
                channels: [...ctx.value.channels, channel],
            });
        }
    });
}

export default channelsContext;
