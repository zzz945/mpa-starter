# Description

> An newest advanced full feature multi-page website starter

## Features
1. webpack@4.2.0
2. babel 7 with preset-env(using browserslist for browser compatibility)
3. pug(for vue template and html template)
4. vue@2.5.7
5. stylus(stylus -> postcss)
6. postcss with autoprefixer,preset-env(using browserslist for browser compatibility)
7. multiple pages
8. specify one or multiple page(s) for development(production) to speed up your work flow
9. hmr for everything
10. element-ui@2.4.8
11. axios@0.18.0
12. mock data
13. a bunch of solutions......

## Build Setup

``` bash
# download repo
git clone https://github.com/lingobus/mpa-starter.git

# install dependencies
yarn or npm install

# serve all pages with hot reload
npm start

# build all pages for production
npm run release

# specify one page
PAGE=login npm start
PAGE=login npm run release

# you can specify multiple pages with ',' as seperator
PAGE=index,login,register npm start
PAGE=index,login,register npm run release

```

## Explaination about webpack output
1. pages/[name]/index.[contenthash].js: main js bundle
2. pages/[name]/venders.[contenthash].js: node_modules dependences
3. pages/[name]/index.[contenthash].css: imported *.styl,*.css and `<style></style>` in vue
4. `<style scoped></style>` in vue is injected to html because html element attribute like `data-v-2a8bbda4` generated by vue-loader changes by every build and we don't want it to change css file's [contenthash]
5. common/lib/* is imported with `<script src='*' />` in html template, so they has no relation with webpack. So puting large dependence in  common/lib/ can speed up webpack compilation but may bring in compatibility problems. (Using webpack with browserslist's ecosystem for everything seems to be best practice.)
6. pages/[name]/[module-name].[contenthash].js: `import(/* webpackChunkName: "pages/dynamic-import/async-component" */'./async-component.vue')` will generate pages/dynamic-import/async-component.js

## Analysis bundle of a single page
https://webpack.js.org/guides/code-splitting/#bundle-analysis
```bash
# generate build/prod/compilation-stats.json
PAGE=register npm run release
# analysis with https://github.com/webpack-contrib/webpack-bundle-analyzer
npm run analyzer
```

## File naming note
- common components and assets are placed under `src/commom` directory，page related code are placed under `src/pages` directory，page entry must be `src/pages/[name]/index.js` or `src/pages/[name]/${locale}/index.js`, page template must be `src/pages/[name]/index.pug` or `src/pages/[name]/${locale}/index.pug`.
- `/src/js/common/lib` hold external assets for sharing with multiple pages.

## Asset import note
in styl
```
background: url('~@/img/common@2x.png')
background: url('./img/banner@2x.png')
```

in vue
```
img(src='@/img/common@2x.png')
img(src='./img/banner@2x.png')

background: url('~@/img/common@2x.png')
background: url('./img/banner@2x.png')
```

in pug
```
img(src=require('@/img/common/@2x.png'))
img(src=require('./img/banner@2x.png'))
```