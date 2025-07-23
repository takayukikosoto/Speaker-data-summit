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

const ReceptionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    position: '',
    email: '',
    phone: '',
    participantType: '',
    attendanceDate: '2025-06-11',
    dietaryRestrictions: [],
    otherDietaryRestrictions: '',
    alcoholPreference: 'any',
    specialRequests: '',
    companionCount: '0',
    companionNames: '',
    participationStatus: 'confirmed',
    termsAgreed: false
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
    const { name, value, checked } = e.target;
    
    if (name === 'termsAgreed') {
      setFormData({
        ...formData,
        [name]: checked
      });
      
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
      return;
    }
    
    // 複数選択の場合（配列）
    let updatedSelection = [...formData[name]];
    
    if (checked) {
      updatedSelection.push(value);
    } else {
      updatedSelection = updatedSelection.filter(item => item !== value);
    }
    
    setFormData({
      ...formData,
      [name]: updatedSelection
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
    if (!formData.firstName.trim()) {
      newErrors.firstName = '名は必須です';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '姓は必須です';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名は必須です';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = '役職は必須です';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    }
    
    if (!formData.participantType) {
      newErrors.participantType = '参加者タイプは必須です';
    }
    
    if (formData.companionCount !== '0' && !formData.companionNames.trim()) {
      newErrors.companionNames = '同伴者の氏名を入力してください';
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = '参加規約に同意してください';
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
        firstName: '',
        lastName: '',
        companyName: '',
        position: '',
        email: '',
        phone: '',
        participantType: '',
        attendanceDate: '2025-06-11',
        dietaryRestrictions: [],
        otherDietaryRestrictions: '',
        alcoholPreference: 'any',
        specialRequests: '',
        companionCount: '0',
        companionNames: '',
        participationStatus: 'confirmed',
        termsAgreed: false
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
          <h3>懇親会参加登録が完了しました</h3>
          <p>ご登録ありがとうございます。懇親会の詳細については、後日メールでご連絡いたします。</p>
        </SuccessMessage>
        <Link to="/forms" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>
          フォーム一覧に戻る
        </Link>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      <FormTitle>primeNumber DATA SUMMIT 2025懇親会参加登録フォーム</FormTitle>
      <FormDescription>
        primeNumber DATA SUMMIT 2025の懇親会にご参加いただける方は、このフォームからご登録ください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>参加者情報</SectionTitle>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>名<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="例：太郎"
              />
              {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>姓<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="例：山田"
              />
              {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
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
            <FormLabel>役職<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="例：マーケティング部長"
            />
            {errors.position && <ErrorMessage>{errors.position}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>メールアドレス<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="例：sample@example.com"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="例：090-1234-5678"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              <HelpText>当日連絡可能な番号を入力してください</HelpText>
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>参加者タイプ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="participantType"
              value={formData.participantType}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="speaker">講演者</option>
              <option value="exhibitor">出展者</option>
              <option value="sponsor">スポンサー</option>
              <option value="attendee">一般参加者</option>
              <option value="press">プレス</option>
              <option value="vip">VIP</option>
              <option value="staff">スタッフ</option>
            </FormSelect>
            {errors.participantType && <ErrorMessage>{errors.participantType}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>懇親会詳細</SectionTitle>
          
          <FormGroup>
            <FormLabel>参加日</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="date-day1"
                  name="attendanceDate"
                  value="2025-06-11"
                  checked={formData.attendanceDate === '2025-06-11'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="date-day1">2025年6月11日（水）18:30〜20:30</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>懇親会は初日（6月11日）のみの開催となります</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>食事制限</FormLabel>
            <CheckboxContainer>
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="diet-vegetarian"
                  name="dietaryRestrictions"
                  value="vegetarian"
                  checked={formData.dietaryRestrictions.includes('vegetarian')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="diet-vegetarian">ベジタリアン</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="diet-vegan"
                  name="dietaryRestrictions"
                  value="vegan"
                  checked={formData.dietaryRestrictions.includes('vegan')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="diet-vegan">ビーガン</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="diet-gluten-free"
                  name="dietaryRestrictions"
                  value="gluten-free"
                  checked={formData.dietaryRestrictions.includes('gluten-free')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="diet-gluten-free">グルテンフリー</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="diet-halal"
                  name="dietaryRestrictions"
                  value="halal"
                  checked={formData.dietaryRestrictions.includes('halal')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="diet-halal">ハラール</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="diet-other"
                  name="dietaryRestrictions"
                  value="other"
                  checked={formData.dietaryRestrictions.includes('other')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="diet-other">その他</label>
              </div>
            </CheckboxContainer>
          </FormGroup>
          
          {formData.dietaryRestrictions.includes('other') && (
            <FormGroup>
              <FormLabel>その他の食事制限</FormLabel>
              <FormTextarea
                name="otherDietaryRestrictions"
                value={formData.otherDietaryRestrictions}
                onChange={handleChange}
                placeholder="アレルギーなど、その他の食事制限がある場合は詳細を記入してください。"
              />
            </FormGroup>
          )}
          
          <FormGroup>
            <FormLabel>アルコール</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="alcohol-any"
                  name="alcoholPreference"
                  value="any"
                  checked={formData.alcoholPreference === 'any'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="alcohol-any">制限なし</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="alcohol-none"
                  name="alcoholPreference"
                  value="none"
                  checked={formData.alcoholPreference === 'none'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="alcohol-none">ノンアルコール希望</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>特別リクエスト</FormLabel>
            <FormTextarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="その他のリクエストがあれば記入してください。"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>同伴者情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>同伴者数</FormLabel>
            <FormSelect
              name="companionCount"
              value={formData.companionCount}
              onChange={handleChange}
            >
              <option value="0">0名（本人のみ）</option>
              <option value="1">1名</option>
              <option value="2">2名</option>
              <option value="3">3名</option>
            </FormSelect>
            <HelpText>同伴者はスポンサー・VIPの方のみ登録可能です（上限あり）</HelpText>
          </FormGroup>
          
          {formData.companionCount !== '0' && (
            <FormGroup>
              <FormLabel>同伴者氏名<RequiredMark>※</RequiredMark></FormLabel>
              <FormTextarea
                name="companionNames"
                value={formData.companionNames}
                onChange={handleChange}
                placeholder="同伴者の氏名と会社名を記入してください。複数の場合は改行で区切ってください。"
              />
              {errors.companionNames && <ErrorMessage>{errors.companionNames}</ErrorMessage>}
            </FormGroup>
          )}
        </FormSection>
        
        <FormSection>
          <SectionTitle>参加ステータス</SectionTitle>
          
          <FormGroup>
            <FormLabel>参加ステータス</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="status-confirmed"
                  name="participationStatus"
                  value="confirmed"
                  checked={formData.participationStatus === 'confirmed'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="status-confirmed">参加確定</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="status-tentative"
                  name="participationStatus"
                  value="tentative"
                  checked={formData.participationStatus === 'tentative'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="status-tentative">参加予定（未確定）</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>現時点での予定をお知らせください。変更がある場合は後日ご連絡ください。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormGroup>
          <CheckboxContainer>
            <div>
              <FormCheckbox
                type="checkbox"
                id="terms-agreed"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms-agreed">
                <span>参加規約に同意します<RequiredMark>※</RequiredMark></span>
              </label>
            </div>
          </CheckboxContainer>
          {errors.termsAgreed && <ErrorMessage>{errors.termsAgreed}</ErrorMessage>}
          <HelpText>
            参加規約の詳細は<Link to="/reception-terms" target="_blank">こちら</Link>をご確認ください。
          </HelpText>
        </FormGroup>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default ReceptionForm;
