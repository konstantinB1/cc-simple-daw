if (window.location.pathname !== "/") {
    throw new Error("Invalid path");
} else {
    document.body.innerHTML += `<root-app></root-app>`;
}

import "./App";
import "./components/Pads";
import "./components/Pad";
import "./components/Program";
import "./components/Select";
