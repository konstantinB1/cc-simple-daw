import "@webcomponents/scoped-custom-element-registry";

Object.defineProperty(globalThis, "AudioContext", {
    value: class extends EventTarget {
        currentTime = 0;
        createGain = () => ({ connect: () => {} });
        createBufferSource = () => ({
            connect: () => {},
            start: () => {},
            stop: () => {},
        });
        decodeAudioData = async () =>
            new AudioBuffer({ length: 44100, sampleRate: 44100 });
    },
    writable: true,
    configurable: true,
});
