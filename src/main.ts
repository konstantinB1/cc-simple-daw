import { KeyManager, type Key } from "./key-mappings";
import { createElementsFromMappings } from "./ui";

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

    createElementsFromMappings(keys, 'pad');
}

main();
