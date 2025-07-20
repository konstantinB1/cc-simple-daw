import Metronome from "./Metronome";
import AudioSourceMock from "@mocks/AudioSource.mock";
import fetchMock from "fetch-mock";
import AudioBuffer from "@mocks/AudioBuffer";

fetchMock.mockGlobal().route({
    url: "path/to/sound.wav",
    response: new Blob(["fake audio data"], { type: "audio/wav" }),
});

let metronome: Metronome;

beforeAll(() => {
    vi.useFakeTimers();
});

afterAll(() => {
    vi.useRealTimers();
});

beforeEach(() => {
    metronome = new Metronome({
        channel: new AudioSourceMock(),
        ctx: new AudioContext(),
    });
});

vi.mock("./AudioSample", async () => {
    const importActual = await import("./AudioSample");

    return {
        default: importActual.default,
    };
});

function loadFakeSound(): void {
    metronome.loadMetronomeSound("path/to/sound.wav");
    metronome.source.buffer = new AudioBuffer({
        length: 44100,
        sampleRate: 44100,
    });
}

describe("Metronome", () => {
    it("should throw an error if sound is not loaded before starting", () => {
        expect(() => {
            metronome.start(120, 4, () => {});
        }).toThrow(expect.any(Error));
    });

    it("should tick constantly at the specified BPM", () => {
        loadFakeSound();
        const times: number[] = [];
        const callback = vi.fn((nextBeatTime) => times.push(nextBeatTime));

        metronome.start(120, 4, callback);

        // Stretch the next time as much as possible
        vi.advanceTimersByTime(1999.999);

        expect(callback).toHaveBeenCalledTimes(4);
        expect(times).toEqual([0, 500, 1000, 1500]);
    });

    it("should stop ticking when stop is called", () => {
        loadFakeSound();
        const callback = vi.fn();

        metronome.start(120, 4, callback);

        vi.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(2);

        metronome.stop();

        vi.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(2); // Should not call again after stop
    });

    it("3/4 time signature should tick correctly", () => {
        loadFakeSound();
        const times: number[] = [];
        const callback = vi.fn((nextBeatTime) => times.push(nextBeatTime));

        metronome.start(120, 3, callback);

        vi.advanceTimersByTime(2000);

        expect(callback).toHaveBeenCalledTimes(4);
    });

    it("should call setMuted method on the source when mute is called", () => {
        loadFakeSound();
        const setMutedSpy = vi.spyOn(metronome.source, "setMuted");

        metronome.mute();

        expect(setMutedSpy).toHaveBeenCalledWith(true);
    });

    it.skip('call source "play" method with correct parameters', () => {
        loadFakeSound();
        metronome.source.setMuted(false);
        const playSpy = vi.spyOn(metronome.source, "play");

        metronome.start(120, 4);

        expect(playSpy).toHaveBeenCalledWith({
            when: 0,
            playbackRate: 1.0,
        });

        metronome.restart(120, 4);

        expect(playSpy).toHaveBeenCalledWith({
            when: 0,
            playbackRate: 1.0,
        });
    });
});
