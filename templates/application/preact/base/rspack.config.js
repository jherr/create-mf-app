const rspack = require('@rspack/core')
const refreshPlugin = require('@rspack/plugin-react-refresh')
const isDev = process.env.NODE_ENV === 'development'
const path = require('path');

const printCompilationMessage = require('./compilation.config.js');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.{{LANGEXT}}',
  },
  experiments: {
    rspackFuture: {
      disableTransformByDefault: true,
    },
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

  resolve: {
    extensions: ['.js','.jsx','.ts','.tsx','.json']
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
        type: 'css',
      },
      {
        test: /\.(js|jsx)$/,
        loader: "builtin:swc-loader",
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "ecmascript",
              jsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                importSource: 'preact'
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "builtin:swc-loader",
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
              jsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                importSource: 'preact'
              },
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new rspack.container.ModuleFederationPlugin({
      name: '{{SAFE_NAME}}',
      filename: 'remoteEntry.js',
      exposes: {},
      shared: {
      },
    }),
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
}
