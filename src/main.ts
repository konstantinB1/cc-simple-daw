if (window.location.pathname !== "/") {
    document.body.innerHTML += `<p style="text-align: center">Not found</p>`;
} else {
    document.body.innerHTML += `<root-app></root-app>`;
}
import "./components/Slider";
import "./components/MpcButton";
import "./components/Card";
import "./components/Select";
import "./components/Main";
import "./components/Icon";
import "./components/IconButton";

import "./modules/sampler/Pads";
import "./modules/recoder/Recorder";

import "./App";
