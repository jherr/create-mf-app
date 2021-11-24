# create-mf-app
[![npm version](https://badge.fury.io/js/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app) [![npm version](https://img.shields.io/npm/dm/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app)

Creates a Module Federation application, API server, or library based on one of multiple different templates.


## Usage
```
npx create-mf-app
```

These projects are not production complete. They are designed as lightweight projects that can be used to quickly prototype a new feature or library.

## Programmatic Usage

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
