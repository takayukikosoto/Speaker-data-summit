/**
 * Google Formsを使用してフォームデータを送信するためのユーティリティ
 */

/**
 * Google Formsにデータを送信する
 * @param {string} formId - Google FormsのID
 * @param {Object} data - 送信するデータ（キーはフォームのエントリーIDに対応）
 * @returns {Promise<boolean>} 送信が成功したかどうか
 */
export const submitToGoogleForms = async (formId, data) => {
  try {
    // フォームのエントリーIDとデータをマッピング
    const formData = new FormData();
    
    // dataオブジェクトのキーと値をFormDataに追加
    Object.keys(data).forEach(key => {
      formData.append(`entry.${key}`, data[key]);
    });
    
    // Google FormsのURL
    const url = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    
    // iframeを使用してCORSの問題を回避
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // フォームを作成して送信
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = 'hidden_iframe';
    
    // FormDataからフォームに入力値を追加
    for (const [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    
    // フォームをDOMに追加して送信
    document.body.appendChild(form);
    form.submit();
    
    // クリーンアップ
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error submitting to Google Forms:', error);
    return false;
  }
};

/**
 * セッション情報フォーム用のデータマッピング
 * @param {Object} formData - フォームデータ
 * @returns {Object} Google Forms用にマッピングされたデータ
 */
export const mapSessionFormData = (formData) => {
  // 実際のGoogle FormsのエントリーIDに合わせて調整する必要があります
  return {
    '123456789': formData.sessionTitle, // タイトル
    '987654321': formData.speakerName, // 講演者名
    '456789123': formData.sessionDescription, // 概要
    '789123456': formData.sessionType, // セッションタイプ
    '321654987': formData.sessionLength, // 長さ
    '654987321': formData.targetAudience, // 対象者
  };
};

/**
 * 物流情報フォーム用のデータマッピング
 * @param {Object} formData - フォームデータ
 * @returns {Object} Google Forms用にマッピングされたデータ
 */
export const mapLogisticsFormData = (formData) => {
  // 実際のGoogle FormsのエントリーIDに合わせて調整する必要があります
  return {
    '123456789': formData.companyName, // 会社名
    '987654321': formData.contactPerson, // 担当者名
    '456789123': formData.email, // メールアドレス
    '789123456': formData.phone, // 電話番号
    '321654987': formData.arrivalDate, // 搬入日
    '654987321': formData.arrivalTime, // 搬入時間
    '159753456': formData.departureDate, // 搬出日
    '357159456': formData.departureTime, // 搬出時間
    '951753456': formData.vehicleType, // 車両タイプ
    '753951456': formData.specialRequirements, // 特別要件
  };
};

// Google Formsの各フォームID
export const FORM_IDS = {
  session: '1FAIpQLSe...', // セッション情報フォームのID（実際のIDに置き換える）
  logistics: '1FAIpQLSd...', // 物流情報フォームのID（実際のIDに置き換える）
  booth: '1FAIpQLSc...', // ブース情報フォームのID（実際のIDに置き換える）
  sponsor: '1FAIpQLSb...', // スポンサー申し込みフォームのID（実際のIDに置き換える）
  presentationEnv: '1FAIpQLSa...', // 講演環境フォームのID（実際のIDに置き換える）
  press: '1FAIpQLSz...', // プレス登録フォームのID（実際のIDに置き換える）
  reception: '1FAIpQLSy...', // 懇親会参加登録フォームのID（実際のIDに置き換える）
};

export default {
  submitToGoogleForms,
  mapSessionFormData,
  mapLogisticsFormData,
  FORM_IDS
};
