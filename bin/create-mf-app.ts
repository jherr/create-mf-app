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

import { buildProject, Project, } from "../src";

function checkCancel (value: string | symbol) {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}

(async () => {
  intro("Create Module Federation App (create-mf-app) V2");

  const answers: Project = {
    name: "",
    type: "Application"
  };

  answers.name = (await text({
    message: "What is the name of your app?",
    placeholder: "my-awesome-app"
  })) as string;
  checkCancel(answers.name);

  answers.type = (await select({
    message: "Pick a project type.",
    options: [
      { value: "Application", label: "Application" },
      { value: "API Server", label: "API Server" },
      { value: "Library", label: "Library" }
    ]
  })) as typeof answers.type;

  checkCancel(answers.type);

  if (answers.type === "Application" || answers.type === "API Server") {
    const templates = fs
      .readdirSync(
        path.join(
          __dirname,
          answers.type === "Application"
            ? "../templates/application"
            : "../templates/server"
        )
      )
      .sort();

    const port = (await text({
      message: "Port number?",
      initialValue: "8080"
    })) as string;
    checkCancel(port);
    answers.port = Number(port);

    answers.framework = (await select({
      message: "Framework?",
      options: templates.map((template) => ({
        value: template,
        label: template
      })),
      initialValue: answers.type === "Application" ? "react" : "express"
    })) as string;
    checkCancel(answers.framework);

    if (answers.type === "Application") {
      answers.css = (await select({
        message: "CSS?",
        options: [
          { value: "CSS", label: "CSS" },
          { value: "Tailwind", label: "Tailwind" }
        ],
        initialValue: "Tailwind"
      })) as "CSS" | "Tailwind";
      checkCancel(answers.css);
    }
  }

  const s = spinner();
  s.start("Building project...");
  buildProject({
    ...answers
  });
  s.stop("Project built.");

  outro(`Your '${answers.name}' project is ready to go. Next steps:

cd ${answers.name}
npm install
npm start
`);
})();
