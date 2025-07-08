import "vitest/globals";

export function createAndMount(name: string) {
    beforeEach(() => {});

    afterEach(() => {
        if (element.isConnected) {
            element.remove();
        }
    });
}
