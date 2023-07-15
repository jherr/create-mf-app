# create-mf-app

[![npm version](https://badge.fury.io/js/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app) [![npm version](https://img.shields.io/npm/dm/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app)

Creates a Module Federation application, API server, or library based on one of multiple different templates.

## Usage

```
npx create-mf-app
```

These projects are not production complete. They are designed as lightweight projects that can be used to quickly prototype a new feature or library.

> Warning:
> In case of using the library to create an API Application, you could get the following error: 'ERR_UNHANDLED_REJECTION' when using `npx create-mf-app`.
> In those cases, you could add the exact version where this bug was fixed (1.0.18), so the command would be `npx create-mf-app@1.0.18`

## Programmatic Usage

```js
const { buildProject } = require('create-mf-app')

buildProject({
  type: 'Application',
  name: 'my-project',
  port: '8080',
  framework: 'react',
  language: 'typescript',
  css: 'Tailwind',
})
```
