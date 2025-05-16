from typing import List, Dict, Any
from .diagram_analyzer import analyze_diagram, generate_block_diagram
from .image_utils import extract_image_metadata
import os

def process_diagram_query(query: str, image_paths: List[str]) -> Dict[str, Any]:
    """
    Process a diagram-related query and analyze relevant diagrams.
    
    Args:
        query: The user's query about diagrams
        image_paths: List of paths to available images
        
    Returns:
        Dictionary containing diagram analysis and block representation
    """
    # Check if query is diagram-related
    diagram_keywords = ['diagram', 'flowchart', 'architecture', 'structure', 'block diagram']
    is_diagram_query = any(kw in query.lower() for kw in diagram_keywords)
    
    if not is_diagram_query:
        return None
    
    # Process each image and find diagrams
    diagram_results = []
    for image_path in image_paths:
        try:
            # Analyze the image
            analysis = analyze_diagram(image_path)
            
            # Generate block diagram representation
            block_diagram = generate_block_diagram(analysis)
            
            diagram_results.append({
                'image_path': image_path,
                'analysis': analysis,
                'block_diagram': block_diagram
            })
        except Exception as e:
            print(f"Error processing diagram {image_path}: {str(e)}")
            continue
    
    return {
        'query': query,
        'diagrams': diagram_results
    }

def enhance_passage_with_diagram(passage: str, image_paths: List[str]) -> str:
    """
    Enhance a passage with diagram analysis if it contains diagram references.
    
    Args:
        passage: The text passage
        image_paths: List of image paths referenced in the passage
        
    Returns:
        Enhanced passage with diagram analysis
    """
    contains_images, image_refs = extract_image_metadata(passage)
    
    if not contains_images:
        return passage
    
    # Look for diagram references
    diagram_keywords = ['diagram', 'flowchart', 'architecture', 'structure']
    is_diagram = any(kw in passage.lower() for kw in diagram_keywords)
    
    if not is_diagram:
        return passage
    
    # Analyze referenced diagrams
    diagram_info = []
    for image_path in image_paths:
        try:
            analysis = analyze_diagram(image_path)
            block_diagram = generate_block_diagram(analysis)
            
            # Add diagram information
            diagram_info.append(
                f"\n[DIAGRAM_ANALYSIS]\n"
                f"Image: {os.path.basename(image_path)}\n"
                f"Components: {len(analysis['shapes'])} shapes, {len(analysis['connections'])} connections\n"
                f"Block Diagram:\n{block_diagram}"
            )
        except Exception as e:
            print(f"Error analyzing diagram {image_path}: {str(e)}")
            continue
    
    # Enhance passage with diagram information
    if diagram_info:
        enhanced_passage = passage + '\n' + '\n'.join(diagram_info)
        return enhanced_passage
    
    return passage