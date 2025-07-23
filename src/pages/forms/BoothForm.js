import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FormContainer,
  FormTitle,
  FormDescription,
  FormGroup,
  FormLabel,
  RequiredMark,
  FormInput,
  FormTextarea,
  FormSelect,
  SubmitButton,
  ErrorMessage,
  HelpText,
  FormSection,
  SectionTitle,
  RadioContainer,
  RadioOption,
  FormRadio,
  CheckboxContainer,
  FormCheckbox,
  FileUploadArea,
  FileInput,
  FileInputLabel,
  FileUploadIcon,
  FileInfo,
  DeleteButton,
  SuccessMessage,
  TwoColumnLayout
} from '../../components/FormComponents';

const BoothForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyId: '',
    boothSize: '',
    boothType: '',
    boothLocation: '',
    electricalRequirements: '',
    internetRequired: 'no',
    displayItems: '',
    furnitureNeeds: [],
    additionalEquipment: '',
    boothDesign: null,
    productImages: null,
    specialRequirements: '',
    staffNumber: '',
    setupTime: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    const arrayFieldName = e.target.getAttribute('data-field');
    
    if (arrayFieldName) {
      let updatedArray = [...formData[arrayFieldName]];
      
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter(item => item !== value);
      }
      
      setFormData({
        ...formData,
        [arrayFieldName]: updatedArray
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // エラーをクリア
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };
  
  const removeFile = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: null
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名は必須です';
    }
    
    if (!formData.companyId.trim()) {
      newErrors.companyId = '企業IDは必須です';
    }
    
    if (!formData.boothSize) {
      newErrors.boothSize = 'ブースサイズは必須です';
    }
    
    if (!formData.boothType) {
      newErrors.boothType = 'ブースタイプは必須です';
    }
    
    if (!formData.electricalRequirements.trim()) {
      newErrors.electricalRequirements = '電源要件は必須です';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = '担当者名は必須です';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = '電話番号は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // フォーム送信処理（APIリクエストなど）
      console.log('Form submitted:', formData);
      
      // 送信成功
      setSubmitted(true);
      
      // フォームをリセット
      setFormData({
        companyName: '',
        companyId: '',
        boothSize: '',
        boothType: '',
        boothLocation: '',
        electricalRequirements: '',
        internetRequired: 'no',
        displayItems: '',
        furnitureNeeds: [],
        additionalEquipment: '',
        boothDesign: null,
        productImages: null,
        specialRequirements: '',
        staffNumber: '',
        setupTime: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
    } else {
      // エラーがある場合は最初のエラー要素にスクロール
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[name="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };
  
  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <h3>展示ブース情報が送信されました</h3>
          <p>ご提出ありがとうございます。内容を確認し、後ほどメールでご連絡いたします。</p>
        </SuccessMessage>
        <Link to="/forms" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>
          フォーム一覧に戻る
        </Link>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      <FormTitle>展示ブース情報フォーム</FormTitle>
      <FormDescription>
        展示ブースのレイアウト、必要な設備、展示内容などを登録してください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>基本情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>会社名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="例：株式会社サンプル"
            />
            {errors.companyName && <ErrorMessage>{errors.companyName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>企業ID<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              placeholder="例：C-123"
            />
            {errors.companyId && <ErrorMessage>{errors.companyId}</ErrorMessage>}
            <HelpText>企業情報フォーム送信後に発行されたIDを入力してください。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>ブース仕様</SectionTitle>
          
          <FormGroup>
            <FormLabel>ブースサイズ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="boothSize"
              value={formData.boothSize}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="small">小（3m×3m）</option>
              <option value="medium">中（4.5m×3m）</option>
              <option value="large">大（6m×3m）</option>
              <option value="custom">カスタム（詳細を特別要件に記入）</option>
            </FormSelect>
            {errors.boothSize && <ErrorMessage>{errors.boothSize}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>ブースタイプ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="boothType"
              value={formData.boothType}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="standard">標準ブース（壁面パネル、社名板付き）</option>
              <option value="space_only">スペースのみ（自社施工）</option>
              <option value="package">パッケージブース（備品セット付き）</option>
            </FormSelect>
            {errors.boothType && <ErrorMessage>{errors.boothType}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>希望ブース位置</FormLabel>
            <FormSelect
              name="boothLocation"
              value={formData.boothLocation}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="entrance">入口付近</option>
              <option value="center">中央エリア</option>
              <option value="stage">ステージ付近</option>
              <option value="corner">角位置</option>
              <option value="no_preference">特に希望なし</option>
            </FormSelect>
            <HelpText>ご希望に添えない場合もありますのでご了承ください。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>設備・備品</SectionTitle>
          
          <FormGroup>
            <FormLabel>電源要件<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="electricalRequirements"
              value={formData.electricalRequirements}
              onChange={handleChange}
              placeholder="例：100V/1.5kW、コンセント3口"
            />
            {errors.electricalRequirements && <ErrorMessage>{errors.electricalRequirements}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>インターネット接続が必要ですか？</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="internet-yes"
                  name="internetRequired"
                  value="yes"
                  checked={formData.internetRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="internet-yes">はい</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="internet-no"
                  name="internetRequired"
                  value="no"
                  checked={formData.internetRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="internet-no">いいえ</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>有線LANと無線Wi-Fiの両方が利用可能です。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>展示物</FormLabel>
            <FormTextarea
              name="displayItems"
              value={formData.displayItems}
              onChange={handleChange}
              placeholder="展示予定の製品・サービスなどを記入してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>必要な備品（複数選択可）</FormLabel>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-table"
                name="furniture-table"
                value="テーブル"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('テーブル')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-table">テーブル</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-chair"
                name="furniture-chair"
                value="椅子"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('椅子')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-chair">椅子</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-counter"
                name="furniture-counter"
                value="受付カウンター"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('受付カウンター')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-counter">受付カウンター</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-shelf"
                name="furniture-shelf"
                value="展示棚"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('展示棚')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-shelf">展示棚</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-monitor"
                name="furniture-monitor"
                value="モニター"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('モニター')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-monitor">モニター</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="furniture-brochure"
                name="furniture-brochure"
                value="カタログスタンド"
                data-field="furnitureNeeds"
                checked={formData.furnitureNeeds.includes('カタログスタンド')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="furniture-brochure">カタログスタンド</label>
            </CheckboxContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>追加設備・備品</FormLabel>
            <FormTextarea
              name="additionalEquipment"
              value={formData.additionalEquipment}
              onChange={handleChange}
              placeholder="その他必要な設備・備品があれば記入してください。"
            />
            <HelpText>追加料金が発生する場合があります。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>ブースデザイン</SectionTitle>
          
          <FormGroup>
            <FormLabel>ブースデザイン図面</FormLabel>
            <FileUploadArea>
              <FileInput
                type="file"
                id="boothDesign"
                name="boothDesign"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
              />
              <FileInputLabel htmlFor="boothDesign">
                <FileUploadIcon>📐</FileUploadIcon>
                <p>クリックしてファイルをアップロード</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>PDF、JPG、PNG形式</p>
              </FileInputLabel>
            </FileUploadArea>
            {formData.boothDesign && (
              <FileInfo>
                <span>{formData.boothDesign.name}</span>
                <DeleteButton type="button" onClick={() => removeFile('boothDesign')}>
                  ✕
                </DeleteButton>
              </FileInfo>
            )}
            <HelpText>自社施工の場合は、ブースデザインの図面を提出してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>製品・展示物の画像</FormLabel>
            <FileUploadArea>
              <FileInput
                type="file"
                id="productImages"
                name="productImages"
                accept="image/*"
                onChange={handleFileChange}
              />
              <FileInputLabel htmlFor="productImages">
                <FileUploadIcon>🖼️</FileUploadIcon>
                <p>クリックして画像をアップロード</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>JPG、PNG形式</p>
              </FileInputLabel>
            </FileUploadArea>
            {formData.productImages && (
              <FileInfo>
                <span>{formData.productImages.name}</span>
                <DeleteButton type="button" onClick={() => removeFile('productImages')}>
                  ✕
                </DeleteButton>
              </FileInfo>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>特別な要件</FormLabel>
            <FormTextarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="ブース設営に関する特別な要件があれば記入してください。"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>運営情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>ブース常駐スタッフ数</FormLabel>
            <FormInput
              type="number"
              name="staffNumber"
              value={formData.staffNumber}
              onChange={handleChange}
              placeholder="例：3"
              min="1"
            />
            <HelpText>当日ブースに常駐するスタッフの人数を入力してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>希望搬入時間</FormLabel>
            <FormSelect
              name="setupTime"
              value={formData.setupTime}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="day_before_am">前日午前（10:00-12:00）</option>
              <option value="day_before_pm">前日午後（13:00-17:00）</option>
              <option value="day_before_evening">前日夕方（17:00-20:00）</option>
              <option value="same_day_early">当日早朝（7:00-9:00）</option>
            </FormSelect>
            <HelpText>ご希望に添えない場合もありますのでご了承ください。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>連絡先情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>担当者名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="例：山田 太郎"
            />
            {errors.contactName && <ErrorMessage>{errors.contactName}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>メールアドレス<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="例：sample@example.com"
              />
              {errors.contactEmail && <ErrorMessage>{errors.contactEmail}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="例：03-1234-5678"
              />
              {errors.contactPhone && <ErrorMessage>{errors.contactPhone}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
        </FormSection>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default BoothForm;
