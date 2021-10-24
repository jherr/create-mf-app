#!/usr/bin/env node
const inquirer = require("inquirer");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

const builder = require("../src/index");

(async function () {
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Pick the name of your app:",
      name: "name",
      default: "host",
    },
    {
      type: "list",
      message: "Project Type:",
      name: "type",
      choices: ["Application", "API Server", "Library"],
      default: "Application",
    },
  ]);

  if (answers.type === "Library") {
    builder(answers);
  }

  if (answers.type === "API Server") {
    const templates = fs
      .readdirSync(path.join(__dirname, "../templates/server"))
      .sort();

    const serverAnswers = await inquirer.prompt([
      {
        type: "input",
        message: "Port number:",
        name: "port",
        default: "8080",
      },
      {
        type: "list",
        message: "Template:",
        name: "framework",
        choices: templates,
        default: "express",
      },
    ]);

    builder({
      ...answers,
      ...serverAnswers,
      type: "Server",
      language: "typescript",
    });
  }

  if (answers.type === "Application") {
    const templates = fs
      .readdirSync(path.join(__dirname, "../templates/application"))
      .sort();

    const appAnswers = await inquirer.prompt([
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
    ]);

    builder({
      ...answers,
      ...appAnswers,
    });
  }

  shell.cd(answers.name);
  shell.echo(`Your app '${answers.name}' is ready to go.

Next steps:

▶️ cd ${answers.name}
▶️ npm install
▶️ npm start
`);
})();
