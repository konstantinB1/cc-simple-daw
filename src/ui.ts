import type { Key } from "./key-mappings";

export function createElementsFromMappings(mappings: Key[], padSelectorClass: string): void {
    const elements = Array.from(document.querySelectorAll(`.${padSelectorClass}`) as NodeListOf<HTMLDivElement>);

    mappings.forEach((mapping) => {
        const pad = elements.find((pad) => pad.id === mapping.id);

        if (pad) {
            const el = document.createElement('p');
            el.classList.add('key', 'typography-100');
            el.innerText = mapping.key;
            pad.appendChild(el);
        } else {
            console.error(`Pad with id ${mapping.id} not found`);
        }
    });
}