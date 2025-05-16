export function getBeforeLastSegment(path: string): string {
    const segments = path.split("/");

    if (segments.length < 2) {
        return path;
    }

    return segments[segments.length - 2];
}
