const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { GenerateSW } = require('workbox-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const ResponsiveLoader = require('responsive-loader');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const rimraf = require('rimraf');

const pathsToPurge = glob.sync(
  path.resolve(__dirname, 'src/**/*.{js,jsx,ts,tsx,css,html}')
);

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      app: './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
            },
          },
        },
        {
          test: /\.(css)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'responsive-loader',
              options: {
                adapter: require('responsive-loader/sharp'),
                sizes: [320, 640, 960, 1280],
                name: 'images/[name].[hash].[ext]',
              },
            },
            {
              loader: 'imagemin-webpack-plugin',
              options: {
                test: /\.(jpe?g|png|gif|svg)$/i,
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
                jpegtran: {
                  progressive: true,
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      }),
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
            },
          },
        ],
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, 'public', 'favicon.png'),
        prefix: 'icons/',
        emitStats: false,
        statsFilename: 'iconstats.json',
        inject: true,
        background: '#fff',
        title: 'Preact Webpack App',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: true,
          favicons: true,
          firefox: true,
          opengraph: true,
          twitter: true,
          yandex: true,
          windows: true,
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
      }),
      isProduction &&
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        }),
      isProduction && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 9000,
      open: true,
      host: '0.0.0.0',
      allowedHosts: 'all',
      hot: true,
      historyApiFallback: true,
      compress: true,
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws',
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
  };
};
