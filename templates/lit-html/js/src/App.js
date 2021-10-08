import { html, render } from "lit-html";

import "./index.{{CSS_EXTENSION}}";

const myTemplate = html`<div>Hello from lit-html</div>`;

render(myTemplate, document.getElementById("app"));
