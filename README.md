# create-mf-app

[![npm version](https://badge.fury.io/js/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app) [![npm version](https://img.shields.io/npm/dm/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app)

Creates a Module Federation application, API server, or library based on one of multiple different templates.

## Usage

```shell
npx create-mf-app
```

These projects are not production complete. They are designed as lightweight projects that can be used to quickly prototype a new feature or library.

## CLI Usage

Without any arguments, the CLI will prompt you for the information required to create the project.

```shell
npx create-mf-app@latest
```

You can also get help for the CLI for the options available.

```shell
npx create-mf-app@latest --help
```

You can create an application using CLI options:

```shell
npx create-mf-app@latest --name my-remote --port 8080 --css Tailwind --template react-19
```

Shorthand versions of each option are also available:

```shell
npx create-mf-app@latest -n my-remote -p 8080 -c Tailwind -t react-19
```

## Programmatic Usage

```js
const { buildProject } = require("create-mf-app");

buildProject({
  type: "Application",
  name: "my-remote",
  port: "8080",
  framework: "react-19",
  css: "Tailwind",
});
```
