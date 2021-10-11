import { html, render } from "lit-html";

import "./index.{{CSS_EXTENSION}}";

const myTemplate = html`<div class="{{CONTAINER}}">
  <div>Host: {{ NAME }}</div>
  <div>Framework: {{ FRAMEWORK }}</div>
  <div>Language: {{ LANGUAGE }}</div>
  <div>CSS: {{ CSS }}</div>
</div>`;

render(myTemplate, document.getElementById("app"));
