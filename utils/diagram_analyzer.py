import cv2
import numpy as np
from PIL import Image
import os
from typing import Dict, Any, List, Tuple

def analyze_diagram(image_path: str) -> Dict[str, Any]:
    """
    Analyze a diagram image and extract its components and structure.
    
    Args:
        image_path: Path to the diagram image file
        
    Returns:
        Dictionary containing diagram analysis results
    """
    # Load and preprocess the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from {image_path}")
    
    # Convert to grayscale for better shape detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding to get binary image
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Analyze shapes and connections
    shapes = []
    for contour in contours:
        # Approximate the contour to a simpler shape
        epsilon = 0.04 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        # Get shape properties
        x, y, w, h = cv2.boundingRect(contour)
        center = (x + w//2, y + h//2)
        
        # Determine shape type based on number of vertices
        vertices = len(approx)
        shape_type = 'unknown'
        if vertices == 3:
            shape_type = 'triangle'
        elif vertices == 4:
            # Check if it's a square or rectangle
            aspect_ratio = float(w)/h
            shape_type = 'square' if 0.95 <= aspect_ratio <= 1.05 else 'rectangle'
        elif vertices > 4:
            shape_type = 'circle' if vertices > 8 else 'polygon'
        
        shapes.append({
            'type': shape_type,
            'position': center,
            'size': (w, h),
            'vertices': vertices
        })
    
    # Find connections between shapes
    connections = []
    for i, shape1 in enumerate(shapes):
        for j, shape2 in enumerate(shapes[i+1:], i+1):
            # Check if shapes are connected by looking for lines between their centers
            pt1 = shape1['position']
            pt2 = shape2['position']
            
            # Draw a line between centers and check if it intersects with any black pixels
            mask = np.zeros_like(gray)
            cv2.line(mask, pt1, pt2, 255, 2)
            intersection = cv2.bitwise_and(binary, mask)
            
            if cv2.countNonZero(intersection) > 0:
                connections.append({
                    'from': i,
                    'to': j,
                    'type': 'line'
                })
    
    return {
        'shapes': shapes,
        'connections': connections,
        'image_size': image.shape[:2]
    }

def generate_block_diagram(analysis_result: Dict[str, Any]) -> str:
    """
    Generate a textual block diagram representation from the analysis results.
    
    Args:
        analysis_result: Dictionary containing diagram analysis data
        
    Returns:
        String containing ASCII representation of the block diagram
    """
    height, width = analysis_result['image_size']
    canvas = [[' ' for _ in range(width//10)] for _ in range(height//10)]
    
    # Place shapes
    for i, shape in enumerate(analysis_result['shapes']):
        x, y = shape['position']
        x, y = x//10, y//10
        if 0 <= x < width//10 and 0 <= y < height//10:
            canvas[y][x] = str(i)
    
    # Draw connections
    for conn in analysis_result['connections']:
        shape1 = analysis_result['shapes'][conn['from']]
        shape2 = analysis_result['shapes'][conn['to']]
        x1, y1 = shape1['position']
        x2, y2 = shape2['position']
        x1, y1 = x1//10, y1//10
        x2, y2 = x2//10, y2//10
        
        # Draw simple line
        if x1 == x2:
            for y in range(min(y1, y2), max(y1, y2)):
                if canvas[y][x1] == ' ':
                    canvas[y][x1] = '|'
        elif y1 == y2:
            for x in range(min(x1, x2), max(x1, x2)):
                if canvas[y1][x] == ' ':
                    canvas[y1][x] = '-'
    
    # Convert canvas to string
    return '\n'.join(''.join(row) for row in canvas)