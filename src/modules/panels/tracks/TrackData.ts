export class TrackData {
    name: string;
    isSubTrack: boolean;

    constructor(name: string, isSubTrack: boolean = false) {
        this.name = name;
        this.isSubTrack = isSubTrack;
    }
}
