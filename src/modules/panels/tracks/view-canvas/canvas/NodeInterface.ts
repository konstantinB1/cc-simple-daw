import type TracksCanvasRenderer from "./TracksCanvasRenderer";

export type RedrawCallback = () => void;

export type RootRenderer = TracksCanvasRenderer;

export interface TrackCanvasNode {
    draw(...args: any[]): void;
}

export type TrackCanvasNodeConstructor = new (
    pipeline: TracksCanvasRenderer,
    redrawCallback: RedrawCallback,
) => TrackCanvasNode;

export type NodeFactory<T extends TrackCanvasNode> = (
    ctx: CanvasRenderingContext2D,
    redrawCallback: RedrawCallback,
) => T;
