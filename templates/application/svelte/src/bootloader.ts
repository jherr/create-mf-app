import App from "./App.svelte";

import "./index.css";

const app = new App({
  target: document.getElementById("app"),
});

window.app = app;

export default app;
