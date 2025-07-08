import Store from "./Store";
import Watcher from "./Watcher";

describe("Watcher", () => {
    it("should watch a store property and call the callback when it changes", () => {
        const watcher = new Watcher<any>();

        const store = new Store({ deep: { count: 0, otherProp: "a" } });

        const mockCallback = vi.fn();

        watcher.watch(store, "deep.count", mockCallback);

        expect(mockCallback).toHaveBeenCalledWith(0, undefined);

        store.setState((draft) => {
            draft.deep.count = 1;
        });

        expect(mockCallback).toHaveBeenCalledWith(1, 0);

        store.setState((draft) => {
            draft.deep.count += 1;
        });

        expect(mockCallback).toHaveBeenCalledWith(2, 1);
    });

    it("should unwatch a store property", () => {
        const watcher = new Watcher<any>();

        const store = new Store({ deep: { count: 0, otherProp: "a" } });

        const mockCallback = vi.fn();

        watcher.watch(store, "deep.count", mockCallback);

        expect(mockCallback).toHaveBeenCalledWith(0, undefined);

        watcher.unwatch("deep.count");

        store.setState((draft) => {
            draft.deep.count = 1;
        });

        expect(mockCallback).toHaveBeenCalledTimes(1); // Should not be called again
    });
});
