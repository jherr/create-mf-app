import { Slim } from "slim-js";

import "./index.{{CSS_EXTENSION}}";

class HelloWorld extends Slim {
  constructor() {
    super();
  }
}
HelloWorld.useShadow = false;

Slim.element(
  "hello-world",
  `
    <div>Hello, from slim-js!</div>
  `,
  HelloWorld
);
