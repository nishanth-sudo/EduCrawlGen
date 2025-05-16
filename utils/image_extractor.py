import fitz  # PyMuPDF
import os
from PIL import Image
import io

def extract_and_save_images(pdf_path, pdf_name, output_dir="data/processed/images"):
    os.makedirs(output_dir, exist_ok=True)
    image_data = []

    with fitz.open(pdf_path) as doc:
        for page_number, page in enumerate(doc):
            images = page.get_images(full=True)
            for i, img in enumerate(images):
                xref = img[0]
                try:
                    # Try the standard extraction method first
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    image = Image.open(io.BytesIO(image_bytes))
                except Exception as e:
                    # Fallback method using pixmap for images with alpha channels
                    print(f"Using fallback method for image extraction: {str(e)}")
                    pix = fitz.Pixmap(doc, xref)
                    if pix.alpha:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    # Convert pixmap to PNG bytes
                    image_bytes = pix.tobytes("png")
                    image = Image.open(io.BytesIO(image_bytes))
                    image_ext = "png"  # Use PNG for fallback method to preserve quality
                
                # Convert image to RGB if it has alpha channel
                if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
                    image = image.convert('RGB')
                    image_ext = 'jpg'  # Force JPEG format for converted images

                image_filename = f"{os.path.splitext(pdf_name)[0]}_page{page_number+1}_img{i+1}.{image_ext}"
                image_path = os.path.join(output_dir, image_filename)
                image.save(image_path, quality=95)  # Set JPEG quality to 95%

                image_data.append({
                    "filename": image_filename,
                    "page": page_number + 1,
                    "image_path": image_path
                })

    return image_data
