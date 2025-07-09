import PlaybackScheduler from "./PlaybackScheduler";

describe("Scheduler", () => {
    it("should schedule a play event correctly", () => {
        const scheduler = new PlaybackScheduler();

        scheduler.startFrom(0);
    });
});
