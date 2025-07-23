/**
 * UTF-8 検証・サニタイズスクリプト
 * Supabaseデータベースから取得したデータの UTF-8 エンコーディングの問題を検出するためのユーティリティ
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 接続情報（環境変数から取得）
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 文字列が有効なUTF-8かどうかをチェック
 * @param {string} str - チェックする文字列
 * @returns {boolean} - 有効なUTF-8の場合はtrue
 */
export const isValidUtf8 = (str) => {
  try {
    if (str === null || str === undefined) return true;
    
    // 文字列を一度エンコードしてからデコードして元に戻るか確認
    const encoded = encodeURIComponent(str);
    const decoded = decodeURIComponent(encoded);
    
    return str === decoded;
  } catch (e) {
    console.error('UTF-8検証エラー:', e);
    return false;
  }
};

/**
 * 文字列内の無効なUTF-8文字を検出
 * @param {string} str - チェックする文字列
 * @returns {Array} - 問題のある文字とその位置の配列
 */
export const findInvalidUtf8Characters = (str) => {
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
};

/**
 * 文字列をUTF-8として安全な形に修正
 * @param {string} str - 修正する文字列
 * @returns {string} - 修正された文字列
 */
export const sanitizeUtf8 = (str) => {
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
};

/**
 * Supabaseのテーブルをスキャンして無効なUTF-8文字を検出
 * @param {string} tableName - スキャンするテーブル名
 * @param {Array} textColumns - チェックするテキストカラム名の配列
 * @returns {Promise<Array>} - 問題のあるレコードの配列
 */
export const scanTableForUtf8Issues = async (tableName, textColumns) => {
  try {
    // テーブルからすべてのレコードを取得
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    
    const issuesFound = [];
    
    // 各レコードの指定されたテキストカラムをチェック
    data.forEach(record => {
      const recordIssues = { id: record.id, issues: {} };
      let hasIssues = false;
      
      textColumns.forEach(column => {
        if (record[column]) {
          const fieldIssues = findInvalidUtf8Characters(record[column]);
          if (fieldIssues.length > 0) {
            recordIssues.issues[column] = fieldIssues;
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
};

/**
 * レコードのテキストフィールドをサニタイズして更新
 * @param {string} tableName - 更新するテーブル名
 * @param {number} recordId - 更新するレコードのID
 * @param {Object} fieldsToSanitize - サニタイズするフィールド名と値のオブジェクト
 * @returns {Promise<Object>} - 更新結果
 */
export const sanitizeAndUpdateRecord = async (tableName, recordId, fieldsToSanitize) => {
  try {
    const sanitizedFields = {};
    
    // 各フィールドをサニタイズ
    Object.keys(fieldsToSanitize).forEach(field => {
      sanitizedFields[field] = sanitizeUtf8(fieldsToSanitize[field]);
    });
    
    // レコードを更新
    const { data, error } = await supabase
      .from(tableName)
      .update(sanitizedFields)
      .eq('id', recordId);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (e) {
    console.error(`レコード更新中にエラーが発生しました:`, e);
    return { success: false, error: e.message };
  }
};

export default {
  isValidUtf8,
  findInvalidUtf8Characters,
  sanitizeUtf8,
  scanTableForUtf8Issues,
  sanitizeAndUpdateRecord
};
