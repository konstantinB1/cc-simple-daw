import "@webcomponents/scoped-custom-element-registry";

import "./components/Slider";
import "./components/MpcButton";
import "./components/Select";
import "./components/Icon";
import "./components/IconButton";
import "./components/CardSubHeader";
import "./components/AnchorElement";
import "./components/Menu";
import "./components/Text";
import "./components/NestedMenu";
import "./components/Tooltip";

import "@/modules/navigation/TopNav";

import "./modules/panels/sampler/Sampler";
import "./modules/panels/basic-keyboard/BasicKeyboard";

import "./App";

function main() {
    console.log("Initializing the app...");
    const element: App = document.createElement("root-app", {
        is: "root-app",
    });

    document.body.appendChild(element);
}

import type { App } from "./App";

main();
