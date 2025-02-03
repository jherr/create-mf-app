import { html, render } from "lit-html";

import "./index.css";

const myTemplate = html`<div class="{{CONTAINER}}">
  <div>Name: {{ NAME }}</div>
  <div>Framework: {{ FRAMEWORK }}</div>
</div>`;

render(myTemplate, document.getElementById("app"));
