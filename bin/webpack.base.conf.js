const webpack = require('webpack')
const path = require('path')
const config = require('./config.js')
const Settings = require('../common/settings.js')
const utils = require('./utils.js')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

function getImageLoader (context) {
  return {
    test: config.imgReg,
    loader: 'url-loader',
    query: {
      context,
      limit: 10000,
      // url-loader(use file-loader inside) hash means contenthash: https://github.com/webpack-contrib/file-loader/issues/177
      name: env === 'dev' ? '[path][name].[ext]' : `[path][name].[hash:${config.imgHashLength}].[ext]`
    }
  }
}

function getFontLoader (context) {
  return {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 10000,
      context,
      // url-loader(use file-loader inside) hash means contenthash: https://github.com/webpack-contrib/file-loader/issues/177
      name: env === 'dev' ? '[path][name].[ext]' : `[path][name].[hash:${config.imgHashLength}].[ext]`
    }
  }
}

const vueLoader = {
  test: /\.vue$/,
  loader: 'vue-loader'
}

const jsLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  include: config.paths.src,
  query: {
    cacheDirectory: path.resolve(config.paths.build, 'tmp')
  }
}

const pugLoader = {
  test: /\.pug$/,
  oneOf: [
    // this applies to <template lang="pug"> in Vue components
    {
      resourceQuery: /^\?vue/,
      use: ['pug-plain-loader']
    },
    // this applies to pug template file
    {
      use: ['pug-loader']
    },
  ]
}

function getBaseConf (params) {
  const {name, js, jsName, pug, publicPath, pageSrcDir, multilang} = params
  const jsFullPath = path.join(pageSrcDir, js)
  const pugFullPath = path.join(pageSrcDir, pug)

  const entry = {}
  entry[jsName] = [jsFullPath]

  const c = {
    name,
    target: 'web',
    context: config.paths.root,
    output: {
      path: config.paths.publicRoot + publicPath,
      filename: env == 'dev' ? '[name].js' : '[name].[contenthash].js',
      publicPath,
    },
    entry,
    externals: config.externals,
    resolve: {
      alias: config.alias
    },
    module: {
      rules: [getImageLoader(pageSrcDir), getFontLoader(config.paths.src), jsLoader, vueLoader, pugLoader]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([
        {
          from: path.join(config.paths.src, 'common/lib'),
          to: path.join(config.paths.assetsRoot, 'common/lib'),
        },
        {
          from: path.join(config.paths.src, 'common/fonts'),
          to: path.join(config.paths.assetsRoot, 'common/fonts'),
        }
      ])
    ]
  }

  if (multilang) {
    // generate one html per language
    c.plugins = c.plugins.concat(Settings.SUPPORTED_LANGS.map(lang => {
      let htmlOutputPath = publicPath
      if (params.name === 'index') htmlOutputPath = '/'

      let langPath = '/' + lang
      if (lang === Settings.DEFAULT_LANG) langPath = '/'

      const outputFullPath = config.paths.publicRoot + langPath + htmlOutputPath + '/index.html'
      return new HtmlWebpackPlugin({
        filename: outputFullPath,
        template: pugFullPath,
        alwaysWriteToDisk: true,
        templateParameters: {
          ...Settings.DEFAULT_SEO,
          locale: utils.formatLocale(lang),
          env,
        }
      })
    }))
  } else {
    let htmlOutputPath = publicPath
    if (params.name === 'index') htmlOutputPath = '/'
    const outputFullPath = config.paths.publicRoot + htmlOutputPath + '/index.html'
    c.plugins.push(new HtmlWebpackPlugin({
      filename: outputFullPath,
      template: pugFullPath,
      alwaysWriteToDisk: true,
      templateParameters: {
        ...Settings.DEFAULT_SEO,
        locale: utils.formatLocale(params.lang || Settings.DEFAULT_LANG),
        env,
      }
    }))
  }


  return c
}

module.exports = getBaseConf
