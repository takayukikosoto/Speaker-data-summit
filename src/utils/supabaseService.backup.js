import supabase from './supabaseClient';

/**
 * Supabaseを使用したFAQサービス
 */
export const faqService = {
  /**
   * すべてのFAQを取得
   * @returns {Promise<Array>} FAQの配列
   */
  getAllFaqs: async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('priority', { ascending: true });
      
    if (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * 特定のカテゴリーのFAQを取得
   * @param {string} category - カテゴリーID
   * @returns {Promise<Array>} FAQの配列
   */
  getFaqsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('category', category)
      .order('priority', { ascending: true });
      
    if (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * キーワードでFAQを検索
   * @param {string} keyword - 検索キーワード
   * @returns {Promise<Array>} 検索結果
   */
  searchFaqs: async (keyword) => {
    // PostgreSQLの全文検索を使用
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .or(`question.ilike.%${keyword}%,answer.ilike.%${keyword}%`)
      .order('priority', { ascending: true });
      
    if (error) {
      console.error('Error searching FAQs:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * 新しいFAQを作成
   * @param {Object} faq - FAQデータ
   * @returns {Promise<Object>} 作成されたFAQ
   */
  createFaq: async (faq) => {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faq])
      .select();
      
    if (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
    
    return data?.[0] || {};
  },
  
  /**
   * FAQを更新
   * @param {string} id - FAQ ID
   * @param {Object} faq - 更新データ
   * @returns {Promise<Object>} 更新されたFAQ
   */
  updateFaq: async (id, faq) => {
    const { data, error } = await supabase
      .from('faqs')
      .update(faq)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
    
    return data?.[0] || {};
  },
  
  /**
   * FAQを削除
   * @param {string} id - FAQ ID
   * @returns {Promise<Object>} 削除結果
   */
  deleteFaq: async (id) => {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
    
    return { success: true };
  }
};

/**
 * Supabaseを使用したダウンロードサービス
 */
export const downloadService = {
  /**
   * すべてのダウンロードアイテムを取得
   * @returns {Promise<Array>} ダウンロードアイテムの配列
   */
  getAllItems: async () => {
    console.log('ダウンロードアイテムを取得中...');
    
    // キャッシュを無効化し、常に最新データを取得する
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('category', { ascending: true })
      .limit(1000)  // 十分な上限を設定
      .throwOnError();  // エラー発生時に例外をスロー
      
    if (error) {
      console.error('Error fetching downloads:', error);
      throw error;
    }
    
    console.log(`取得完了: ${data?.length || 0} 件のダウンロードアイテム`);
    return data || [];
  },
  
  /**
   * 特定のカテゴリーのダウンロードアイテムを取得
   * @param {string} category - カテゴリーID
   * @returns {Promise<Array>} ダウンロードアイテムの配列
   */
  getItemsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('category', category);
      
    if (error) {
      console.error('Error fetching downloads by category:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * 新しいダウンロードアイテムを作成
   * @param {Object} item - ダウンロードアイテムデータ
   * @returns {Promise<Object>} 作成されたアイテム
   */
  createItem: async (item) => {
    console.log('新規アイテム作成開始:', item);
    
    try {
      // IDが指定されている場合の処理
      if (item.id) {
        console.log('指定されたIDがあります:', item.id);
        
        try {
          // 既存のアイテムを確認
          const { data: existingItem, error: checkError } = await supabase
            .from('downloads')
            .select('id')
            .eq('id', item.id)
            .maybeSingle();
            
          if (checkError) throw checkError;
          
          if (existingItem) {
            console.log('同じIDのアイテムが存在します。更新処理に移行します。');
            return downloadService.updateItem(item.id, item);
          }
        } catch (checkErr) {
          console.error('既存アイテム確認エラー:', checkErr);
          // 確認エラーが発生しても処理を続行
        }
      }
      
      // 新しいIDを生成（既存のIDがない場合、またはIDが指定されていない場合）
      if (!item.id) {
        item.id = `dl_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        console.log('新しいIDを生成しました:', item.id);
      }
      
      // 作成日時と更新日時を設定
      const now = new Date().toISOString();
      item.created_at = now;
      item.updated_at = now;
      
      console.log('挿入を試みるデータ:', item);
      
      // データを挿入
      const { data, error } = await supabase
        .from('downloads')
        .insert([item])
        .select();
        
      if (error) {
        console.error('アイテム作成エラー:', error);
        
        // 重複キーエラーの場合は、新しいIDで再試行
        if (error.code === '23505') {
          console.log('IDが重複しています。新しいIDで再試行します。');
          delete item.id;
          return downloadService.createItem(item);
        }
        
        throw error;
      }
      
      console.log('アイテム作成成功:', data[0]);
      return data[0];
    } catch (err) {
      console.error('アイテム作成中にエラーが発生しました:', err);
    }
  },
  
  // ...
      console.error('確認データ取得エラー:', verifyError);
      return updatedData; // 確認取得に失敗しても更新データを返す
    }
    
    console.log('確認データ:', verifiedData);
    
    // 変更が反映されているか確認
    const isUpdated = Object.keys(updateFields).every(key => 
      key === 'updated_at' || verifiedData[key] === updateFields[key]
    );
    
    console.log('変更が反映されているか:', isUpdated);
    
    // 確認された最新データを返す
    return verifiedData;
  },
  
  /**
   * ダウンロードアイテムを削除
   * @param {string} id - アイテムID
   * @returns {Promise<Object>} 削除結果
   */
  deleteItem: async (id) => {
    const { data, error } = await supabase
      .from('downloads')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting download item:', error);
      throw error;
    }
    
    return { success: true, id };
  },
  
  /**
   * 特定のIDを持つダウンロードアイテムを取得
   * @param {string} id - アイテムID
   * @returns {Promise<Object>} ダウンロードアイテム
   */
  getItemById: async (id) => {
    console.log(`ID: ${id} のダウンロードアイテムを取得中...`);
    
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching download item with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Download item with ID ${id} not found`);
    }
    
    console.log(`ID: ${id} のダウンロードアイテムを取得完了:`, data);
    return data;
  }
};

/**
 * テキストデータをSupabaseに移行するユーティリティ
 * @param {string} faqText - FAQテキスト
 * @returns {Promise<Object>} 移行結果
 */
export const migrateFaqTextToSupabase = async (faqText) => {
  try {
    // Q&Aを抽出
    const qaRegex = /Q: (.+?)[\r\n]+A: (.+?)(?=[\r\n]+Q:|$)/gs;
    const faqItems = [];
    let match;
    
    while ((match = qaRegex.exec(faqText)) !== null) {
      // カテゴリーを推測（セクション見出しから）
      let category = 'general';
      const sectionMatch = faqText.substring(0, match.index).match(/## ([^\n]+)(?![\s\S]*## \1)/);
      
      if (sectionMatch) {
        const sectionTitle = sectionMatch[1].trim().toLowerCase();
        
        // セクションタイトルからカテゴリーIDを推測
        if (sectionTitle.includes('基本情報')) category = 'general';
        else if (sectionTitle.includes('会場')) category = 'venue';
        else if (sectionTitle.includes('登録') || sectionTitle.includes('参加者')) category = 'registration';
        else if (sectionTitle.includes('スポンサー') || sectionTitle.includes('出展')) category = 'sponsor';
        else if (sectionTitle.includes('登壇者')) category = 'speaker';
      }
      
      // IDを生成
      const id = match[1].trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      
      faqItems.push({
        id,
        question: match[1].trim(),
        answer: match[2].trim(),
        category,
        priority: 5 // デフォルト優先度
      });
    }
    
    // 既存のFAQをクリア
    await supabase.from('faqs').delete().neq('id', 'dummy');
    
    // 新しいFAQを挿入
    if (faqItems.length > 0) {
      const { error } = await supabase.from('faqs').insert(faqItems);
      
      if (error) {
        console.error('Error migrating FAQs:', error);
        return { success: false, message: error.message };
      }
    }
    
    return { 
      success: true, 
      message: `${faqItems.length}件のFAQをSupabaseに移行しました。` 
    };
  } catch (error) {
    console.error('Error in migration:', error);
    return { success: false, message: error.message };
  }
};
