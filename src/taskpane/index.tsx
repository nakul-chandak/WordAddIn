import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { ToastProvider } from "../context/toastContext";

/* global document, Office, module, require */

const title = "Contoso Task Pane Add-in";

const rootElement: HTMLElement = document.getElementById("container");
const root = createRoot(rootElement);

/* Render application after Office initializes */
Office.onReady(() => {
  root.render(
    <FluentProvider theme={webLightTheme}>
      <ToastProvider>
        <App title={title} />
      </ToastProvider>
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}
