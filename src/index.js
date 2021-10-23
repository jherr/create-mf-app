const util = require("util");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const ncp = util.promisify(require("ncp").ncp);

const templateFile = (fileName, replacements) => {
  let contents = fs.readFileSync(fileName, "utf8").toString();
  Object.keys(replacements).forEach((key) => {
    contents = contents.replace(
      new RegExp(`(\{\{${key}\}\}|\{\{ ${key} \}\})`, "g"),
      replacements[key]
    );
  });
  fs.writeFileSync(fileName, contents);
};

// Options:
//   - name: Name of the project
//   - framework: Name of the framework
//   - language: Language of the project
//   - css: CSS framework
//   - port: Port to run the project on

module.exports = async ({ language, framework, name, css, port }) => {
  const lang = language === "typescript" ? "ts" : "js";
  const tailwind = css === "Tailwind";

  await ncp(path.join(__dirname, `../templates/${framework}/base`), name);
  await ncp(path.join(__dirname, `../templates/${framework}/${lang}`), name);

  const replacements = {
    NAME: name,
    FRAMEWORK: framework,
    PORT: port,
    SAFE_NAME: name.replace(/-/g, "_").trim(),
    CSS_EXTENSION: tailwind ? "scss" : "css",
    LANGUAGE: language === "typescript" ? "TypeScript" : "JavaScript",
    CSS: tailwind ? "Tailwind" : "Empty CSS",
    CONTAINER: tailwind ? "mt-10 text-3xl mx-auto max-w-6xl" : "container",
  };

  if (tailwind) {
    fs.rmSync(path.join(name, "/src/index.css"));

    await ncp(path.join(__dirname, "../extras/tailwind"), name);

    const packageJSON = JSON.parse(
      fs.readFileSync(path.join(name, "package.json"), "utf8")
    );
    packageJSON.devDependencies.tailwindcss = "^2.0.2";
    fs.writeFileSync(
      path.join(name, "package.json"),
      JSON.stringify(packageJSON, null, 2)
    );
  }

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, replacements);
    }
  });
};
