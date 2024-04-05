# create-mf-app

[![npm version](https://badge.fury.io/js/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app) [![npm version](https://img.shields.io/npm/dm/create-mf-app.svg)](https://badge.fury.io/js/create-mf-app)

Creates a Module Federation application, API server, or library based on one of multiple different templates.

## Usage

```
npx create-mf-app
```

These projects are not production complete. They are designed as lightweight projects that can be used to quickly prototype a new feature or library.

## Programmatic Questions

```
Pick the name of your app? (host)
```

Press ```enter``` for the default host directory. Type ```.``` for the current directory or type the name of the new directory.

```
Project Type: 
  > Application
    API Server
    Library
```

Chose the Application, API Server, or Library.

### Application

```
Port number: (8080)
```

Type a port number or press ```enter``` for the default port 8080.

```
Framework: (Use arrow keys)
    lit-html
    mithril
    preact
  > react
    react-esm
    solid-js
    svelte
    vanilla
    vue2
    vue3
    inferno
```

Chose desired framework.

```
Language:
  > typescript
    javascript
```

Chose your preferred programming language: javascript or typescript

```
CSS:
  > CSS
    Tailwind
```

Chose your desired form of styling. Tailwind will generate extra files.

### API Server

```
Port number: (8080)
```

Type a port number or press ```enter``` for the default port 8080.

```
Template:
  > express
    graphql-apollo
    graphql-nexus
    graphql-subscriptions
    nextjs-auth
    nextjs-todo
```

Select the desired API template.

### Library

A typescript file library will be automatically generated.

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
