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
      .from('faqs_sp')
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
      .from('faqs_sp')
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
    const { data, error } = await supabase
      .from('faqs_sp')
      .select('*')
      .or(`question.ilike.%${keyword}%,answer.ilike.%${keyword}%`);
      
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
    // idフィールドを削除して、Supabaseが自動的にUUIDを生成するようにする
    const { id, ...faqWithoutId } = faq;
    
    // created_atとupdated_atフィールドが存在しないので、それらを追加しない
    const newFaq = {
      ...faqWithoutId
    };
    
    console.log('Supabaseに送信するFAQデータ:', newFaq);
    
    const { data, error } = await supabase
      .from('faqs_sp')
      .insert([newFaq])
      .select();
      
    if (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
    
    console.log('Supabaseから返されたFAQデータ:', data[0]);
    return data[0];
  },
  
  /**
   * FAQを更新
   * @param {string} id - FAQ ID
   * @param {Object} updates - 更新データ
   * @returns {Promise<Object>} 更新されたFAQ
   */
  updateFaq: async (id, updates) => {
    const { data, error } = await supabase
      .from('faqs_sp')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
    
    return data[0];
  },
  
  /**
   * FAQを削除
   * @param {string} id - FAQ ID
   * @returns {Promise<Object>} 削除結果
   */
  deleteFaq: async (id) => {
    const { error } = await supabase
      .from('faqs_sp')
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
   * updated_atカラムが存在しない場合の再試行処理
   * @param {string} id - アイテムID
   * @param {Object} updateData - 更新データ
   * @returns {Promise<Object>} 更新されたアイテム
   */
  retryUpdate: async (id, updateData) => {
    console.log('再試行更新を実行します:', id, updateData);
    
    // updated_atを削除して再試行
    const { data: retryData, error: retryError } = await supabase
      .from('downloads_sp')
      .update(updateData)
      .eq('id', id)
      .select('*');
      
    if (retryError) {
      console.error('再試行エラー:', retryError);
      throw retryError;
    }
    
    if (!retryData || retryData.length === 0) {
      console.log('再試行後のデータが返されませんでした。データを再取得します。');
      // 更新後のデータを再取得
      const { data: refetchedData, error: refetchError } = await supabase
        .from('downloads_sp')
        .select('*')
        .eq('id', id)
        .single();
        
      if (refetchError) {
        console.error('データ再取得エラー:', refetchError);
        throw new Error(`更新後のデータ取得に失敗しました: ${refetchError.message}`);
      }
      
      if (!refetchedData) {
        throw new Error('更新後のデータが見つかりませんでした');
      }
      
      return refetchedData;
    }
    
    return retryData[0];
  },
  
  /**
   * すべてのダウンロードアイテムを取得
   * @returns {Promise<Array>} ダウンロードアイテムの配列
   */
  getAllItems: async () => {
    console.log('ダウンロードデータ取得開始');
    try {
      // ダウンロードデータ取得
      const { data, error } = await supabase
        .from('downloads_sp')
        .select('*')
        .order('lastUpdated', { ascending: false });
        
      if (error) {
        console.error('ダウンロードデータ取得エラー:', error);
        console.error('エラーコード:', error.code);
        console.error('エラーメッセージ:', error.message);
        console.error('エラー詳細:', error.details);
        throw error;
      }
      
      console.log('取得したダウンロードデータ:', data);
      return data || [];
    } catch (err) {
      console.error('ダウンロードデータ取得中の予期せぬエラー:', err);
      throw err;
    }
  },
  
  /**
   * 特定のカテゴリーのダウンロードアイテムを取得
   * @param {string} category - カテゴリーID
   * @returns {Promise<Array>} ダウンロードアイテムの配列
   */
  getItemsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('downloads_sp')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching download items by category:', error);
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
    // 確実にidを削除
    const { id, ...newItemWithoutId } = item;
    
    const now = new Date().toISOString();
    const newItem = {
      ...newItemWithoutId,
      created_at: now
      // updated_atは存在確認後に追加
    };
    
    // テーブルの構造を確認して、updated_atカラムが存在するか確認
    try {
      // テーブルのサンプルデータを取得して構造を確認
      const { data: sampleData, error: sampleError } = await supabase
        .from('downloads_sp')
        .select('*')
        .limit(1);
        
      if (!sampleError && sampleData && sampleData.length > 0) {
        // updated_atカラムが存在するか確認
        if ('updated_at' in sampleData[0]) {
          // updated_atカラムが存在する場合は追加
          newItem.updated_at = now;
        } else {
          console.log('updated_atカラムが存在しないため、設定しません');
        }
      }
    } catch (checkErr) {
      console.warn('テーブル構造確認中にエラーが発生しました:', checkErr);
      // エラーが発生しても処理を続行
    }
    
    console.log('挿入するデータ:', newItem);
    
    // 挿入を実行
    let insertResult;
    try {
      insertResult = await supabase
        .from('downloads_sp')
        .insert([newItem]);
        
      if (insertResult.error) {
        // updated_atカラムが存在しないエラーの場合
        if (insertResult.error.message && insertResult.error.message.includes('updated_at')) {
          console.log('updated_atカラムが存在しないエラーが発生しました。updated_atを削除して再試行します。');
          delete newItem.updated_at;
          
          // updated_atを削除して再試行
          insertResult = await supabase
            .from('downloads_sp')
            .insert([newItem]);
            
          if (insertResult.error) {
            console.error('再試行挿入エラー:', insertResult.error);
            throw insertResult.error;
          }
        } else {
          console.error('挿入エラー:', insertResult.error);
          throw insertResult.error;
        }
      }
    } catch (insertErr) {
      console.error('挿入処理中にエラーが発生しました:', insertErr);
      throw insertErr;
    }
    
    // 挿入後に最新のデータを取得
    // タイトルと作成日時で一致するデータを検索
    const { data: fetchedData, error: fetchError } = await supabase
      .from('downloads_sp')
      .select('*')
      .eq('title', newItem.title)
      .eq('created_at', now)
      .limit(1);
    
    if (fetchError) {
      console.error('データ取得エラー:', fetchError);
      throw fetchError;
    }
    
    if (!fetchedData || fetchedData.length === 0) {
      console.error('作成したデータが見つかりません');
      throw new Error('データの作成は成功しましたが、作成されたデータの取得に失敗しました');
    }
    
    console.log('作成されたデータ:', fetchedData[0]);
    return fetchedData[0];
  },
  
  /**
   * ダウンロードアイテムを更新
   * @param {string} id - アイテムID
   * @param {Object} updates - 更新するフィールド
   * @returns {Promise<Object>} 更新されたアイテム
   */
  updateItem: async (id, updates) => {
    console.log(`ID ${id} のアイテムを更新します:`, updates);
    
    try {
      // まず既存データを確認
      const { data: existingData, error: existingError } = await supabase
        .from('downloads_sp')
        .select('*')
        .eq('id', id)
        .single();
        
      if (existingError) {
        console.error('既存データ取得エラー:', existingError);
        // データが存在しない場合は新規作成
        if (existingError.code === 'PGRST116') {
          console.log('対象のアイテムが見つかりません。新規作成を試みます。');
          return downloadService.createItem({ ...updates, id });
        }
        throw existingError;
      }
      
      if (!existingData) {
        console.log('既存データが見つかりません。新規作成を試みます。');
        return downloadService.createItem({ ...updates, id });
      }
      
      console.log('既存データ:', existingData);
      
      // 更新データの準備
      const updateData = { ...updates };
      delete updateData.id; // IDは更新しない
      
      // テーブルの構造を確認してupdated_atカラムが存在するか確認
      const hasUpdatedAt = 'updated_at' in existingData;
      if (hasUpdatedAt) {
        updateData.updated_at = new Date().toISOString();
      } else {
        console.log('updated_atカラムが存在しないため、更新日時は設定しません');
      }
      
      console.log('更新データ:', updateData);
      
      // 実際に変更があるか確認
      let hasChanges = false;
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== existingData[key]) {
          hasChanges = true;
        }
      });
      
      if (!hasChanges && !hasUpdatedAt) {
        console.log('変更がありません。既存データを返します。');
        return existingData;
      }
      
      // 更新を実行
      let updateResult;
      try {
        updateResult = await supabase
          .from('downloads_sp')
          .update(updateData)
          .eq('id', id)
          .select('*');
      } catch (updateErr) {
        console.error('更新実行エラー:', updateErr);
        throw updateErr;
      }
      
      if (updateResult.error) {
        console.error('更新エラー:', updateResult.error);
        
        // updated_atカラムが存在しないエラーの場合
        if (updateResult.error.message && updateResult.error.message.includes('updated_at')) {
          console.log('updated_atカラムエラー。updated_atを削除して再試行します。');
          delete updateData.updated_at;
          
          // updated_atを削除して再試行
          try {
            const retryResult = await supabase
              .from('downloads_sp')
              .update(updateData)
              .eq('id', id)
              .select('*');
              
            if (retryResult.error) {
              console.error('再試行エラー:', retryResult.error);
              throw retryResult.error;
            }
            
            if (retryResult.data && retryResult.data.length > 0) {
              console.log('再試行成功:', retryResult.data[0]);
              return retryResult.data[0];
            }
          } catch (retryErr) {
            console.error('再試行中にエラーが発生しました:', retryErr);
            throw retryErr;
          }
        }
        
        throw updateResult.error;
      }
      
      // 更新結果の確認
      if (updateResult.data && updateResult.data.length > 0) {
        console.log('更新成功:', updateResult.data[0]);
        return updateResult.data[0];
      }
      
      // 更新後のデータが返されない場合、再取得する
      console.log('更新後のデータが返されませんでした。データを再取得します。');
      
      // 少し待機してから再取得
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: refetchedData, error: refetchError } = await supabase
        .from('downloads_sp')
        .select('*')
        .eq('id', id)
        .single();
        
      if (refetchError) {
        console.error('データ再取得エラー:', refetchError);
        throw new Error(`更新後のデータ取得に失敗しました: ${refetchError.message}`);
      }
      
      if (!refetchedData) {
        throw new Error('更新後のデータが見つかりませんでした');
      }
      
      // 実際に更新されたか確認
      let wasUpdated = false;
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== existingData[key] && updateData[key] === refetchedData[key]) {
          wasUpdated = true;
        }
      });
      
      if (!wasUpdated) {
        console.warn('データが実際に更新されていない可能性があります。直接SQLを試みます。');
        
        // 直接SQLを使用して更新を試みる
        try {
          const updateFields = Object.keys(updateData)
            .map(key => `"${key}" = '${updateData[key]}'`)
            .join(', ');
            
          const { data: sqlData, error: sqlError } = await supabase.rpc(
            'execute_sql',
            { sql: `UPDATE downloads_sp SET ${updateFields} WHERE id = '${id}' RETURNING *;` }
          );
          
          if (sqlError) {
            console.error('SQL実行エラー:', sqlError);
            // SQLエラーは無視して再取得したデータを返す
          } else if (sqlData && sqlData.length > 0) {
            console.log('SQL更新成功:', sqlData);
            // SQLが成功しても再取得したデータを返す
          }
        } catch (sqlErr) {
          console.error('SQL実行中にエラーが発生しました:', sqlErr);
          // SQLエラーは無視して再取得したデータを返す
        }
        
        // 再度データを取得
        const { data: finalData, error: finalError } = await supabase
          .from('downloads_sp')
          .select('*')
          .eq('id', id)
          .single();
          
        if (finalError) {
          console.error('最終データ取得エラー:', finalError);
          // エラーがあっても最初に再取得したデータを返す
        } else if (finalData) {
          return finalData;
        }
      }
      
      console.log('最終的な更新結果:', refetchedData);
      return refetchedData;
    } catch (err) {
      console.error('アイテム更新中にエラーが発生しました:', err);
      throw new Error(`アイテムの更新に失敗しました: ${err.message}`);
    }
  },
  
  /**
   * ダウンロードアイテムを削除
   * @param {string} id - アイテムID
   * @returns {Promise<Object>} 削除結果
   */
  deleteItem: async (id) => {
    const { error } = await supabase
      .from('downloads_sp')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting download item:', error);
      throw error;
    }
    
    return { success: true };
  },
  
  /**
   * IDでダウンロードアイテムを取得
   * @param {string} id - アイテムID
   * @returns {Promise<Object>} ダウンロードアイテム
   */
  getItemById: async (id) => {
    const { data, error } = await supabase
      .from('downloads_sp')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching download item by ID:', error);
      throw error;
    }
    
    return data;
  }
};

