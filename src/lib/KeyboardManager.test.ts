import { SimpleKeyboardKanager } from "./KeyboardManager";

describe("KeyboardManager", () => {
    describe("SimpleKeyboardManager", () => {
        let instance: SimpleKeyboardKanager;

        afterEach(() => {
            instance.detachEventListeners();
            instance = undefined as any;
        });

        beforeEach(() => {
            instance = new SimpleKeyboardKanager();
            instance.attachEventListeners();
        });

        it("should call handler function if key is detected", () => {
            const handler = vi.fn();
            instance.addKeys([
                {
                    keys: ["a"],
                    handler: handler,
                    pressed: false,
                    active: true,
                    description: "Test key",
                    oneShot: false,
                },
            ]);

            document.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "A",
                    bubbles: true,
                    cancelable: true,
                }),
            );

            expect(handler).toHaveBeenCalled();
        });

        it("should emit events from onKeyDown", () => {
            let events: any[] = [];

            instance.onMappingHit((e) => {
                events.push(e.detail);
            });

            instance.addKeys([
                {
                    keys: ["a"],
                    handler: () => {},
                    pressed: false,
                    active: true,
                    description: "Test key",
                    oneShot: false,
                },
            ]);

            document.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "A",
                    bubbles: true,
                    cancelable: true,
                }),
            );

            expect(events).toHaveLength(1);
            expect(events[0]).toEqual(
                expect.objectContaining({
                    mapping: {
                        keys: ["a"],
                        active: true,
                        description: "Test key",
                        handler: expect.any(Function),
                        oneShot: false,
                        pressed: true,
                    },
                }),
            );
        });
    });
});
