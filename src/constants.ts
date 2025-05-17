import type { Key } from "./lib/KeyManager";

export const padKeys: Key[] = [
    "q",
    "w",
    "e",
    "r",
    "a",
    "s",
    "d",
    "f",
    "z",
    "x",
    "c",
    "v",
].map((key, index) => ({
    key,
    id: `pad-${index + 1}`,
}));