/**
 * データベースのテーブル構造を取得
 * @param {string} tableName - テーブル名
 * @returns {Promise<Object>} テーブル構造
 */
export const getTableStructure = async (tableName = 'downloads') => {
  try {
    // テーブルのカラム情報を取得
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', tableName);
      
    if (columnsError) throw columnsError;
    
    // 主キー制約を取得
    const { data: constraints, error: constraintsError } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_name', tableName)
      .eq('constraint_type', 'PRIMARY KEY');
      
    if (constraintsError) throw constraintsError;
    
    // 主キー制約の詳細を取得
    let primaryKeys = [];
    if (constraints && constraints.length > 0) {
      const constraintName = constraints[0].constraint_name;
      const { data: keyColumns, error: keyError } = await supabase.rpc('get_primary_key', { 
        table_name: tableName 
      });
      
      if (!keyError && keyColumns) {
        primaryKeys = keyColumns.column_name;
      }
    }
    
    return {
      tableName,
      columns,
      primaryKey: primaryKeys,
      hasPrimaryKey: primaryKeys.length > 0
    };
  } catch (error) {
    console.error('テーブル構造の取得中にエラーが発生しました:', error);
    throw error;
  }
};

/**
 * テキストデータをSupabaseに移行するユーティリティ
 * @param {string} faqText - FAQテキスト
 * @returns {Promise<Object>} 移行結果
 */
