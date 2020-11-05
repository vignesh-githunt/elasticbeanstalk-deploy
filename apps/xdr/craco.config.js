/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { when, whenDev } = require('@craco/craco');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const minifyOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

function replacePlugin(plugins, nameMatcher, newPlugin) {
  const i = plugins.findIndex((plugin) => {
    return (
      plugin.constructor &&
      plugin.constructor.name &&
      nameMatcher(plugin.constructor.name)
    );
  });
  return i > -1
    ? plugins
        .slice(0, i)
        .concat(newPlugin || [])
        .concat(plugins.slice(i + 1))
    : plugins;
}

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      // Rewrite dist folder to where Nx expects it to be.
      const isEnvProduction = env === 'development';
      config.entry = {
        popup: paths.appIndexJs,
        options: paths.appSrc + '/options.js',
        background: paths.appSrc + '/background.ts',
        content: paths.appSrc + '/content.js',
      };
      config.output.filename = 'static/js/[name].js';
      config.optimization.splitChunks = {
        cacheGroups: { default: false },
      };
      config.optimization.runtimeChunk = false;

      // Custom HtmlWebpackPlugin instance for index (popup) page
      const indexHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        chunks: ['popup'],
        template: paths.appHtml,
        filename: 'popup.html',
        minify: isEnvProduction && minifyOpts,
      });
      // Replace origin HtmlWebpackPlugin instance in config.plugins with the above one
      config.plugins = replacePlugin(
        config.plugins,
        (name) => /HtmlWebpackPlugin/i.test(name),
        indexHtmlPlugin
      );

      // Extra HtmlWebpackPlugin instance for options page
      const optionsHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        chunks: ['options'],
        template: paths.appPublic + '/options.html',
        filename: 'options.html',
        minify: isEnvProduction && minifyOpts,
      });
      // Add the above HtmlWebpackPlugin instance into config.plugins
      // Note: you may remove/comment the next line if you don't need an options page
      config.plugins.push(optionsHtmlPlugin);
      // Custom ManifestPlugin instance to cast asset-manifest.json back to old plain format
      const manifestPlugin = new ManifestPlugin({
        fileName: 'asset-manifest.json',
      });
      // Replace origin ManifestPlugin instance in config.plugins with the above one
      config.plugins = replacePlugin(
        config.plugins,
        (name) => /ManifestPlugin/i.test(name),
        manifestPlugin
      );

      // Remove GenerateSW plugin from config.plugins to disable service worker generation
      config.plugins = replacePlugin(config.plugins, (name) =>
        /GenerateSW/i.test(name)
      );

      config.plugins.map((plugin) => {
        const options = plugin.options;
        if (!options) return;
        if (options.filename && options.filename.endsWith('.css')) {
          options.filename = '/static/css/[name].css';
        }
      });

      // Remove guard against importing modules outside of `src`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          mainFields: ['module', 'main'],
        })
      );

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules.forEach((r) => {
        if (r.oneOf) {
          const babelLoader = r.oneOf.find(
            (rr) => rr.loader.indexOf('babel-loader') !== -1
          );
          babelLoader.exclude = /node_modules/;
          delete babelLoader.include;
        }
      });

      config.mode = isEnvProduction ? 'production' : 'development';

      return config;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.writeToDisk = true;
    return devServerConfig;
  },
};
