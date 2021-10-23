#!/usr/bin/env node
const inquirer = require("inquirer");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

const builder = require("../src/index");

const templates = fs.readdirSync(path.join(__dirname, "../templates")).sort();

inquirer
  .prompt([
    {
      type: "input",
      message: "Pick the name of your app:",
      name: "name",
      default: "host",
    },
    {
      type: "input",
      message: "Port number:",
      name: "port",
      default: "8080",
    },
    {
      type: "list",
      message: "Framework:",
      name: "framework",
      choices: templates,
      default: "react",
    },
    {
      type: "list",
      message: "Language:",
      name: "language",
      choices: ["typescript", "javascript"],
      default: "javascript",
    },
    {
      type: "list",
      message: "CSS:",
      name: "css",
      choices: ["CSS", "Tailwind"],
      default: "CSS",
    },
  ])
  .then((answer) => {
    builder(answer);

    shell.cd(answer.name);
    shell.echo(`Your app '${answer.name}' is ready to go.

Next steps:

▶️ cd ${answer.name}
▶️ npm install
▶️ npm start
`);
  });
