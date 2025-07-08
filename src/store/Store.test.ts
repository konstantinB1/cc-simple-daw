import Store from "./Store";

describe("Store", () => {
    it("should initialize with the correct state", () => {
        const initialState = { count: 0 };
        const store = new Store(initialState);
        expect(store.getState()).toEqual(initialState);
    });

    it("should subscribe to state changes", () => {
        const initialState = { count: 0 };
        const store = new Store(initialState);
        const callback = vi.fn();

        const unsubscribe = store.subscribe(callback);
        expect(callback).toHaveBeenCalledWith(initialState);

        store.setState((state) => ({ ...state, count: state.count + 1 }));
        expect(callback).toHaveBeenCalledTimes(2);

        unsubscribe();
        store.setState((state) => ({ ...state, count: state.count + 1 }));
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should notify subscribers when state changes", () => {
        const initialState = { count: 0, nested: { value: 1 } };
        const store = new Store(initialState);
        const callback = vi.fn();
        const callback2 = vi.fn();

        store.subscribe(callback);
        store.subscribe(callback2);

        store.setState((draft) => {
            draft.count = draft.count + 1;
            draft.nested.value = 123;
        });

        expect(callback).toHaveBeenCalledWith({
            count: 1,
            nested: { value: 123 },
        });
        expect(callback2).toHaveBeenCalledWith({
            count: 1,
            nested: { value: 123 },
        });

        expect(store.getState()).toEqual({
            count: 1,
            nested: { value: 123 },
        });
    });
});
