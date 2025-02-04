#!/usr/bin/env node
import {
  intro,
  outro,
  text,
  isCancel,
  cancel,
  select,
  spinner,
} from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";

import { buildProject, Project } from "../src";

const applicationTemplates = fs
  .readdirSync(path.join(__dirname, "../templates/application"))
  .sort();

const serverTemplates = fs
  .readdirSync(path.join(__dirname, "../templates/server"))
  .sort();

const templates = [
  ...applicationTemplates.map((t) => ({
    framework: t,
    type: "Application",
  })),
  ...serverTemplates.map((t) => ({
    framework: t,
    type: "Server",
  })),
  {
    framework: "library",
    type: "Library",
  },
];

program
  .option("-n, --name <name>", "The name of the project")
  .option(
    "-t, --template <template>",
    `The template to use (${templates.map((t) => t.framework).join(", ")})`
  )
  .option("-p, --port <number>", "The port to use")
  .option("-c, --css <css>", "The CSS framework to use (CSS or Tailwind)")
  .option("-z", "--withZephyr", "Add deploy withZephyr")
  .option("-h, --help", "Help");

program.parse();

const options = program.opts();

if (options.help) {
  program.outputHelp();
  process.exit(0);
}

if (options.template) {
  const template = templates.find((t) => t.framework === options.template);
  if (!template) {
    console.log(`Invalid template: ${options.template}`);
    process.exit(1);
  }
  options.type = template.type;
  options.framework = template.framework;
}

function checkCancel(value: string | symbol) {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}

(async () => {
  intro("Create Module Federation App (create-mf-app) V2");

  const answers: Project = {
    name: "",
    type: "Application",
  };

  if (options.name) {
    answers.name = options.name;
  } else {
    answers.name = (await text({
      message: "What is the name of your app?",
      placeholder: "my-awesome-app",
    })) as string;
    checkCancel(answers.name);
  }

  if (options.type) {
    answers.type = options.type;
  } else {
    answers.type = (await select({
      message: "Pick a project type.",
      options: [
        { value: "Application", label: "Application" },
        { value: "API", label: "API" },
        { value: "Library", label: "Library" },
      ],
    })) as typeof answers.type;
    checkCancel(answers.type);
  }

  if (answers.type === "Application" || answers.type === "API") {
    const templates =
      answers.type === "Application" ? applicationTemplates : serverTemplates;

    if (options.port) {
      answers.port = Number(options.port);
    } else {
      const port = (await text({
        message: "Port number?",
        initialValue: "8080",
      })) as string;
      checkCancel(port);
      answers.port = Number(port);
    }

    if (options.framework) {
      answers.framework = options.framework;
    } else {
      answers.framework = (await select({
        message: "Framework?",
        options: templates.map((template) => ({
          value: template,
          label: template,
        })),
        initialValue: answers.type === "Application" ? "react-19" : "express",
      })) as string;
      checkCancel(answers.framework);
    }

    if (answers.type === "Application") {
      if (options.css) {
        answers.css = options.css;
      } else {
        answers.css = (await select({
          message: "CSS?",
          options: [
            { value: "CSS", label: "CSS" },
            { value: "Tailwind", label: "Tailwind" },
          ],
          initialValue: "Tailwind",
        })) as "CSS" | "Tailwind";
        checkCancel(answers.css);
      }

      if (
        answers.framework === "react-19" ||
        answers.framework === "react-18"
      ) {
        answers.withZephyr = (await select({
          message: "Add deploy withZephyr?",
          options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ],
          initialValue: true,
        })) as boolean;
      }
    }
  }

  const s = spinner();
  s.start("Building project...");
  buildProject({
    ...answers,
  });
  s.stop("Project built.");

  outro(`Your '${answers.name}' project is ready to go. Next steps:

cd ${answers.name}
pnpm i
pnpm start
`);
})();
