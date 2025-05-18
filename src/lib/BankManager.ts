import { PadBankSelector } from "../components/PadBank";
import type { KeyMapping } from "./KeyManager";
import type { AudioFile } from "./ProgramManager";

export const PADS_PER_BANK = 11;

export class MappedPadKey {
    mapping: KeyMapping;
    data: AudioFile;
    bank: PadBankSelector;
    index: number;

    constructor(
        mapping: KeyMapping,
        data: AudioFile,
        bank: PadBankSelector,
        index: number,
    ) {
        this.mapping = mapping;
        this.data = data;
        this.bank = bank;
        this.index = index;
    }
}

const getBank = (index: number) => {
    let nextBank: PadBankSelector = PadBankSelector.A;

    if (index >= PADS_PER_BANK && index < PADS_PER_BANK * 2) {
        nextBank = PadBankSelector.B;
    } else if (index >= PADS_PER_BANK * 2 && index < PADS_PER_BANK * 3) {
        nextBank = PadBankSelector.C;
    } else if (index >= PADS_PER_BANK * 3) {
        nextBank = PadBankSelector.D;
    }

    return nextBank;
};

export default class BankManager {
    private soundData: MappedPadKey[] = [];

    public create(
        mappings: KeyMapping[],
        programData: AudioFile[],
        cb: (padKey: MappedPadKey) => void,
    ): void {
        for (let i = 0, y = 0; i < programData.length; i++) {
            const mapping = mappings[y];
            const data = programData[i];
            const mappedPadKey = new MappedPadKey(mapping, data, getBank(i), i);

            cb(mappedPadKey);

            this.soundData.push(mappedPadKey);

            if (y < mappings.length - 1) {
                y++;
            } else {
                y = 0;
            }
        }
    }

    public getData(currentBank: PadBankSelector): MappedPadKey[] {
        return this.soundData.filter((pad) => pad.bank === currentBank);
    }
}
