import time
import pathlib
from faker import Faker
from loguru import logger

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from undetected_chromedriver import Chrome, ChromeOptions
from selenium.webdriver.support import expected_conditions as EC


class ChromeSession(Chrome):
    def __init__(self, headless=False, extension=[], *args, **kwargs):
        self.options = ChromeOptions()
        if headless:
            self.options.add_argument("--headless")
        self.options.add_argument(f"--user-agent={Faker().chrome()}")
        self._set_extension(extension=extension)
        self.options.add_argument("--disable-dev-shm-usage")

        super().__init__(options=self.options, *args, **kwargs)

    def try_close(self):
        try:
            self.close()
            logger.success("Closed successfully")
        except Exception as e:
            logger.error(f"Failed to close: {str(e)}")

    def _set_extension(self, extension):
        if isinstance(extension, str):
            extension = [extension]

        if len(extension) > 0:
            extensions = [str(pathlib.Path(e).absolute()) for e in extension]
            extensions = ",".join(extensions)
            self.options.add_argument(f"--load-extension={extensions}")

            prefs = {
                "extensions.ui.developer_mode": True,
            }
            self.options.add_experimental_option("prefs", prefs)

    def xpath_wait_clickable(self, xpath, wait=10):
        for i in range(0, wait):
            logger.debug(f"wait {i + 1}/{wait}: xpath:{xpath}")
            try:
                element = WebDriverWait(self, 1).until(
                    EC.element_to_be_clickable((By.XPATH, xpath))
                )
                return element
            except:
                pass

        raise Exception("Failed to find xpath")

    def xpath_wait_located(self, xpath, wait=10):
        for i in range(0, wait):
            logger.debug(f"wait {i + 1}/{wait}: xpath:{xpath}")
            try:
                element = WebDriverWait(self, 1).until(
                    EC.presence_of_all_elements_located((By.XPATH, xpath))
                )
                if len(element) == 1:
                    element = element[0]
                return element
            except:
                pass

        raise Exception("Failed to find xpath")

    def wait_url_keyword(self, keyword=None, wait=10):
        for i in range(0, wait):
            logger.debug(f"wait {i + 1}/{wait}: waiting for {keyword} in url")
            logger.debug(f"{self.current_url=}")
            if keyword in self.current_url:
                return True
            time.sleep(1)

        raise Exception(f"{keyword=} not found")

    def current_ip(self):
        script = """
        const response = await fetch(
            "https://ipinfo.io/json",
            {
                "method": "GET",
            },
        )
        return await response.json()
        """

        ip_info = self.execute_script(script)
        return ip_info["ip"]
