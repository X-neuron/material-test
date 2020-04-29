// const HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-disable */
// const webpack = require('webpack');
const path = require('path');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackbar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const safePostCssParser = require('postcss-safe-parser');
const postcssNormalize = require('postcss-normalize');



const BuildFolder = 'Build';
const SrcFolder = 'src';
const EntryJS = `${SrcFolder}/index.jsx`;
const HTMLTemplateFileName = 'index.html';
const HTMLTemplateFileFolder = `${SrcFolder}`;
const InputPublicFolder = `${SrcFolder}/public`;
const OutPutAssertFolder = `static/assert`;


module.exports = {
  module: {
    rules: [
      {
        // test: /\.(js|mjs|jsx|ts|tsx)$/,
        test: /\.(j|t)sx?$/,
        // test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,
              "presets": [["@babel/env", { "targets": { "node": 6 } }]],
              plugins: [
                'lodash',
                // '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-runtime'
              ]
            }
          },

        ]
      },
      {
        // test: /\.less$/i,

        test: /\.((c|le)ss)$/i,
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
        use: [

          // 'style-loader',
          // {
          //   loader: 'thread-loader',
          //   options: cssWorkerPool
          // },
          {
            loader: MiniCssExtractPlugin.loader
            // options: {
            //   hmr: process.env.NODE_ENV === 'development',
            // },
          },
          {
            loader: 'css-loader',
            options: {
              // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
              // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
              importLoaders: 3,
              // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
              modules: true
              // modules: {
              //   getLocalIdent: (loaderContext, localIdentName, localName, options) => {
              //     if (loaderContext.resourcePath.includes('src/')) {
              //       return localName;
              //     }
              //     return '[hash:base64:5]';
              //   }
              // }

              // esModule: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              ident: 'postcss',
              plugins: [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                }),
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                postcssNormalize()
              ]
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif|bmp)$/i,
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: OutPutAssertFolder,
            },

          }
        ]
      },

    ]
  },
  cache: true,
  entry: [
    // "core-js/modules/es6.promise",
    // "core-js/modules/es6.array.iterator",
    // path.resolve(__dirname, "src/index.js"),
    path.resolve(__dirname, EntryJS)
  ],
  output: {
    path: path.resolve(__dirname, BuildFolder),
    // filename: 'banble.js',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          // Added for profiling in devtools
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ]
  },
  plugins: [
    new webpackbar(),

    new HtmlWebpackPlugin({
      // filename: 'index.html', // 生成的html存放路径，相对于 output.path
      // template: path.join(__dirname, '/src/index.html'), //html模板路径
      filename: HTMLTemplateFileName, // 生成的html存放路径，相对于 output.path
      template: `${HTMLTemplateFileFolder}/${HTMLTemplateFileName}`, // html模板路径
      // hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
      inject: true, // 是否将js放在body的末尾
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),

  ]
};
