import type { Key } from "./key-mappings";

export const padKeys: Key[] = ["q", "w", "e", "a", "s", "d", "z", "x", "c"].map(
    (key, index) => ({
        key,
        id: `pad-${index + 1}`,
    }),
);
