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
            
            # 各ページからテキストを抽出
            for page_num in range(num_pages):
                if page_num > 10:  # 最初の10ページまで表示
                    print(f"... 残り {num_pages - page_num} ページは省略します ...")
                    break
                    
                page = reader.pages[page_num]
                text = page.extract_text()
                
                if text:
                    print(f"--- ページ {page_num + 1} ---")
                    print(text[:2000])  # 各ページの最初の2000文字まで表示
                    print("...")
                else:
                    print(f"ページ {page_num + 1} にはテキストがありません。")
                print("-"*50)
            
            return True
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return False

def main():
    reference_dir = "/Users/kosoto/jimu_web/reference"
    
    # リファレンスディレクトリ内のPDFファイルを検索
    pdf_files = [f for f in os.listdir(reference_dir) if f.endswith('.pdf')]
    
    if not pdf_files:
        print("PDFファイルが見つかりませんでした。")
        return
    
    print(f"{len(pdf_files)}個のPDFファイルが見つかりました。")
    
    # 各PDFファイルからテキストを抽出
    for pdf_file in pdf_files:
        pdf_path = os.path.join(reference_dir, pdf_file)
        print("\n" + "="*50)
        success = extract_text_from_pdf(pdf_path)
        if not success:
            print(f"{pdf_file}の処理中にエラーが発生しました。")

if __name__ == "__main__":
    main()
