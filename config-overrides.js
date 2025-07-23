const webpack = require('webpack');

module.exports = function override(config, env) {
  // Node.jsコアモジュールのポリフィルを追加
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer/"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "crypto": require.resolve("crypto-browserify"),
    "path": require.resolve("path-browserify"),
    "url": require.resolve("url/"),
    "querystring": require.resolve("querystring-es3"),
    "https": require.resolve("https-browserify"),
    "http": require.resolve("stream-http"),
    "os": require.resolve("os-browserify/browser"),
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/"),
    "process": require.resolve("process/browser"),
    "fs": false,
    "child_process": false,
    "net": false,
    "tls": false,
    "http2": require.resolve('./src/mocks/http2.js'),
    "events": require.resolve("events/"),
  };

  // node: プロトコルの問題を解決
  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /node:/,
        loader: 'string-replace-loader',
        options: {
          search: 'node:',
          replace: '',
        },
      },
    ],
  };

  // プラグインを追加
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // process.stdoutとprocess.stderrのモックを追加
    new webpack.DefinePlugin({
      'process.stdout': JSON.stringify({
        isTTY: false,
        columns: 80,
        write: () => {}
      }),
      'process.stderr': JSON.stringify({
        isTTY: false,
        write: () => {}
      })
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node:(.+)$/,
      (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        resource.request = mod;
      }
    ),
    // googleapis-commonライブラリのHTTP/2機能を無効化
    new webpack.NormalModuleReplacementPlugin(
      /googleapis-common\/build\/src\/http2\.js$/,
      (resource) => {
        resource.request = require.resolve('./src/mocks/http2.js');
      }
    ),
    // googleapis-commonライブラリのapirequest.jsでHTTP/2の使用を無効化
    new webpack.NormalModuleReplacementPlugin(
      /googleapis-common\/build\/src\/apirequest\.js$/,
      (resource) => {
        // 元のファイルを読み込む前に、useHttp2をfalseに設定する
        webpack.ProvidePlugin.getModule = () => {
          return `
            const originalModule = require('${resource.request}');
            const patch = require('./src/patches/googleapis-common-patch.js');
            // HTTP/2の使用を無効化
            originalModule.useHttp2 = patch.useHttp2;
            originalModule.isHttp2Disabled = patch.isHttp2Disabled;
            module.exports = originalModule;
          `;
        };
      }
    )
  );

  return config;
};
