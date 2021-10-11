import { render, h } from "preact";

import "./index.{{CSS_EXTENSION}}";

const App = () => (
  <div class="{{CONTAINER}}">
    <div>Host: {{ NAME }}</div>
    <div>Framework: {{ FRAMEWORK }}</div>
    <div>Language: {{ LANGUAGE }}</div>
    <div>CSS: {{ CSS }}</div>
  </div>
);
render(<App />, document.getElementById("app"));
