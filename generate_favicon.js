const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// PrimeNumberロゴの左側部分だけを切り取ってファビコンを生成する
async function generateFavicon() {
  try {
    // SVGをPNGに変換
    await sharp('./public/primenumber_logo.svg')
      .resize(512, 512)
      .toFile('./public/temp_logo.png');
    
    console.log('SVGをPNGに変換しました');
    
    // ファビコンサイズで出力
    const sizes = [16, 32, 48, 64, 128, 192, 256];
    
    for (const size of sizes) {
      await sharp('./public/temp_logo.png')
        .resize(size, size)
        .toFile(`./public/favicon-${size}x${size}.png`);
      console.log(`${size}x${size}のファビコンを生成しました`);
    }
    
    // favicon.icoを生成（32x32サイズ）
    await sharp('./public/favicon-32x32.png')
      .toFile('./public/favicon.ico');
    console.log('favicon.icoを生成しました');
    
    // 一時ファイルを削除
    fs.unlinkSync('./public/temp_logo.png');
    console.log('一時ファイルを削除しました');
    
    console.log('ファビコンの生成が完了しました！');
  } catch (error) {
    console.error('ファビコン生成中にエラーが発生しました:', error);
  }
}

generateFavicon();
