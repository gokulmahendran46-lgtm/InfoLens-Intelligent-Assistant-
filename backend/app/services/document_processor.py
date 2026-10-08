"""
Document processor service.
Extracts text from PDF, DOCX, TXT, and image files.
"""
import io
import os
from pathlib import Path
from typing import Tuple


def extract_text_from_file(file_path: str, filename: str) -> Tuple[str, int]:
    """
    Extract text and page count from a document.
    Returns (extracted_text, page_count).
    """
    ext = Path(filename).suffix.lower()
    text = ""
    pages = 1

    try:
        if ext == ".pdf":
            text, pages = _extract_pdf(file_path)
        elif ext in (".docx", ".doc"):
            text, pages = _extract_docx(file_path)
        elif ext == ".txt":
            text, pages = _extract_txt(file_path)
        elif ext in (".jpg", ".jpeg", ".png", ".webp", ".bmp"):
            text, pages = _extract_image(file_path)
        else:
            text = f"Unsupported file type: {ext}"
    except Exception as e:
        text = f"[Text extraction failed: {str(e)}]"

    return text, pages


def _extract_pdf(file_path: str) -> Tuple[str, int]:
    try:
        import PyPDF2  # type: ignore
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            pages = len(reader.pages)
            text_parts = []
            for page in reader.pages:
                text_parts.append(page.extract_text() or "")
            return "\n\n".join(text_parts), pages
    except ImportError:
        return "[PyPDF2 not installed — install it to enable PDF extraction]", 1


def _extract_docx(file_path: str) -> Tuple[str, int]:
    try:
        from docx import Document  # type: ignore
        doc = Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        # Estimate pages: ~300 words per page
        word_count = sum(len(p.split()) for p in paragraphs)
        pages = max(1, word_count // 300)
        return "\n\n".join(paragraphs), pages
    except ImportError:
        return "[python-docx not installed — install it to enable DOCX extraction]", 1


def _extract_txt(file_path: str) -> Tuple[str, int]:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    pages = max(1, content.count("\n") // 50)
    return content, pages


def _extract_image(file_path: str) -> Tuple[str, int]:
    try:
        import pytesseract  # type: ignore
        from PIL import Image  # type: ignore
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text, 1
    except ImportError:
        return "[pytesseract/Pillow not installed — install them to enable OCR]", 1
    except Exception as e:
        return f"[OCR failed: {str(e)}]", 1
