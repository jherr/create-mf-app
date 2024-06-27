const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

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
        test: /\.m?js/,
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
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  target: "es2020",
  experiments: {
    outputModule: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "{{SAFE_NAME}}",
      library: { type: "module" },
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./index.ejs",
      inject: false,
    }),
    new Dotenv()
  ],
});
