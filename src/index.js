#!/usr/bin/env node
const inquirer = require("inquirer");
const shell = require("shelljs");
const util = require("util");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const ncp = util.promisify(require("ncp").ncp);

const templates = fs.readdirSync(path.join(__dirname, "../templates"));

const templateFile = (fileName, replacements) => {
  let contents = fs.readFileSync(fileName, "utf8").toString();
  Object.keys(replacements).forEach((key) => {
    contents = contents.replace(
      new RegExp(`\{\{${key}\}\}`, "g"),
      replacements[key]
    );
  });
  fs.writeFileSync(fileName, contents);
};

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
  .then(async (answer) => {
    const lang = answer.language === "typescript" ? "ts" : "js";
    const tailwind = answer.css === "Tailwind";

    await ncp(
      path.join(__dirname, `../templates/${answer.framework}/base`),
      answer.name
    );
    await ncp(
      path.join(__dirname, `../templates/${answer.framework}/${lang}`),
      answer.name
    );

    const replacements = {
      NAME: answer.name,
      PORT: answer.port,
      SAFE_NAME: answer.name.replace(/-/g, "_").trim(),
      CSS_EXTENSION: tailwind ? "scss" : "css",
    };

    if (tailwind) {
      fs.rmSync(path.join(answer.name, "/src/index.css"));

      await ncp(path.join(__dirname, "../extras/tailwind"), answer.name);

      const packageJSON = JSON.parse(
        fs.readFileSync(path.join(answer.name, "package.json"), "utf8")
      );
      packageJSON.devDependencies.tailwindcss = "^2.0.2";
      fs.writeFileSync(
        path.join(answer.name, "package.json"),
        JSON.stringify(packageJSON, null, 2)
      );
    }

    glob.sync(`${answer.name}/**/*`).forEach((file) => {
      if (fs.lstatSync(file).isFile()) {
        templateFile(file, replacements);
      }
    });

    shell.cd(answer.name);
    shell.echo(`Your app '${answer.name}' is ready to go.

Next steps:

▶️ cd ${answer.name}
▶️ npm install
▶️ npm start
`);
  });
