import { StopWatch } from "./TimeUtils";

beforeAll(() => {
    vi.useFakeTimers();
});

afterAll(() => {
    vi.useRealTimers();
});

describe("TimeUtils", () => {
    describe("StopWatch class", () => {
        it("should start, stop, and reset correctly", () => {
            const stopWatch = new StopWatch();
            const onTick = vi.fn();

            stopWatch.start(onTick);
            expect(stopWatch.running).toBe(true);
            expect(stopWatch.getElapsedTime()).toBe(0);

            vi.advanceTimersByTime(50);

            // IT doesn't matter what time exactly, just need to check if it advances
            expect(stopWatch.getElapsedTime()).toBeGreaterThanOrEqual(40);

            stopWatch.stop();
            expect(stopWatch.running).toBe(false);
            expect(stopWatch.getElapsedTime()).toBeGreaterThanOrEqual(40);
            expect(onTick).toHaveBeenCalled();
        });

        it("should resume after being stopped", () => {
            const stopWatch = new StopWatch();

            stopWatch.start();
            vi.advanceTimersByTime(100);
            stopWatch.pause();

            expect(stopWatch.running).toBe(false);
            expect(stopWatch.getElapsedTime()).toBeGreaterThanOrEqual(100);

            stopWatch.setElapsedTime(150);
            expect(stopWatch.running).toBe(true);

            vi.advanceTimersByTime(50);
            expect(stopWatch.getElapsedTime()).toBeGreaterThanOrEqual(200);
        });
    });
});
