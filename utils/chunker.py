from config import CHUNK_SIZE, CHUNK_OVERLAP

def chunk_text(text):
    words = text.split()
    chunks = []

    if not words:
        return chunks

    for i in range(0, len(words), CHUNK_SIZE - CHUNK_OVERLAP):
        chunk = " ".join(words[i:i + CHUNK_SIZE])
        chunks.append(chunk.strip())

    return chunks
