import fs from "fs/promises";
import { gzip } from "zlib";
import path from "path";

export const BEAT_X_LENGTH_PX = 500;
export const MAX_BEATS = 50;
export const MAX_PX_WIDTH = MAX_BEATS * BEAT_X_LENGTH_PX;

export const TRACK_LINE_BASE_HEIGHT_PX = 35;
export const TRACK_LEGEND_CONTAINER_PX = 170;
const TRACK_LEGEND_TITLE_Y_PADDING_PX = 15;
const TRACK_LEGEND_TITLE_X_PADDING_PX = 10;
export const LEGEND_CONTENT_LINE = 10;
const TIME_LEGEND_CELL_HEIGHT = 30;

export const TOTAL_PX_X = 3000;

export const MAX_ZOOM_LEVEL = 10;
export const MIN_ZOOM_LEVEL = 1;

const DEFAULT_ZOOM = 5;

const MAX_SUPPORT_VIEWPORT_PX = 1500;

const data: {
    constants: Record<string, any>;
    zooms: {
        level: number;
        params: BeatsForZoom;
    }[];
} = {
    zooms: [],
    constants: {
        BEAT_X_LENGTH_PX,
        MAX_BEATS,
        MAX_PX_WIDTH,
        TRACK_LINE_BASE_HEIGHT_PX,
        TRACK_LEGEND_CONTAINER_PX,
        TRACK_LEGEND_TITLE_Y_PADDING_PX,
        TRACK_LEGEND_TITLE_X_PADDING_PX,
        LEGEND_CONTENT_LINE,
        TIME_LEGEND_CELL_HEIGHT,
        MAX_ZOOM_LEVEL,
        MIN_ZOOM_LEVEL,
        DEFAULT_ZOOM,
    },
};

type PXTimelineMap = {
    zoomLevel: Record<
        number,
        {
            startVpX: number;
            endVpX: number;
            firstVisibleBar: number;
            lastVisibleBar: number;
        }
    >;
};

type BeatInfoZoom = {
    start: number;
    end: number;
    beat: number;
};

type BeatsForZoom = BeatInfoZoom[];

const VIEWPORT_HALF = MAX_SUPPORT_VIEWPORT_PX / 2;

function generateViewportMapForZoom(beatWidth: number) {
    const offsetMap = {};

    for (let i = 0; i < MAX_SUPPORT_VIEWPORT_PX; i++) {
        const offset = Math.min(VIEWPORT_HALF);
    }

    return offsetMap;
}

export function createBarsForZooms(level: number): BeatsForZoom {
    const beatWidth = BEAT_X_LENGTH_PX / level;
    const maxScrollWidth = MAX_BEATS * beatWidth;
    let current = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;
    let beat = 1;

    const beats: BeatsForZoom = [];

    while (current <= maxScrollWidth) {
        // const offsetMap = generateViewportMapForZoom(beatWidth);

        beats.push({
            beat,
            start: current,
            end: current + beatWidth,
        });

        current = current + beatWidth;
        beat++;
    }

    return beats;
}

const generateForZoomLevels = () => {
    for (let i = 1; i <= 10; i++) {
        const bars = createBarsForZooms(i);

        data.zooms.push({
            level: i,
            params: bars,
        });
    }
};

async function main() {
    generateForZoomLevels();

    const p = path.resolve(
        process.cwd(),
        "src/generated/track-canvas-lookup.json",
    );

    await fs.writeFile(p, JSON.stringify(data), { encoding: "utf-8" });
}

main().catch(() => {
    throw new Error("Something went wrong");
});
