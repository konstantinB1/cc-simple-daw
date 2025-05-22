import type { Key } from "./lib/KeyManager";

export const padKeys: Key[] = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
].map((key, index) => ({
    key,
    id: `pad-${index + 1}`,
}));
