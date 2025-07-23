/**
 * googleapis-commonライブラリのHTTP/2機能を無効化するパッチ
 */

// HTTP/2の代わりにHTTPを使用するように設定
const useHttp2 = false;

// ブラウザ環境ではHTTP/2を使用しないようにする
const isHttp2Disabled = true;

module.exports = {
  useHttp2,
  isHttp2Disabled
};
