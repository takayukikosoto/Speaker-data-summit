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
  SuccessMessage
} from '../../components/FormComponents';

const PresentationEnvForm = () => {
  const [formData, setFormData] = useState({
    sessionId: '',
    speakerName: '',
    speakerCompany: '',
    presentationType: '',
    screenRatio: '16:9',
    ownLaptop: 'yes',
    laptopOS: '',
    laptopModel: '',
    videoOutput: [],
    audioRequirements: [],
    microphoneType: '',
    internetRequired: 'no',
    specialSoftware: '',
    specialHardware: '',
    rehearsalRequired: 'no',
    rehearsalTime: '',
    presentationNotes: '',
    accessibility: '',
    additionalRequirements: ''
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
      
      // エラーをクリア
      if (errors[arrayFieldName]) {
        setErrors({
          ...errors,
          [arrayFieldName]: null
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.sessionId.trim()) {
      newErrors.sessionId = 'セッションIDは必須です';
    }
    
    if (!formData.speakerName.trim()) {
      newErrors.speakerName = '講演者名は必須です';
    }
    
    if (!formData.speakerCompany.trim()) {
      newErrors.speakerCompany = '会社/組織名は必須です';
    }
    
    if (!formData.presentationType) {
      newErrors.presentationType = 'プレゼンテーションタイプは必須です';
    }
    
    if (formData.ownLaptop === 'yes' && !formData.laptopOS) {
      newErrors.laptopOS = 'ノートPCのOSは必須です';
    }
    
    if (formData.videoOutput.length === 0) {
      newErrors.videoOutput = '映像出力は少なくとも1つ選択してください';
    }
    
    if (!formData.microphoneType) {
      newErrors.microphoneType = 'マイクタイプは必須です';
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
        sessionId: '',
        speakerName: '',
        speakerCompany: '',
        presentationType: '',
        screenRatio: '16:9',
        ownLaptop: 'yes',
        laptopOS: '',
        laptopModel: '',
        videoOutput: [],
        audioRequirements: [],
        microphoneType: '',
        internetRequired: 'no',
        specialSoftware: '',
        specialHardware: '',
        rehearsalRequired: 'no',
        rehearsalTime: '',
        presentationNotes: '',
        accessibility: '',
        additionalRequirements: ''
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
          <h3>講演環境情報が送信されました</h3>
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
      <FormTitle>講演環境フォーム</FormTitle>
      <FormDescription>
        講演に必要な機材、環境設定、特別な要望などを登録してください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>基本情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>セッションID<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="sessionId"
              value={formData.sessionId}
              onChange={handleChange}
              placeholder="例：S-123"
            />
            {errors.sessionId && <ErrorMessage>{errors.sessionId}</ErrorMessage>}
            <HelpText>セッション情報フォーム送信後に発行されたIDを入力してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>講演者名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="speakerName"
              value={formData.speakerName}
              onChange={handleChange}
              placeholder="例：山田 太郎"
            />
            {errors.speakerName && <ErrorMessage>{errors.speakerName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>会社/組織名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="speakerCompany"
              value={formData.speakerCompany}
              onChange={handleChange}
              placeholder="例：株式会社サンプル"
            />
            {errors.speakerCompany && <ErrorMessage>{errors.speakerCompany}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>プレゼンテーション環境</SectionTitle>
          
          <FormGroup>
            <FormLabel>プレゼンテーションタイプ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="presentationType"
              value={formData.presentationType}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="slides">スライド（PowerPoint/Keynote等）</option>
              <option value="demo">デモンストレーション</option>
              <option value="video">動画再生</option>
              <option value="interactive">インタラクティブコンテンツ</option>
              <option value="hybrid">複合型（複数の要素を含む）</option>
            </FormSelect>
            {errors.presentationType && <ErrorMessage>{errors.presentationType}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>スクリーン比率</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="ratio-16-9"
                  name="screenRatio"
                  value="16:9"
                  checked={formData.screenRatio === '16:9'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="ratio-16-9">16:9（ワイドスクリーン）</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="ratio-4-3"
                  name="screenRatio"
                  value="4:3"
                  checked={formData.screenRatio === '4:3'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="ratio-4-3">4:3（標準）</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>特に指定がない場合は16:9を選択してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>ご自身のノートPCを使用しますか？</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="own-laptop-yes"
                  name="ownLaptop"
                  value="yes"
                  checked={formData.ownLaptop === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="own-laptop-yes">はい、自分のノートPCを使用します</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="own-laptop-no"
                  name="ownLaptop"
                  value="no"
                  checked={formData.ownLaptop === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="own-laptop-no">いいえ、会場のPCを使用します</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          {formData.ownLaptop === 'yes' && (
            <>
              <FormGroup>
                <FormLabel>ノートPCのOS<RequiredMark>※</RequiredMark></FormLabel>
                <FormSelect
                  name="laptopOS"
                  value={formData.laptopOS}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="other">その他</option>
                </FormSelect>
                {errors.laptopOS && <ErrorMessage>{errors.laptopOS}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>ノートPCの機種</FormLabel>
                <FormInput
                  type="text"
                  name="laptopModel"
                  value={formData.laptopModel}
                  onChange={handleChange}
                  placeholder="例：MacBook Pro 2023"
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <FormLabel>映像出力<RequiredMark>※</RequiredMark></FormLabel>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="video-hdmi"
                name="video-hdmi"
                value="HDMI"
                data-field="videoOutput"
                checked={formData.videoOutput.includes('HDMI')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="video-hdmi">HDMI</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="video-vga"
                name="video-vga"
                value="VGA"
                data-field="videoOutput"
                checked={formData.videoOutput.includes('VGA')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="video-vga">VGA</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="video-displayport"
                name="video-displayport"
                value="DisplayPort"
                data-field="videoOutput"
                checked={formData.videoOutput.includes('DisplayPort')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="video-displayport">DisplayPort</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="video-usbc"
                name="video-usbc"
                value="USB-C"
                data-field="videoOutput"
                checked={formData.videoOutput.includes('USB-C')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="video-usbc">USB-C</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="video-other"
                name="video-other"
                value="その他"
                data-field="videoOutput"
                checked={formData.videoOutput.includes('その他')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="video-other">その他（詳細を追加要件に記入）</label>
            </CheckboxContainer>
            
            {errors.videoOutput && <ErrorMessage>{errors.videoOutput}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>音声設定</SectionTitle>
          
          <FormGroup>
            <FormLabel>音声要件（複数選択可）</FormLabel>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="audio-pc"
                name="audio-pc"
                value="PC音声出力"
                data-field="audioRequirements"
                checked={formData.audioRequirements.includes('PC音声出力')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="audio-pc">PC音声出力（デモ・動画の音声）</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="audio-bgm"
                name="audio-bgm"
                value="BGM"
                data-field="audioRequirements"
                checked={formData.audioRequirements.includes('BGM')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="audio-bgm">BGM</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="audio-none"
                name="audio-none"
                value="音声なし"
                data-field="audioRequirements"
                checked={formData.audioRequirements.includes('音声なし')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="audio-none">音声なし</label>
            </CheckboxContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>マイクタイプ<RequiredMark>※</RequiredMark></FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="mic-handheld"
                  name="microphoneType"
                  value="handheld"
                  checked={formData.microphoneType === 'handheld'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="mic-handheld">ハンドヘルド（手持ち）</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="mic-lapel"
                  name="microphoneType"
                  value="lapel"
                  checked={formData.microphoneType === 'lapel'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="mic-lapel">ピンマイク（ラペル）</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="mic-headset"
                  name="microphoneType"
                  value="headset"
                  checked={formData.microphoneType === 'headset'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="mic-headset">ヘッドセット</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="mic-podium"
                  name="microphoneType"
                  value="podium"
                  checked={formData.microphoneType === 'podium'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="mic-podium">固定マイク（演台）</label>
              </RadioOption>
            </RadioContainer>
            {errors.microphoneType && <ErrorMessage>{errors.microphoneType}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>追加要件</SectionTitle>
          
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
            <HelpText>インターネット接続が必要な場合は、有線LANと無線Wi-Fiの両方が利用可能です。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>特別なソフトウェア要件</FormLabel>
            <FormTextarea
              name="specialSoftware"
              value={formData.specialSoftware}
              onChange={handleChange}
              placeholder="プレゼンテーションに必要な特別なソフトウェアがあれば記入してください。"
            />
            <HelpText>会場PCを使用する場合、標準的なソフトウェア（Office、Adobe Reader等）は利用可能です。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>特別なハードウェア要件</FormLabel>
            <FormTextarea
              name="specialHardware"
              value={formData.specialHardware}
              onChange={handleChange}
              placeholder="プレゼンテーションに必要な特別なハードウェアがあれば記入してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>リハーサルが必要ですか？</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="rehearsal-yes"
                  name="rehearsalRequired"
                  value="yes"
                  checked={formData.rehearsalRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="rehearsal-yes">はい</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="rehearsal-no"
                  name="rehearsalRequired"
                  value="no"
                  checked={formData.rehearsalRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="rehearsal-no">いいえ</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          {formData.rehearsalRequired === 'yes' && (
            <FormGroup>
              <FormLabel>希望するリハーサル時間</FormLabel>
              <FormSelect
                name="rehearsalTime"
                value={formData.rehearsalTime}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="day_before">前日（6月10日）</option>
                <option value="morning">当日朝（9:00-10:00）</option>
                <option value="lunch">昼休憩（12:00-13:30）</option>
                <option value="break">休憩時間（15:00-15:30）</option>
              </FormSelect>
              <HelpText>リハーサルは時間に限りがあるため、ご希望に添えない場合があります。</HelpText>
            </FormGroup>
          )}
          
          <FormGroup>
            <FormLabel>プレゼンテーションに関する特記事項</FormLabel>
            <FormTextarea
              name="presentationNotes"
              value={formData.presentationNotes}
              onChange={handleChange}
              placeholder="プレゼンテーションに関する特記事項があれば記入してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>アクセシビリティ要件</FormLabel>
            <FormTextarea
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              placeholder="アクセシビリティに関する要件があれば記入してください。"
            />
            <HelpText>車椅子アクセス、手話通訳など、特別なサポートが必要な場合は記入してください。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>その他の追加要件</FormLabel>
            <FormTextarea
              name="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={handleChange}
              placeholder="その他、講演環境に関する要望や質問があれば記入してください。"
            />
          </FormGroup>
        </FormSection>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default PresentationEnvForm;
