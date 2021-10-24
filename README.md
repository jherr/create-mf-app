# create-mf-app

Creates a Module Federation applcation, API server, or library based on one of multiple different templates.

```
npx create-mf-app
```

These projects are not production complete. They are designed as lightweight projects that can be used to quickly prototype a new feature or library.

# Programmatic Usage

```js
const builder = require("create-mf-app");

builder({
  type: "Application",
  name: "my-project",
  port: "8080",
  framework: "react",
  language: "typescript",
  css: "Tailwind"
});
```
