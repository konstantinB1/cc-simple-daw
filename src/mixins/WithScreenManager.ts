import screenManagerContext from "@/context/screenManagerContext";
import type PanelScreenManager from "@/lib/PanelScreenManager";
import type { Constructor } from "@/utils/types";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

const WithScreenManager = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class PlaybackContextConsumer extends superClass {
        @consume({ context: screenManagerContext, subscribe: true })
        @state()
        protected screenManager!: PanelScreenManager;
    }

    return PlaybackContextConsumer as unknown as T &
        Constructor<PlaybackContextConsumer>;
};

export default WithScreenManager;
