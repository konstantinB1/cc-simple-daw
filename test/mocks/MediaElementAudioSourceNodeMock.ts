export default class MediaElementAudioSourceNodeMock
    implements MediaElementAudioSourceNode
{
    mediaElement!: HTMLMediaElement;
    channelCount!: number;
    channelCountMode!: ChannelCountMode;
    channelInterpretation!: ChannelInterpretation;
    context!: BaseAudioContext;
    numberOfInputs!: number;
    numberOfOutputs!: number;
    connect(
        destinationNode: unknown,
        output?: unknown,
        input?: unknown,
    ): void | AudioNode {
        throw new Error("Method not implemented.");
    }
    disconnect(
        destinationNode?: unknown,
        output?: unknown,
        input?: unknown,
    ): void {
        throw new Error("Method not implemented.");
    }
    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean,
    ): void {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }
    removeEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): void {
        throw new Error("Method not implemented.");
    }
}
