import type { ReactiveController, ReactiveControllerHost } from "lit";

export default class PlaybackController implements ReactiveController {
    host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        this.host = host;
        this.host.addController(this);
    }

    hostConnected(): void {}
}