export const migrateFaqTextToSupabase = async (faqText) => {
  try {
    // テキストを行ごとに分割
    const lines = faqText.split('\n').filter(line => line.trim() !== '');
    
    let currentCategory = '';
    let currentQuestion = '';
    let currentAnswer = [];
    let faqs = [];
    
    // テキストをパースしてFAQオブジェクトの配列を作成
    for (const line of lines) {
      if (line.startsWith('## ')) {
        // 新しいカテゴリー
        currentCategory = line.replace('## ', '').trim();
      } else if (line.startsWith('### ')) {
        // 新しい質問
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer.join('\n'),
            category: currentCategory,
            priority: 0
          });
          currentAnswer = [];
        }
        currentQuestion = line.replace('### ', '').trim();
      } else {
        // 回答の一部
        currentAnswer.push(line.trim());
      }
    }
    
    // 最後のFAQを追加
    if (currentQuestion && currentAnswer.length > 0) {
      faqs.push({
        question: currentQuestion,
        answer: currentAnswer.join('\n'),
        category: currentCategory,
        priority: 0
      });
    }
    
    // 作成したFAQをSupabaseに保存
    const results = [];
    for (const faq of faqs) {
      try {
        const result = await faqService.createFaq(faq);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    
    return {
      total: faqs.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  } catch (error) {
    console.error('FAQテキストの移行中にエラーが発生しました:', error);
    throw error;
  }
};

/**
 * Supabaseを使用したフォームサービス
 */
export const formService = {
  /**
   * すべてのフォームを取得
   * @returns {Promise<Array>} フォームの配列
   */
  getAllForms: async () => {
    console.log('フォームデータ取得開始');
    try {
      // テーブルの存在確認
      const { data: tables, error: tablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
        
      if (tablesError) {
        console.error('テーブル一覧取得エラー:', tablesError);
      } else {
        console.log('利用可能なテーブル:', tables);
      }
      
      // フォームデータ取得
      const { data, error } = await supabase
        .from('forms_sp')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('フォームデータ取得エラー:', error);
        console.error('エラーコード:', error.code);
        console.error('エラーメッセージ:', error.message);
        console.error('エラー詳細:', error.details);
        throw error;
      }
      
      console.log('取得したフォームデータ:', data);
      
      // form_urlとis_requiredを変換
      const transformedData = data ? data.map(item => {
        const { form_url, is_required, ...rest } = item;
        return { ...rest, formUrl: form_url, isRequired: is_required };
      }) : [];
      
      return transformedData;
    } catch (err) {
      console.error('フォームデータ取得中の予期せぬエラー:', err);
      throw err;
    }
  },
  
  /**
   * 特定のカテゴリーのフォームを取得
   * @param {string} category - カテゴリーID
   * @returns {Promise<Array>} フォームの配列
   */
  getFormsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('forms_sp')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching forms by category:', error);
      throw error;
    }
    
    // form_urlとis_requiredを変換
    const transformedData = data ? data.map(item => {
      const { form_url, is_required, ...rest } = item;
      return { ...rest, formUrl: form_url, isRequired: is_required };
    }) : [];
    
    return transformedData;
  },
  
  /**
   * 新しいフォームを作成
   * @param {Object} form - フォームデータ
   * @returns {Promise<Object>} 作成されたフォーム
   */
  createForm: async (form) => {
    const { id, formUrl, isRequired, ...newFormWithoutId } = form;
    const now = new Date().toISOString();
    const newForm = {
      ...newFormWithoutId,
      form_url: formUrl, // formUrlをform_urlに変換
      is_required: isRequired, // isRequiredをis_requiredに変換
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('forms_sp')
      .insert([newForm])
      .select();
      
    if (error) {
      console.error('Error creating form:', error);
      throw error;
    }
    
    // 返却データのform_urlとis_requiredを変換して返す
    if (data && data[0]) {
      const { form_url, is_required, ...rest } = data[0];
      return { ...rest, formUrl: form_url, isRequired: is_required };
    }
    
    return data[0];
  },
  
  /**
   * フォームを更新
   * @param {string} id - フォームID
   * @param {Object} updates - 更新データ
   * @returns {Promise<Object>} 更新されたフォーム
   */
  updateForm: async (id, updates) => {
    const { formUrl, isRequired, ...rest } = updates;
    const updateData = { ...rest };
    delete updateData.id;
    updateData.updated_at = new Date().toISOString();
    
    // formUrlをform_urlに変換
    if (formUrl !== undefined) {
      updateData.form_url = formUrl;
    }
    
    // isRequiredをis_requiredに変換
    if (isRequired !== undefined) {
      updateData.is_required = isRequired;
    }
    
    const { data, error } = await supabase
      .from('forms_sp')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating form:', error);
      throw error;
    }
    
    // 返却データのform_urlとis_requiredを変換して返す
    if (data && data[0]) {
      const { form_url, is_required, ...restData } = data[0];
      return { ...restData, formUrl: form_url, isRequired: is_required };
    }
    
    return data[0];
  },
  
  /**
   * フォームを削除
   * @param {string} id - フォームID
   * @returns {Promise<Object>} 削除結果
   */
  deleteForm: async (id) => {
    const { error } = await supabase
      .from('forms_sp')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
    
    return { success: true };
  },
  
  /**
   * IDでフォームを取得
   * @param {string} id - フォームID
   * @returns {Promise<Object>} フォーム
   */
  getFormById: async (id) => {
    const { data, error } = await supabase
      .from('forms_sp')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching form by ID:', error);
      throw error;
    }
    
    // form_urlとis_requiredを変換
    if (data) {
      const { form_url, is_required, ...rest } = data;
      return { ...rest, formUrl: form_url, isRequired: is_required };
    }
    
    return data;
  }
};
