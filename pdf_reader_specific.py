import os
import sys
import PyPDF2

def extract_text_from_pdf(pdf_path):
    """
    PDFファイルからテキストを抽出する関数
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            num_pages = len(reader.pages)
            
            print(f"PDFファイル: {os.path.basename(pdf_path)}")
            print(f"ページ数: {num_pages}")
            print("="*50)
            
            all_text = ""
            # 各ページからテキストを抽出
            for page_num in range(num_pages):
                page = reader.pages[page_num]
                text = page.extract_text()
                if text:
                    all_text += f"\n--- ページ {page_num + 1} ---\n"
                    all_text += text + "\n"
            
            return all_text
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return None

def main():
    pdf_path = "/Users/kosoto/jimu_web/reference/FMX共有_【PROSPECTUS】DATA SUMMIT 2025_協賛プラン_v4.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"ファイルが見つかりません: {pdf_path}")
        return
    
    text = extract_text_from_pdf(pdf_path)
    if text:
        # テキストファイルに保存
        output_path = pdf_path.replace('.pdf', '.txt')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"テキストを {output_path} に保存しました。")
        
        # 最初の部分を表示
        print("\n最初の3000文字:")
        print(text[:3000])

if __name__ == "__main__":
    main()
