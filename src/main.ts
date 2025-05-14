import { KeyManager, KeyMapping, type Key } from "./key-mappings";

export interface SimpleDAWInterfaceDeps {
    audioContext: AudioContext;
    gainNode: GainNode;
    audioBuffer: AudioBuffer | null;
    audioSource: AudioBufferSourceNode | null;
    audioFile: File | null;
}

export default class SimpleDAW {
    context: AudioContext;
    gainNode: GainNode;
    audioBuffer: AudioBuffer | null = null;
    audioSource: AudioBufferSourceNode | null = null;
    audioFile: File | null = null;
    
    constructor({
        audioContext,
        gainNode,
        audioBuffer = null,
        audioSource = null,
        audioFile = null
    }: SimpleDAWInterfaceDeps) {
        this.context = audioContext;
        this.gainNode = gainNode;
        this.audioBuffer = audioBuffer;
        this.audioSource = audioSource;
        this.audioFile = audioFile;
    }
}

const ctx = new AudioContext();
const daw = new SimpleDAW({
    audioContext: ctx,
    gainNode: ctx.createGain(),
    audioBuffer: null,
    audioSource: null,
    audioFile: null
});



function main() {
    const keyManager: KeyManager = KeyManager.getInstance();
    const keys: Key[] = ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c']
        .map((key, index) => ({
            key,
            id: `pad-${index + 1}`
        }));

    const padElements = Array.from(document.querySelectorAll('.pad') as NodeListOf<HTMLDivElement>);

    keyManager.addKeys(keys).attachListener((mapping) => {
        const pad = padElements.find((pad) => pad.id === mapping.id);

        if (pad) {
            if (mapping.isPressed) {
                pad.classList.add('active');
            } else {
                pad.classList.remove('active');
            }
        } else {
            console.error(`Pad with id ${mapping.id} not found`);
        }
    });
}

main();
