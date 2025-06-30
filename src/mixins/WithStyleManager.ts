import { stylesContext } from "@/context/stylesContext";
import type StyleManager from "@/utils/stylesheets";
import type { Constructor } from "@/utils/types";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

const WithStyleManager = <T extends Constructor<LitElement>>(superClass: T) => {
    class PlaybackContextConsumer extends superClass {
        @consume({ context: stylesContext, subscribe: true })
        @state()
        protected styleManager!: StyleManager;
    }

    return PlaybackContextConsumer as unknown as T &
        Constructor<PlaybackContextConsumer>;
};

export default WithStyleManager;
