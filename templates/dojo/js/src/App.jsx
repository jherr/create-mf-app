import { renderer, create, tsx } from "@dojo/framework/core/vdom";

import "./index.{{CSS_EXTENSION}}";

const factory = create();

const App = factory(function App() {
  return <div>{"Hello from Dojo"}</div>;
});

const r = renderer(() => <App />);
r.mount({ domNode: document.getElementById("app") });
