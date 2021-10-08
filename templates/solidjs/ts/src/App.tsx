import { render } from "solid-js/web";

import "./index.{{CSS_EXTENSION}}";

const App = () => <div>Hi there, I'm SolidJS from Webpack 5.</div>;

render(App, document.getElementById("app"));
