import { render, Component } from "inferno";

import "./index.{{CSS_EXTENSION}}";

class MyComponent extends Component {
  render() {
    return (
      <div class="{{CONTAINER}}">
        <div>Host: {{ NAME }}</div>
        <div>Framework: {{ FRAMEWORK }}</div>
        <div>Language: {{ LANGUAGE }}</div>
        <div>CSS: {{ CSS }}</div>
      </div>
    );
  }
}

render(<MyComponent />, document.getElementById("app"));
