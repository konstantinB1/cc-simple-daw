import "./components/Slider";
import "./components/MpcButton";
import "./components/Select";
import "./components/Icon";
import "./components/IconButton";
import "./components/CardSubHeader";
import "./components/AnchorElement";
import "./components/Menu";
import "./components/Text";

import "@/modules/navigation/Navigation";

import "./modules/panels/sampler/Sampler";

import "./App";

function main() {
    const element: App = document.createElement("root-app", {
        is: "root-app",
    });

    document.body.appendChild(element);

    console.log(
        "App initialized. If you see this, the app is running correctly.",
    );
}

import type { App } from "./App";

main();
