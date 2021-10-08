import { render, h } from "preact";

import "./index.{{CSS_EXTENSION}}";

const App = () => <div>Hi there, I'm Preact from Webpack 5.</div>;

render(<App />, document.getElementById("app"));
