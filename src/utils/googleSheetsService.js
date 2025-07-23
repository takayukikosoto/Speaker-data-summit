import { google } from 'googleapis';

// Google APIクライアントの設定
// 実際のクライアントIDとAPIキーに置き換えてください
const API_KEY = 'AIzaSyANXUXAiMFaDDWHShYNBtg7M2t846wmcf0';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// スプレッドシートIDのマッピング
const SPREADSHEET_IDS = {
  session: 'YOUR_SESSION_SPREADSHEET_ID',
  company: 'YOUR_COMPANY_SPREADSHEET_ID',
  booth: 'YOUR_BOOTH_SPREADSHEET_ID',
  sponsor: 'YOUR_SPONSOR_SPREADSHEET_ID',
  logistics: 'YOUR_LOGISTICS_SPREADSHEET_ID',
  presentationEnv: 'YOUR_PRESENTATION_ENV_SPREADSHEET_ID',
  press: 'YOUR_PRESS_SPREADSHEET_ID',
  reception: 'YOUR_RECEPTION_SPREADSHEET_ID'
};

// Google認証を初期化
export const initGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    try {
      const gapi = window.gapi;
      
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES.join(' '),
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(() => {
          resolve(gapi);
        }).catch(error => {
          console.error('Error initializing Google API client:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error loading Google API client:', error);
      reject(error);
    }
  });
};

// ユーザーのログイン状態を確認
export const checkSignInStatus = async () => {
  try {
    const gapi = await initGoogleAuth();
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    return isSignedIn;
  } catch (error) {
    console.error('Error checking sign-in status:', error);
    return false;
  }
};

// Googleにサインイン
export const signIn = async () => {
  try {
    const gapi = await initGoogleAuth();
    return gapi.auth2.getAuthInstance().signIn();
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Googleからサインアウト
export const signOut = async () => {
  try {
    const gapi = await initGoogleAuth();
    return gapi.auth2.getAuthInstance().signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// フォームデータをGoogle Sheetsに送信
export const submitToGoogleSheets = async (formType, formData) => {
  try {
    // ログイン状態を確認
    const isSignedIn = await checkSignInStatus();
    if (!isSignedIn) {
      await signIn();
    }
    
    const gapi = await initGoogleAuth();
    const spreadsheetId = SPREADSHEET_IDS[formType];
    
    if (!spreadsheetId) {
      throw new Error(`Spreadsheet ID not found for form type: ${formType}`);
    }
    
    // フォームデータを配列に変換
    const values = Object.values(formData);
    
    // Google Sheetsにデータを追加
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:Z', // データを追加する範囲
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values]
      }
    });
    
    console.log('Data submitted to Google Sheets:', response);
    return response;
  } catch (error) {
    console.error('Error submitting data to Google Sheets:', error);
    throw error;
  }
};

// Google Sheets APIを使用してデータを送信（APIキーのみで認証）
export const submitWithApiKey = async (formType, formData) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    const spreadsheetId = SPREADSHEET_IDS[formType];
    
    if (!spreadsheetId) {
      throw new Error(`Spreadsheet ID not found for form type: ${formType}`);
    }
    
    // フォームデータを配列に変換
    const values = Object.values(formData);
    
    // Google Sheetsにデータを追加
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:Z', // データを追加する範囲
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values]
      }
    });
    
    console.log('Data submitted to Google Sheets with API key:', response);
    return response;
  } catch (error) {
    console.error('Error submitting data with API key:', error);
    throw error;
  }
};

export default {
  initGoogleAuth,
  checkSignInStatus,
  signIn,
  signOut,
  submitToGoogleSheets,
  submitWithApiKey
};
