import App from "./App.svelte";

import "./index.{{CSS_EXTENSION}}";

const app = new App({
  target: document.getElementById("app"),
});

window.app = app;

export default app;
