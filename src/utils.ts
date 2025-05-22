export function getBeforeLastSegment(path: string): string {
    const segments = path.split("/");

    if (segments.length < 2) {
        return path;
    }

    return segments[segments.length - 2];
}

export const getAudioAsset = async (filePath: string): Promise<ArrayBuffer> => {
    const file = await fetch(filePath, {
        headers: {
            "Content-Type": "audio/wav",
        },
    });

    if (!file.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
    }

    return await file.arrayBuffer();
};
