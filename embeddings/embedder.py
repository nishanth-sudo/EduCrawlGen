import pickle
import faiss
import os
from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL, VECTOR_STORE_PATH, EMBEDDINGS_PATH

model = SentenceTransformer(EMBEDDING_MODEL)

def embed_passages(passages):
    embeddings = model.encode(passages, convert_to_tensor=False)
    return embeddings

def save_embeddings(passages, embeddings):
    dim = embeddings[0].shape[0]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    faiss.write_index(index, VECTOR_STORE_PATH)
    with open(EMBEDDINGS_PATH, "wb") as f:
        pickle.dump(passages, f)
