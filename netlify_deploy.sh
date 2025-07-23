#!/bin/bash
# Netlifyデプロイスクリプト

# 1. ログアウトして再ログイン
echo "Netlifyからログアウトします..."
npx netlify logout
echo "Netlifyに再ログインします..."
npx netlify login

# 2. プロジェクトをビルド
echo "プロジェクトをビルドします..."
npm run build

# 3. Netlifyにデプロイ
echo "Netlifyにデプロイします..."
npx netlify deploy --prod --dir=build
