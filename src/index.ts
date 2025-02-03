import util from "util";
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";

export type Project = {
  framework?: string;
  css?: "CSS" | "Tailwind";
  port?: number;
  name: string;
  type: "Application" | "Library" | "API Server";
};

type Profiler = {
  NAME: string;
  FRAMEWORK: string | undefined;
  SAFE_NAME: string;
  PORT?: number;
  CSS?: "Tailwind" | "Empty CSS";
  CONTAINER?: string;
};

const ncp = util.promisify(require("ncp").ncp);

const templateFile = (fileName: string, replacements: Profiler) => {
  const fileContent = fs.readFileSync(fileName, "utf8").toString();

  const template = Object.entries(replacements).reduce((acc, [key, value]) => {
    return acc.replace(
      new RegExp(`({{${key}}}|{{ ${key} }})`, "g"),
      value?.toString() ?? ""
    );
  }, fileContent);
  fs.writeFileSync(fileName, template);
};

// required for npm publish
const renameGitignore = (projectName: string) => {
  if (fs.existsSync(path.normalize(`${projectName}/gitignore`))) {
    fs.renameSync(
      path.normalize(`${projectName}/gitignore`),
      path.normalize(`${projectName}/.gitignore`)
    );
  }
};

const buildProfiler = ({
  type,
  framework,
  name,
  css,
  port,
}: Project) => {
  const profiler: Profiler = {
    NAME: name,
    FRAMEWORK: framework,
    SAFE_NAME: name.replace(/-/g, "_").trim()
  };

  if (type === "API Server" || type === "Application") {
    profiler.PORT = port;
  }

  if (type === "Application") {
    const isTailwind = css === "Tailwind";
    profiler.CONTAINER = isTailwind
      ? "mt-10 text-3xl mx-auto max-w-6xl"
      : "container";
    profiler.CSS = isTailwind ? "Tailwind" : "Empty CSS";
  }
  return profiler;
};

export const buildProject = async (project: Project) => {
  const { name, framework, type } = project;
  const tempDir = type.toLowerCase();
  const profiler = buildProfiler(project);

  let packageJSON: Record<string, any> = {
    devDependencies: {}
  };

  switch (type) {
    case "Library":
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/typescript`),
        project.name
      );
      break;

    case "API Server":
      await ncp(path.join(__dirname, `../templates/server/${framework}`), name);
      break;
    case "Application":
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/${framework}`),
        name
      );

      if (project.css === "Tailwind") {
        await ncp(
          path.join(__dirname, "../templates/application-extras/tailwind"),
          name
        );
        packageJSON.devDependencies.tailwindcss = "^3.4.1";
      }

      const pkg = fs.readFileSync(
        path.join(name, "package.json"),
        "utf8"
      );
      packageJSON = JSON.parse(pkg);

      fs.writeFileSync(
        path.join(name, "package.json"),
        JSON.stringify(packageJSON, null, 2)
      );

      break;
  }

  renameGitignore(name);

  const files = glob.sync(`${name}/**/*`);
  for (const file of files) {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, profiler);
    }
  }
};
