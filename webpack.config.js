/* eslint-disable */
/**
 * Build the functions is a separate dist/[function-name] directories.
 * Due to the "mono-repo" aspect of the project, common files should be duplicated across all compiled
 * Google Cloud Function source code.
 * Moreover, since we do not want to bundle our dependencies a rely on the function package.json, a generated
 * package.json for each function is required.
 */
const {readdirSync} = require('fs');
const NodeExternals = require('webpack-node-externals');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

/**
 * The functions in the repo, which corresponds to the src/ directory content, excepting "common" directory.
 * @type {string[]}
 */
const functions = readdirSync(`${__dirname}/src`).filter(f => f !== 'common');

module.exports = functions.map(name => {
  return {
    mode: 'none', // We manage the webpack build mode ourselves
    target: 'node',
    entry: `./src/${name}/index.ts`,
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    externals: [NodeExternals()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [new GeneratePackageJsonPlugin({
      name: `@mathrix-education/${name}`,
      main: 'index.js'
    }, `${__dirname}/package.json`)],
    optimization: {
      minimize: false,
    },
    output: {
      path: `${__dirname}/dist/${name}`,
      filename: 'index.js',
    },
    devtool: 'inline-source-map'
  };
});
