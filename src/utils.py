import base64
import sympy as sp
import pytesseract
from PIL import Image
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter


def solve_equation(image_string):
    base64_data = image_string.split(",")[1]
    image_data = base64.b64decode(base64_data)
    image = Image.open(BytesIO(image_data))

    # grey scale
    image = image.convert("L")
    # enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)
    # resize to make text parger
    image = image.resize((image.width * 2, image.height * 2))
    # sharpen image
    image = image.filter(ImageFilter.SHARPEN)
    # image.save("eqn.png")

    equation_text = pytesseract.image_to_string(image)
    equation_text = equation_text.strip()
    return str(sp.sympify(equation_text))
