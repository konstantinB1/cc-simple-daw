export function removeSiblingDups<T>(
    arr: T[],
    keyFn: (item: T) => string | number,
): T[] {
    const seen = new Set<string | number>();
    return arr.filter((item) => {
        const key = keyFn(item);

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
}
