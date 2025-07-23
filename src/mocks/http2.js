/**
 * googleapis-commonライブラリ用のHTTP/2モック
 */

// モック定数
const HTTP2_HEADER_PATH = ':path';
const HTTP2_HEADER_STATUS = ':status';
const HTTP2_HEADER_METHOD = ':method';
const HTTP2_HEADER_AUTHORITY = ':authority';
const HTTP2_HEADER_HOST = 'host';
const HTTP2_HEADER_CONTENT_TYPE = 'content-type';
const HTTP2_HEADER_CONTENT_LENGTH = 'content-length';
const HTTP2_HEADER_CONTENT_ENCODING = 'content-encoding';
const HTTP2_HEADER_ACCEPT_ENCODING = 'accept-encoding';
const HTTP2_HEADER_ACCEPT = 'accept';
const HTTP2_HEADER_USER_AGENT = 'user-agent';
const HTTP2_HEADER_AUTHORIZATION = 'authorization';

// googleapis-commonが使用する定数をエクスポート
module.exports = {
  constants: {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_AUTHORITY,
    HTTP2_HEADER_HOST,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_ENCODING,
    HTTP2_HEADER_ACCEPT_ENCODING,
    HTTP2_HEADER_ACCEPT,
    HTTP2_HEADER_USER_AGENT,
    HTTP2_HEADER_AUTHORIZATION
  },
  connect: () => {
    return {
      request: () => {
        throw new Error('HTTP/2 is not supported in the browser environment');
      },
      destroy: () => {}
    };
  }
};
