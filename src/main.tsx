import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/style.css";
import "./styles/base.css";
import "./styles/components.css";
import "./assets/fonts/fonts.css"

import { HashRouter } from "react-router-dom";
import { loader } from "@monaco-editor/react";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === "json") {
            return new jsonWorker()
        }
        if (label === "css" || label === "scss" || label === "less") {
            return new cssWorker()
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return new htmlWorker()
        }
        if (label === "typescript" || label === "javascript") {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

loader.config({ monaco });

loader.init().then(/* ... */);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <HashRouter basename={"/"}>
            <App/>
        </HashRouter>
    </React.StrictMode>
);
