import fitz  # PyMuPDF

def pdf_to_text(path):
    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return ""
