# create-mf-app

Creates a Module Federation applcation based on one of multiple different templates.

```
npx create-mf-app
```

# Programmatic Usage

```js
const builder = require("create-mf-app");

builder({
  name: "my-project",
  port: "8080",
  framework: "react",
  language: "typescript",
  css: "Tailwind"
});
```
