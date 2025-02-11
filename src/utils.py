import re
import base64
import tempfile
import mimetypes
import sympy as sp
import pytesseract
from PIL import Image
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter
from anticaptchaofficial.imagecaptcha import imagecaptcha


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


def save_image_tmp(image_string):
    match = re.match(r"data:(image/\w+);base64,(.*)", image_string)
    if not match:
        raise ValueError("Invalid data URI format")
    mime_type, base64_data = match.groups()

    # guess ext i.e., jpg
    ext = mimetypes.guess_extension(mime_type)
    # decode the Base64 data
    image_data = base64.b64decode(base64_data)

    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp_file:
        tmp_file.write(image_data)
    return tmp_file.name


def solve_image_captcha(image_string, anticaptcha_key):
    image_path = save_image_tmp(image_string=image_string)

    solver = imagecaptcha()
    solver.set_verbose(1)
    solver.set_key(anticaptcha_key)
    captcha_text = solver.solve_and_return_solution(image_path)
    if captcha_text != 0:
        return captcha_text

    raise Exception(
        f"Error solving captcha, {solver.err_string=}, {solver.error_code=}"
    )
