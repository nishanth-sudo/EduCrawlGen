import pickle
import faiss
from config import VECTOR_STORE_PATH, EMBEDDINGS_PATH

def load_index():
    index = faiss.read_index(VECTOR_STORE_PATH)
    with open(EMBEDDINGS_PATH, "rb") as f:
        passages = pickle.load(f)
    return index, passages
