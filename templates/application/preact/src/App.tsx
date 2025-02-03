import { render, h } from "preact";

import "./index.css";

const App = () => (
  <div class="{{CONTAINER}}">
    <div>Name: {{ NAME }}</div>
    <div>Framework: {{ FRAMEWORK }}</div>
  </div>
);

render(<App />, document.getElementById("app"));
