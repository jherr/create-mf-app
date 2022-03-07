const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;

const mf_config = {
  name: "{{SAFE_NAME}}",
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
};

module.exports = (env) => {
  const prod = env.production;

  return {
    output: {
      publicPath: "http://localhost:{{PORT}}/",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    devServer: {
      port: {{PORT}},
      historyApiFallback: true,
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
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      ...(prod ? [new ModuleFederationPlugin(mf_config)] : [])
    ],
  }
};
