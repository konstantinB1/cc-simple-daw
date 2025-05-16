import { getBeforeLastSegment } from "../utils";
import programsJson from "../programs.json" assert { type: "json" };

export type AudioFile = {
    name: string;
    data: ArrayBuffer;
};

export type Program = {
    name: string;
    data: AudioFile[];
};

export default class ProgramManager {
    private static instance: ProgramManager;
    private loadedPrograms: Program[] = [];
    private currentProgram: Program | null = null;

    public static getInstance(): ProgramManager {
        if (!ProgramManager.instance) {
            ProgramManager.instance = new ProgramManager();
        }
        return ProgramManager.instance;
    }

    async loadFile(path: string): Promise<Program> {}

    private isProgramLoaded(name: string): boolean {
        return this.loadedPrograms.some((program) => program.name === name);
    }

    async loadProgram(name: string): Promise<Program> {
        if (this.isProgramLoaded(name)) {
            return this.loadedPrograms.find(
                (program) => program.name === name,
            )!;
        }

        const program = programsJson.programs.find((p) => p.name === name);

        if (!program) {
            throw new Error(`Program ${name} not found`);
        }

        const basePath = program.path;

        try {
            const audioFiles = await Promise.all(
                program?.data?.map(async ({ name, file }) => {
                    const response = await fetch(`${basePath}/${file}`, {
                        headers: {
                            "Content-Type": "audio/wav",
                        },
                    });
                    const arrayBuffer = await response.arrayBuffer();

                    return {
                        name,
                        data: arrayBuffer,
                    };
                }),
            );

            console.log("Audio files loaded:", audioFiles);
        } catch (error) {
            console.error(`Error loading program ${name}:`, error);
            throw new Error(`Error loading program ${name}`);
        }
    }
}
