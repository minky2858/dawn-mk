FROM ubuntu:22.04

RUN apt-get update && apt-get install -y wget gnupg ca-certificates python3 python3-pip

# ocr
RUN apt-get install -y tesseract-ocr

# chrome
RUN wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_126.0.6478.182-1_amd64.deb \
    && apt install /tmp/chrome.deb -y \
    && rm /tmp/chrome.deb

WORKDIR /app

COPY . .
RUN pip install -r requirements.txt

ENTRYPOINT ["python3", "-u", "/app/src/run.py"]
