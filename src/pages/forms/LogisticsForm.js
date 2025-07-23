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
  SuccessMessage,
  TwoColumnLayout
} from '../../components/FormComponents';

// Google Formsとの連携用ユーティリティをインポート
import { submitToGoogleForms, mapLogisticsFormData, FORM_IDS } from '../../utils/googleFormsService';

const LogisticsForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyId: '',
    boothNumber: '',
    deliveryMethod: '',
    vehicleType: '',
    vehiclePlate: '',
    driverName: '',
    driverPhone: '',
    deliveryDate: '',
    deliveryTime: '',
    itemsList: '',
    itemsSize: '',
    itemsWeight: '',
    specialHandling: '',
    setupPersonnel: '',
    setupTime: '',
    removalDate: '',
    removalTime: '',
    storageRequired: 'no',
    storageDetails: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名は必須です';
    }
    
    if (!formData.companyId.trim()) {
      newErrors.companyId = '企業IDは必須です';
    }
    
    if (!formData.boothNumber.trim()) {
      newErrors.boothNumber = 'ブース番号は必須です';
    }
    
    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = '搬入方法は必須です';
    }
    
    if (formData.deliveryMethod === 'self' && !formData.vehicleType) {
      newErrors.vehicleType = '車両タイプは必須です';
    }
    
    if (formData.deliveryMethod === 'self' && !formData.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'ナンバープレートは必須です';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = '搬入日は必須です';
    }
    
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = '搬入時間は必須です';
    }
    
    if (!formData.itemsList.trim()) {
      newErrors.itemsList = '搬入物リストは必須です';
    }
    
    if (!formData.removalDate) {
      newErrors.removalDate = '搬出日は必須です';
    }
    
    if (!formData.removalTime) {
      newErrors.removalTime = '搬出時間は必須です';
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Google Formsにデータを送信
        const mappedData = mapLogisticsFormData(formData);
        const success = await submitToGoogleForms(FORM_IDS.logistics, mappedData);
        
        if (success) {
          console.log('Form data submitted to Google Forms:', formData);
          
          // 送信成功
          setSubmitted(true);
          
          // フォームをリセット
          setFormData({
            companyName: '',
            companyId: '',
            boothNumber: '',
            deliveryMethod: '',
            vehicleType: '',
            vehiclePlate: '',
            driverName: '',
            driverPhone: '',
            deliveryDate: '',
            deliveryTime: '',
            itemsList: '',
            itemsSize: '',
            itemsWeight: '',
            specialHandling: '',
            setupPersonnel: '',
            setupTime: '',
            removalDate: '',
            removalTime: '',
            storageRequired: 'no',
            storageDetails: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            additionalNotes: ''
          });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('フォームの送信中にエラーが発生しました。後でもう一度お試しください。');
      } finally {
        setIsSubmitting(false);
      }
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
          <h3>搬入出情報が送信されました</h3>
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
      <FormTitle>搬入出情報フォーム</FormTitle>
      <FormDescription>
        展示物の搬入出スケジュール、車両情報などを登録してください。
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
          
          <TwoColumnLayout>
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
            
            <FormGroup>
              <FormLabel>ブース番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="boothNumber"
                value={formData.boothNumber}
                onChange={handleChange}
                placeholder="例：B-12"
              />
              {errors.boothNumber && <ErrorMessage>{errors.boothNumber}</ErrorMessage>}
              <HelpText>ブース番号が不明な場合は「未定」と入力してください。</HelpText>
            </FormGroup>
          </TwoColumnLayout>
        </FormSection>
        
        <FormSection>
          <SectionTitle>搬入情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>搬入方法<RequiredMark>※</RequiredMark></FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="delivery-self"
                  name="deliveryMethod"
                  value="self"
                  checked={formData.deliveryMethod === 'self'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="delivery-self">自社搬入（自社車両を使用）</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="delivery-courier"
                  name="deliveryMethod"
                  value="courier"
                  checked={formData.deliveryMethod === 'courier'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="delivery-courier">宅配便（ヤマト運輸、佐川急便など）</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="delivery-logistics"
                  name="deliveryMethod"
                  value="logistics"
                  checked={formData.deliveryMethod === 'logistics'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="delivery-logistics">物流業者（指定業者を利用）</label>
              </RadioOption>
            </RadioContainer>
            {errors.deliveryMethod && <ErrorMessage>{errors.deliveryMethod}</ErrorMessage>}
          </FormGroup>
          
          {formData.deliveryMethod === 'self' && (
            <>
              <FormGroup>
                <FormLabel>車両タイプ<RequiredMark>※</RequiredMark></FormLabel>
                <FormSelect
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  <option value="car">乗用車</option>
                  <option value="van">バン</option>
                  <option value="truck_small">小型トラック（2tまで）</option>
                  <option value="truck_medium">中型トラック（4tまで）</option>
                  <option value="truck_large">大型トラック（4t超）</option>
                </FormSelect>
                {errors.vehicleType && <ErrorMessage>{errors.vehicleType}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>ナンバープレート<RequiredMark>※</RequiredMark></FormLabel>
                <FormInput
                  type="text"
                  name="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  placeholder="例：品川 500 あ 1234"
                />
                {errors.vehiclePlate && <ErrorMessage>{errors.vehiclePlate}</ErrorMessage>}
              </FormGroup>
              
              <TwoColumnLayout>
                <FormGroup>
                  <FormLabel>運転者名</FormLabel>
                  <FormInput
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="例：山田 太郎"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>運転者連絡先</FormLabel>
                  <FormInput
                    type="tel"
                    name="driverPhone"
                    value={formData.driverPhone}
                    onChange={handleChange}
                    placeholder="例：090-1234-5678"
                  />
                </FormGroup>
              </TwoColumnLayout>
            </>
          )}
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>搬入日<RequiredMark>※</RequiredMark></FormLabel>
              <FormSelect
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="2025-06-10">2025年6月10日（火）前日</option>
                <option value="2025-06-11">2025年6月11日（水）当日</option>
              </FormSelect>
              {errors.deliveryDate && <ErrorMessage>{errors.deliveryDate}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>搬入時間<RequiredMark>※</RequiredMark></FormLabel>
              <FormSelect
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="10:00-12:00">10:00-12:00（前日のみ）</option>
                <option value="13:00-15:00">13:00-15:00（前日のみ）</option>
                <option value="15:00-17:00">15:00-17:00（前日のみ）</option>
                <option value="17:00-19:00">17:00-19:00（前日のみ）</option>
                <option value="07:00-08:00">07:00-08:00（当日のみ）</option>
                <option value="08:00-09:00">08:00-09:00（当日のみ）</option>
              </FormSelect>
              {errors.deliveryTime && <ErrorMessage>{errors.deliveryTime}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>搬入物リスト<RequiredMark>※</RequiredMark></FormLabel>
            <FormTextarea
              name="itemsList"
              value={formData.itemsList}
              onChange={handleChange}
              placeholder="搬入予定の物品リストを入力してください（例：展示パネル3枚、製品サンプル5点、ノベルティグッズ100個など）"
            />
            {errors.itemsList && <ErrorMessage>{errors.itemsList}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>搬入物サイズ</FormLabel>
              <FormInput
                type="text"
                name="itemsSize"
                value={formData.itemsSize}
                onChange={handleChange}
                placeholder="例：最大 120cm×80cm×60cm"
              />
              <HelpText>最大のものや特に大きいものがあれば記入してください。</HelpText>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>搬入物重量</FormLabel>
              <FormInput
                type="text"
                name="itemsWeight"
                value={formData.itemsWeight}
                onChange={handleChange}
                placeholder="例：合計約50kg、最大20kg/個"
              />
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>特別な取り扱い</FormLabel>
            <FormTextarea
              name="specialHandling"
              value={formData.specialHandling}
              onChange={handleChange}
              placeholder="特別な取り扱いが必要な物品がある場合は記入してください。"
            />
            <HelpText>壊れやすいもの、温度管理が必要なものなど</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>設営・搬出情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>設営担当者</FormLabel>
            <FormInput
              type="text"
              name="setupPersonnel"
              value={formData.setupPersonnel}
              onChange={handleChange}
              placeholder="例：山田太郎、佐藤花子（計2名）"
            />
            <HelpText>設営を担当する方の氏名と人数を入力してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>設営所要時間</FormLabel>
            <FormSelect
              name="setupTime"
              value={formData.setupTime}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="1h">約1時間</option>
              <option value="2h">約2時間</option>
              <option value="3h">約3時間</option>
              <option value="4h">約4時間以上</option>
            </FormSelect>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>搬出日<RequiredMark>※</RequiredMark></FormLabel>
              <FormSelect
                name="removalDate"
                value={formData.removalDate}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="2025-06-11">2025年6月11日（水）当日</option>
                <option value="2025-06-12">2025年6月12日（木）翌日</option>
              </FormSelect>
              {errors.removalDate && <ErrorMessage>{errors.removalDate}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>搬出時間<RequiredMark>※</RequiredMark></FormLabel>
              <FormSelect
                name="removalTime"
                value={formData.removalTime}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="17:30-19:00">17:30-19:00（当日のみ）</option>
                <option value="19:00-20:30">19:00-20:30（当日のみ）</option>
                <option value="09:00-12:00">09:00-12:00（翌日のみ）</option>
              </FormSelect>
              {errors.removalTime && <ErrorMessage>{errors.removalTime}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>荷物の一時保管が必要ですか？</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="storage-yes"
                  name="storageRequired"
                  value="yes"
                  checked={formData.storageRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="storage-yes">はい</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="storage-no"
                  name="storageRequired"
                  value="no"
                  checked={formData.storageRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="storage-no">いいえ</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>会期前後に荷物を保管する必要がある場合は「はい」を選択してください。</HelpText>
          </FormGroup>
          
          {formData.storageRequired === 'yes' && (
            <FormGroup>
              <FormLabel>保管に関する詳細</FormLabel>
              <FormTextarea
                name="storageDetails"
                value={formData.storageDetails}
                onChange={handleChange}
                placeholder="保管が必要な荷物の内容、期間、サイズなどを記入してください。"
              />
              <HelpText>保管スペースには限りがあるため、ご希望に添えない場合があります。</HelpText>
            </FormGroup>
          )}
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
                placeholder="例：090-1234-5678"
              />
              {errors.contactPhone && <ErrorMessage>{errors.contactPhone}</ErrorMessage>}
              <HelpText>当日連絡可能な携帯電話番号を入力してください。</HelpText>
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>追加情報</FormLabel>
            <FormTextarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="搬入出に関するその他の情報や要望があれば記入してください。"
            />
          </FormGroup>
        </FormSection>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default LogisticsForm;
