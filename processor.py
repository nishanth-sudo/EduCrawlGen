import os
from tqdm import tqdm
from utils.pdf_parser import pdf_to_text
from utils.chunker import chunk_text
from embeddings.embedder import embed_passages, save_embeddings
from utils.image_extractor import extract_and_save_images


BOOKS_DIR = "data/books/"
PROCESSED_DIR = "data/processed/"

def load_books():
    texts = []
    image_data = []  # List of dicts: {'filename': ..., 'page': ..., 'image_path': ...}

    for filename in os.listdir(BOOKS_DIR):
        path = os.path.join(BOOKS_DIR, filename)
        if filename.endswith(".pdf"):
            print(f"Parsing PDF (text): {filename}")
            text_content = pdf_to_text(path)
            texts.append(text_content)

            print(f"Extracting and saving images from: {filename}")
            images = extract_and_save_images(path, filename)
            image_data.extend(images)

        elif filename.endswith(".txt"):
            print(f"Loading TXT: {filename}")
            with open(path, "r", encoding="utf-8") as f:
                texts.append(f.read())

    return texts, image_data

def process_books():
    texts, _ = load_books()
    all_chunks = []
    for text in tqdm(texts, desc="Chunking books"):
        chunks = chunk_text(text)
        all_chunks.extend(chunks)

    print(f"Total chunks: {len(all_chunks)}")
    print("Generating embeddings...")
    embeddings = embed_passages(all_chunks)
    print("Saving index and passages...")
    save_embeddings(all_chunks, embeddings)
    print("✅ Done processing all books!")

if __name__ == "__main__":
    process_books()
