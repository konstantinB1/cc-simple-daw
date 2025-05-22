import { getAudioAsset } from "@/utils";
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
    private loadedPrograms: Map<string, Program> = new Map();

    public currentProgram: Program | null = null;

    public static getInstance(): ProgramManager {
        if (!ProgramManager.instance) {
            ProgramManager.instance = new ProgramManager();
        }

        return ProgramManager.instance;
    }

    public get programNames(): string[] {
        return programsJson.programs.map((program) => program.name);
    }

    public async load(name: string): Promise<Program> {
        if (this.loadedPrograms.has(name)) {
            return this.loadedPrograms.get(name) as Program;
        }

        const program = programsJson.programs.find((p) => p.name === name);

        if (!program) {
            throw new Error(`Program ${name} not found`);
        }

        const basePath = program.path;

        try {
            const audioFiles: AudioFile[] = await Promise.all(
                (program?.data ?? []).map(async ({ name, file }) => {
                    const data = await getAudioAsset(`${basePath}/${file}`);

                    return {
                        name,
                        data,
                    };
                }),
            );

            const loadedProgram: Program = {
                name,
                data: audioFiles,
            };

            this.loadedPrograms.set(name, loadedProgram);
            this.currentProgram = loadedProgram;

            return loadedProgram;
        } catch (error) {
            throw new Error(`Error loading program ${name}`);
        }
    }
}
