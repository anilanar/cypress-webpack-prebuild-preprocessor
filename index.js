const cyConfig = require("./cypress.config.js");
const glob = require("fast-glob");
const webpack = require("webpack");

async function prebuild(webpackConfig) {
  const pattern = cyConfig.component.specPattern;

  const entries = await glob(pattern);

  /**
   * @type import('webpack').Configuration
   */
  const newConfig = {
    ...webpackConfig,
    entry: entries,
  };

  const compilation = webpack(newConfig, onBuildDone);
}

function onBuildDone(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  // Log result...
}

prebuild({
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
});
