if (window.location.pathname !== "/") {
    document.body.innerHTML += `<p style="text-align: center">Not found</p>`;
} else {
    document.body.innerHTML += `<root-app></root-app>`;
}

import "./App";
import "./components/MpcButton";
import "./components/Card";
import "./components/Pads";
import "./components/Pad";
import "./components/Program";
import "./components/Select";
import "./components/Main";
