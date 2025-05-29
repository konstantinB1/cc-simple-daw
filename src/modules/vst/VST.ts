export interface VSTInstrument {
    id: string;
    name: string;
    icon: string;
    isLoaded: boolean;
    load(): Promise<void>;
    play(note: string, velocity?: number): void;
    stop(note: string): void;
}
