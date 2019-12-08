/* eslint-disable */
const {readdirSync} = require('fs');
const NodeExternals = require('webpack-node-externals');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

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
      name: `@mathrix-education/${name}`
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
