const webpack = require('webpack')
const merge = require('webpack-merge')
const getBaseConf = require('./webpack.base.conf')
const path = require('path')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const Settings = require('../common/settings.js')
const config = require('./config.js')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

const cssLoader = {
  test: /\.css$/,
  oneOf: [
    // this applies to <style scoped></style> in Vue components
    // make scoped style inline to not affect contenthash
    {
      resourceQuery: /scoped/,
      use: [
        'vue-style-loader',
        'css-loader',
      ]
    },
    // this applies to .css file and <style></style> in Vue components
    {
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ]
    },
  ]
}

const stylusLoader = {
  test: /\.styl(us)?$/,
  oneOf: [
    // this applies to <template lang="stylus" scoped> in Vue components
    // make scoped style inline to not affect contenthash
    {
      resourceQuery: /scoped/,
      use: [
        'vue-style-loader',
        'css-loader',
        'stylus-loader',
      ]
    },
    // this applies to .styl(us) file and <template lang="stylus">
    {
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader',
      ]
    },
  ]
}

function getProdConf (params) {
  const {publicPath, prerender, multilang} = params

  const prodConf = {
    mode: 'production',
    module: {
      rules: [
        stylusLoader,
        cssLoader,
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
    ],
    optimization: {
      // https://github.com/webpack-contrib/mini-css-extract-plugin/tree/v0.4.4#minimizing-for-production
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      /*
      // split webpack runtime code into serperated runtime.[contenthash].js
      // https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
      runtimeChunk: {
        name: 'pages/' + params.name + '/runtime',
      },
      */
      // https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
      splitChunks: {
        minSize: 30000, // Minimum size, in bytes, for a chunk to be generated. default 30000
        // split node_modules into serperated vender.[contenthash].js
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'venders',
            chunks: 'all'
          }
        }
      }
    },
  }

  // HOSTALIAS is set on a1,a2,a3...
  if (process.env.HOSTALIAS) {
    console.log('HOSTALIAS=', process.env.HOSTALIAS)
    prodConf.devtool = '#eval-source-map'
  }

  // generate prerendered html with original html and replace it
  if (prerender) {
    if (multilang) {
      prodConf.plugins = prodConf.plugins.concat(Settings.SUPPORTED_LANGS.map(lang => {
        let htmlOutputPath = publicPath
        if (params.name === 'index') htmlOutputPath = '/'

        let langPath = '/' + lang
        if (lang === Settings.DEFAULT_LANG) langPath = '/'

        const outputFullPath = config.paths.publicRoot + langPath + htmlOutputPath + '/index.html'
        return new PrerenderSPAPlugin({
          indexPath: outputFullPath,
          staticDir: path.join(config.paths.build, env),
          outputDir: outputFullPath.substring(0, outputFullPath.lastIndexOf('/')),
          routes: [ '/' ],
          // Optional minification.
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true
          },
          renderer: new Renderer({
            renderAfterDocumentEvent: 'render-event',
            headless: false,
          })
        })
      }))
    } else {
      let htmlOutputPath = publicPath
      if (params.name === 'index') htmlOutputPath = '/'

      const outputFullPath = config.paths.publicRoot + htmlOutputPath + '/index.html'
      prodConf.plugins.push(new PrerenderSPAPlugin({
        indexPath: outputFullPath,
        staticDir: path.join(config.paths.build, env),
        outputDir: outputFullPath.substring(0, outputFullPath.lastIndexOf('/')),
        routes: [ '/' ],
        // Optional minification.
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true
        },
        renderer: new Renderer({
          renderAfterDocumentEvent: 'render-event',
          headless: false,
        })
      }))
    }
  }

  return merge(getBaseConf(params), prodConf)
}

module.exports = getProdConf
