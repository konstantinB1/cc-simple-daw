import type { ReactiveController, ReactiveControllerHost } from "lit";

export default class TracksController implements ReactiveController {
    host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        this.host = host;
        host.addController(this);
    }

    hostConnected(): void {
        // Initialize playback context or any other setup needed when the host connects
        console.log("PlaybackController connected");
    }
}
