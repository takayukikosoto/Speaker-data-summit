#!/usr/bin/env node

/**
 * Supabaseデータベースの UTF-8 エンコーディング問題をスキャンするスクリプト
 * 
 * 使用方法:
 * 1. .env ファイルに REACT_APP_SUPABASE_URL と REACT_APP_SUPABASE_ANON_KEY を設定
 * 2. node scanSupabaseUtf8.js を実行
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase 接続情報
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('環境変数が設定されていません。.env ファイルに REACT_APP_SUPABASE_URL と REACT_APP_SUPABASE_ANON_KEY を設定してください。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// スキャンするテーブルとテキストカラムの定義
const tablesToScan = [
  { name: 'forms_sp', textColumns: ['category', 'title', 'description', 'formUrl', 'deadline'] },
  { name: 'downloads_sp', textColumns: ['category', 'title', 'description', 'fileUrl'] },
  { name: 'faqs_sp', textColumns: ['question', 'answer', 'category'] }
];

/**
 * 文字列内の無効なUTF-8文字を検出
 * @param {string} str - チェックする文字列
 * @returns {Array} - 問題のある文字とその位置の配列
 */
function findInvalidUtf8Characters(str) {
  if (str === null || str === undefined) return [];
  
  const issues = [];
  
  // 制御文字や特殊文字をチェック
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    
    // 制御文字（0-31, 127）を検出（改行、タブ、スペースを除く）
    if ((charCode < 32 && ![9, 10, 13].includes(charCode)) || charCode === 127) {
      issues.push({
        position: i,
        char: str[i],
        charCode: charCode,
        type: 'control'
      });
    }
    
    // サロゲートペアの不正な使用を検出
    if (charCode >= 0xD800 && charCode <= 0xDFFF) {
      // サロゲートペアの前半部分
      if (charCode <= 0xDBFF) {
        // 次の文字がサロゲートペアの後半部分でない場合
        if (i + 1 >= str.length || str.charCodeAt(i + 1) < 0xDC00 || str.charCodeAt(i + 1) > 0xDFFF) {
          issues.push({
            position: i,
            char: str[i],
            charCode: charCode,
            type: 'invalid_surrogate_pair'
          });
        }
      } 
      // サロゲートペアの後半部分が単独で使われている場合
      else if (i === 0 || str.charCodeAt(i - 1) < 0xD800 || str.charCodeAt(i - 1) > 0xDBFF) {
        issues.push({
          position: i,
          char: str[i],
          charCode: charCode,
          type: 'invalid_surrogate_pair'
        });
      }
    }
  }
  
  return issues;
}

/**
 * 文字列をUTF-8として安全な形に修正
 * @param {string} str - 修正する文字列
 * @returns {string} - 修正された文字列
 */
function sanitizeUtf8(str) {
  if (str === null || str === undefined) return '';
  
  try {
    // 制御文字を削除（改行、タブ、スペースを除く）
    let sanitized = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // 文字列を正規化（NFC形式）
    sanitized = sanitized.normalize('NFC');
    
    return sanitized;
  } catch (e) {
    console.error('UTF-8サニタイズエラー:', e);
    // エラーが発生した場合は安全のために空文字列を返す
    return '';
  }
}

/**
 * Supabaseのテーブルをスキャンして無効なUTF-8文字を検出
 * @param {string} tableName - スキャンするテーブル名
 * @param {Array} textColumns - チェックするテキストカラム名の配列
 * @returns {Promise<Array>} - 問題のあるレコードの配列
 */
async function scanTableForUtf8Issues(tableName, textColumns) {
  try {
    console.log(`テーブル ${tableName} をスキャン中...`);
    
    // テーブルからすべてのレコードを取得
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    
    console.log(`${data.length} レコードを取得しました`);
    
    const issuesFound = [];
    
    // 各レコードの指定されたテキストカラムをチェック
    data.forEach(record => {
      const recordIssues = { id: record.id, issues: {} };
      let hasIssues = false;
      
      textColumns.forEach(column => {
        if (record[column]) {
          const fieldIssues = findInvalidUtf8Characters(record[column]);
          if (fieldIssues.length > 0) {
            recordIssues.issues[column] = {
              originalValue: record[column],
              issues: fieldIssues,
              sanitizedValue: sanitizeUtf8(record[column])
            };
            hasIssues = true;
          }
        }
      });
      
      if (hasIssues) {
        issuesFound.push(recordIssues);
      }
    });
    
    return issuesFound;
  } catch (e) {
    console.error(`テーブル ${tableName} のスキャン中にエラーが発生しました:`, e);
    return [];
  }
}

/**
 * 問題のあるレコードを修正
 * @param {string} tableName - テーブル名
 * @param {Array} issues - 問題のあるレコード情報
 * @returns {Promise<void>}
 */
async function fixIssues(tableName, issues) {
  console.log(`テーブル ${tableName} の ${issues.length} レコードを修正中...`);
  
  for (const record of issues) {
    const updateData = {};
    
    Object.keys(record.issues).forEach(column => {
      updateData[column] = record.issues[column].sanitizedValue;
    });
    
    try {
      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', record.id);
      
      if (error) {
        console.error(`レコード ID: ${record.id} の更新中にエラーが発生しました:`, error);
      } else {
        console.log(`レコード ID: ${record.id} を修正しました`);
      }
    } catch (e) {
      console.error(`レコード ID: ${record.id} の更新中に例外が発生しました:`, e);
    }
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log('Supabaseデータベースの UTF-8 エンコーディング問題をスキャンします...');
  
  const allIssues = {};
  let totalIssues = 0;
  
  // 各テーブルをスキャン
  for (const table of tablesToScan) {
    const issues = await scanTableForUtf8Issues(table.name, table.textColumns);
    
    if (issues.length > 0) {
      allIssues[table.name] = issues;
      totalIssues += issues.length;
      console.log(`テーブル ${table.name} で ${issues.length} レコードに問題が見つかりました`);
    } else {
      console.log(`テーブル ${table.name} に問題は見つかりませんでした`);
    }
  }
  
  // 結果の出力
  console.log('\n===== スキャン結果 =====');
  console.log(`合計 ${totalIssues} レコードに UTF-8 エンコーディングの問題が見つかりました`);
  
  if (totalIssues > 0) {
    console.log('\n問題の詳細:');
    console.log(JSON.stringify(allIssues, null, 2));
    
    // 修正するかどうかの確認
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('これらの問題を自動的に修正しますか？ (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\n問題のあるレコードを修正しています...');
        
        for (const tableName in allIssues) {
          await fixIssues(tableName, allIssues[tableName]);
        }
        
        console.log('\n修正が完了しました');
      } else {
        console.log('\n修正をスキップしました。問題の詳細を確認して手動で修正してください。');
      }
      
      readline.close();
    });
  }
}

// スクリプトの実行
main().catch(error => {
  console.error('スクリプト実行中にエラーが発生しました:', error);
  process.exit(1);
});
