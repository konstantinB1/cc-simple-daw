import { padKeys } from "@/constants";
import type { KeyMapping } from "@/lib/KeyManager";
import type { AudioFile } from "@/lib/ProgramManager";

export const PADS_PER_BANK = padKeys.length;

export enum PadBankSelector {
    A,
    B,
    C,
    D,
}

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

    public getFromBank(currentBank: PadBankSelector): MappedPadKey[] {
        return this.soundData.filter((pad) => pad.bank === currentBank);
    }

    public static next(currentBank: PadBankSelector): PadBankSelector {
        if (currentBank === PadBankSelector.A) {
            return PadBankSelector.B;
        } else if (currentBank === PadBankSelector.B) {
            return PadBankSelector.C;
        } else if (
            currentBank === PadBankSelector.C ||
            currentBank === PadBankSelector.D
        ) {
            return PadBankSelector.D;
        }

        return PadBankSelector.A;
    }

    public static previous(currentBank: PadBankSelector): PadBankSelector {
        if (currentBank === PadBankSelector.A) {
            return PadBankSelector.A;
        } else if (currentBank === PadBankSelector.B) {
            return PadBankSelector.A;
        } else if (currentBank === PadBankSelector.C) {
            return PadBankSelector.B;
        } else if (currentBank === PadBankSelector.D) {
            return PadBankSelector.C;
        }

        return PadBankSelector.A;
    }
}
