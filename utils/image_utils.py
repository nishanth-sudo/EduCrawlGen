import re
import os
from typing import List, Dict, Any, Tuple

def extract_image_metadata(passage: str) -> Tuple[bool, List[str]]:
    """
    Extract image-related metadata from a passage.
    
    Args:
        passage: The text passage to analyze
        
    Returns:
        Tuple containing:
            - Boolean indicating if passage contains image references
            - List of extracted image keywords/references
    """
    # Common image-related keywords and patterns
    image_keywords = [
        "image", "img", "picture", "photo", "screenshot", "figure", 
        "visual", "diagram", "jpg", "png", "gif", "webp", "svg"
    ]
    
    # Check for image references
    contains_image_ref = any(kw in passage.lower() for kw in image_keywords)
    
    # Extract specific image references (like filenames)
    image_references = []
    
    # Look for image file patterns
    file_pattern = r'\b[\w-]+\.(jpg|jpeg|png|gif|webp|svg)\b'
    file_matches = re.findall(file_pattern, passage, re.IGNORECASE)
    if file_matches:
        image_references.extend(file_matches)
    
    # Look for image caption patterns
    caption_pattern = r'\[Images?:?\s*([^\]]+)\]'
    caption_matches = re.findall(caption_pattern, passage)
    if caption_matches:
        image_references.extend(caption_matches)
    
    # Look for image descriptions
    if "[Images saved with this article:]" in passage:
        image_references.append("article_images")
    
    return contains_image_ref, image_references

def enhance_passage_with_image_info(passage: str) -> str:
    """
    Enhance a passage with additional image metadata markers if needed.
    This helps improve retrieval for image-related queries.
    
    Args:
        passage: The original text passage
        
    Returns:
        Enhanced passage with image metadata if applicable
    """
    contains_images, image_refs = extract_image_metadata(passage)
    
    if not contains_images:
        return passage
    
    # Add image metadata marker if not already present
    if "[CONTAINS_IMAGES]" not in passage:
        enhanced_passage = f"[CONTAINS_IMAGES] {passage}"
        return enhanced_passage
    
    return passage