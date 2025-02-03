module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "double"],
    "comma-dangle": ["error", {
      "arrays": "never",
      "objects": "never",
      "imports": "always",
      "exports": "never",
      "functions": "never"
  }]
},
}
