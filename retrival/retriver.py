from embeddings.vector_score import load_index
from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL
import re
from utils.image_utils import extract_image_metadata, enhance_passage_with_image_info
from utils.diagram_retriever import process_diagram_query, enhance_passage_with_diagram

model = SentenceTransformer(EMBEDDING_MODEL)

def retrieve_passages(query, top_k=5, include_images=True):
    """
    Retrieve relevant passages based on the query, with support for image content.
    
    Args:
        query: The search query
        top_k: Number of passages to retrieve
        include_images: Whether to prioritize image-related content
        
    Returns:
        List of relevant passages
    """
    index, passages = load_index()
    query_vec = model.encode([query])[0].reshape(1, -1)
    D, I = index.search(query_vec, top_k)
    
    # Determine if query is image-related
    image_related_query = any(kw in query.lower() for kw in [
        "image", "picture", "photo", "visual", "diagram", "screenshot", 
        "figure", "jpg", "png", "gif", "webp", "svg"
    ])
    
    # Optional: Filter/Boost passages with code or image keywords
    preferred_passages = []
    for i in I[0]:
        passage = passages[i]
        passage_lower = passage.lower()
        
        # Extract image metadata
        contains_image_ref, image_references = extract_image_metadata(passage)
        
        # Check if passage contains code references
        contains_code = any(kw in passage_lower for kw in ["example", "code", "import", "def", "class", "for ", "print"])
        
        # Check for diagram-related content
        is_diagram = any(kw in passage_lower for kw in ["diagram", "flowchart", "architecture", "structure"])
        
        # Prioritize based on query and content
        if image_related_query and contains_image_ref:
            if is_diagram:
                # For diagram queries, enhance with diagram analysis
                enhanced_passage = enhance_passage_with_diagram(passage, image_references)
            else:
                # For other image queries, use standard enhancement
                enhanced_passage = enhance_passage_with_image_info(passage)
            preferred_passages.insert(0, enhanced_passage)  # Highest priority for image content
        elif contains_image_ref and include_images:
            if is_diagram:
                enhanced_passage = enhance_passage_with_diagram(passage, image_references)
            else:
                enhanced_passage = enhance_passage_with_image_info(passage)
            preferred_passages.insert(0, enhanced_passage)  # High priority for image content
        elif contains_code:
            if len(preferred_passages) > 0 and any(kw in preferred_passages[0].lower() for kw in ["image", "img", "picture"]):
                preferred_passages.insert(1, passage)  # Place after image content
            else:
                preferred_passages.insert(0, passage)  # Prioritize code-related
        else:
            preferred_passages.append(passage)
    
    return preferred_passages[:top_k]

def retrieve_image_passages(query, top_k=5):
    """
    Specialized retrieval function focused on image-related content.
    
    Args:
        query: The search query
        top_k: Number of passages to retrieve
        
    Returns:
        List of image-related passages
    """
    # Force image inclusion and use a higher top_k to ensure we get enough image content
    all_passages = retrieve_passages(query, top_k=top_k*2, include_images=True)
    
    # Filter to prioritize passages with image references
    image_passages = []
    other_passages = []
    
    for passage in all_passages:
        contains_image_ref, _ = extract_image_metadata(passage)
        if contains_image_ref:
            image_passages.append(passage)
        else:
            other_passages.append(passage)
    
    # Combine results, prioritizing image passages
    result = image_passages + other_passages
    return result[:top_k]
