module.exports = {
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    // React Hooksのルールを一時的に無効化
    "react-hooks/rules-of-hooks": "off",
    // 未定義変数エラーを無効化
    "no-undef": "off"
  }
};
