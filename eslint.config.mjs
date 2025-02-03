import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default {
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  files: ["bin/*.ts", "src/*.ts"],
  ignores: ["bin/*.js", "src/*.js", "templates", "node_modules"],
};
