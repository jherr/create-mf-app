const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

const deps = require("./package.json").dependencies;

const printCompilationMessage = (status, port) => {
  let messageColor, messageType, browserMessage

  switch (status) {
    case 'success':
      messageColor = '\x1b[32m'
      messageType = 'Compiled successfully!'
      browserMessage = 'You can now view'
      break
    case 'failure':
      messageColor = '\x1b[31m'
      messageType = 'Compilation Failed!'
      browserMessage = 'You can\'t now view'
      break
    case 'compiling':
      messageColor = '\x1b[94m'
      messageType = 'Compiling...'
      browserMessage = 'Compiling the'
      break
  }

  console.log(`\n\n
${messageColor}${messageType}\x1b[0m\n
${browserMessage} \x1b[1mRemote\x1b[0m in the browser.
${messageColor}${messageType}\x1b[0m\n
\x1b[1mLocal\x1b[0m:  http://localhost:\x1b[1m${port}\x1b[0m
\x1b[1mLocal\x1b[0m:  http://localhost:\x1b[1m${port}\x1b[0m\n\n
  `)
}

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:{{PORT}}/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },

  devServer: {
    port: {{PORT}},
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    }
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      },
      {
        test: /\.(m?js|ts)/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  mode,

  plugins: [
    new ModuleFederationPlugin({
      name: "{{SAFE_NAME}}",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        "solid-js": {
          singleton: true,
          requiredVersion: deps["solid-js"],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],
  devtool: prod ? false : "source-map",
});
