import os
import time
from pathlib import Path
from loguru import logger
from dawn import DawnSession


DAWN_VERSION = "v1.0.7"
DAWN_USERNAME = os.environ["DAWN_USERNAME"]
DAWN_PASSWORD = os.environ["DAWN_PASSWORD"]
DAWN_PROXY = os.environ.get("DAWN_PROXY")

BACKGROUND_JS = """
var config = {
    mode: "fixed_servers",
    rules: {
        singleProxy: {
            scheme: "http",
            host: "%s",
            port: %d
        },
        bypassList: ["localhost"]
    }
};

chrome.proxy.settings.set({value: config, scope: "regular"}, function() {});

function callbackFn(details) {
    return {
        authCredentials: {
            username: "%s",
            password: "%s"
        }
    };
}

chrome.webRequest.onAuthRequired.addListener(
    callbackFn,
    { urls: ["<all_urls>"] },
    ['blocking']
);
"""

if __name__ == "__main__":
    current_path = Path(__file__).resolve().parent
    dawn_path = os.path.join(current_path / f"../extensions/dawn-{DAWN_VERSION}")
    extensions = [dawn_path]
    if DAWN_PROXY is not None:
        proxy_path = os.path.join(current_path, "../extensions/proxy")
        with open(f"{proxy_path}/background.js", "w") as f:
            proxy = DAWN_PROXY.split(":")
            proxy[1] = int(proxy[1])
            f.write(BACKGROUND_JS % tuple(proxy))
            extensions.append(proxy_path)

    os.makedirs("./sc", exist_ok=True)
    try:
        driver = DawnSession(
            headless=True,
            username=DAWN_USERNAME,
            password=DAWN_PASSWORD,
            version_main=126,
            extension=extensions,
        )
        driver.run()
    except Exception as e:
        logger.error(f"Exception raised, saving screenshot: {str(e)}")
        driver.save_screenshot(os.path.join("./sc", str(int(time.time())) + ".png"))
        raise e
