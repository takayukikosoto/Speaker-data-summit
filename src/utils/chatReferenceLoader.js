/**
 * チャットボット用リファレンスデータローダー
 * FAQや会場情報などのデータをロードして提供します
 */

/**
 * リファレンスデータをロードする
 * @returns {Promise<Object>} リファレンスデータ
 */
export const loadChatReference = async () => {
  try {
    const response = await fetch('/data/faq_reference.json');
    if (!response.ok) {
      throw new Error(`Failed to load reference data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading chat reference data:', error);
    return {
      event: {},
      faq: [],
      sessions: [],
      sponsors: []
    };
  }
};

/**
 * FAQから質問に関連する回答を検索する
 * @param {string} query - ユーザーの質問
 * @param {Array} faqData - FAQデータ配列
 * @returns {Array} - 関連する回答の配列
 */
export const searchFaq = (query, faqData) => {
  if (!query || !faqData || !Array.isArray(faqData)) {
    return [];
  }
  
  // 検索キーワードを小文字に変換して分割
  const keywords = query.toLowerCase().split(/\s+/);
  
  // 各FAQエントリに対してキーワードマッチングを行い、スコアを計算
  return faqData
    .map(faq => {
      const questionText = faq.question.toLowerCase();
      const answerText = faq.answer.toLowerCase();
      
      // 質問と回答の両方でキーワードの出現回数をカウント
      let score = 0;
      keywords.forEach(keyword => {
        // 質問に含まれる場合は高いスコア
        if (questionText.includes(keyword)) {
          score += 2;
        }
        // 回答に含まれる場合は低いスコア
        if (answerText.includes(keyword)) {
          score += 1;
        }
      });
      
      return {
        ...faq,
        score
      };
    })
    .filter(faq => faq.score > 0) // スコアが0より大きいものだけを選択
    .sort((a, b) => b.score - a.score); // スコアの高い順にソート
};

/**
 * イベント情報から特定の情報を取得する
 * @param {string} key - 取得したい情報のキー
 * @param {Object} eventData - イベントデータオブジェクト
 * @returns {string} - 該当する情報
 */
export const getEventInfo = (key, eventData) => {
  if (!eventData || !key) {
    return '';
  }
  
  return eventData[key] || '';
};

/**
 * セッション情報を検索する
 * @param {string} query - 検索クエリ
 * @param {Array} sessionsData - セッションデータ配列
 * @returns {Array} - 関連するセッションの配列
 */
export const searchSessions = (query, sessionsData) => {
  if (!query || !sessionsData || !Array.isArray(sessionsData)) {
    return [];
  }
  
  const keywords = query.toLowerCase().split(/\s+/);
  
  return sessionsData
    .map(session => {
      const titleText = session.title.toLowerCase();
      const speakerText = session.speaker.toLowerCase();
      const descriptionText = session.description.toLowerCase();
      
      let score = 0;
      keywords.forEach(keyword => {
        if (titleText.includes(keyword)) {
          score += 3;
        }
        if (speakerText.includes(keyword)) {
          score += 2;
        }
        if (descriptionText.includes(keyword)) {
          score += 1;
        }
      });
      
      return {
        ...session,
        score
      };
    })
    .filter(session => session.score > 0)
    .sort((a, b) => b.score - a.score);
};

/**
 * スポンサー情報を検索する
 * @param {string} query - 検索クエリ
 * @param {Array} sponsorsData - スポンサーデータ配列
 * @returns {Array} - 関連するスポンサーの配列
 */
export const searchSponsors = (query, sponsorsData) => {
  if (!query || !sponsorsData || !Array.isArray(sponsorsData)) {
    return [];
  }
  
  const keywords = query.toLowerCase().split(/\s+/);
  
  return sponsorsData
    .map(sponsor => {
      const nameText = sponsor.name.toLowerCase();
      const levelText = sponsor.level.toLowerCase();
      const descriptionText = sponsor.description.toLowerCase();
      
      let score = 0;
      keywords.forEach(keyword => {
        if (nameText.includes(keyword)) {
          score += 3;
        }
        if (levelText.includes(keyword)) {
          score += 2;
        }
        if (descriptionText.includes(keyword)) {
          score += 1;
        }
      });
      
      return {
        ...sponsor,
        score
      };
    })
    .filter(sponsor => sponsor.score > 0)
    .sort((a, b) => b.score - a.score);
};
