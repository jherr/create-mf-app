import { render, Component } from "inferno";

import "./index.{{CSS_EXTENSION}}";

class MyComponent extends Component {
  render() {
    return <div>Hello from Inferno!</div>;
  }
}

render(<MyComponent />, document.getElementById("app"));
