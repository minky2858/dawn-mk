import time
from loguru import logger
from chrome import ChromeSession
from utils import solve_equation
from tenacity import retry, stop_after_attempt, wait_fixed


EXTENSION_ID = "fpdkjdnhkakefebpekbdhillbhonfjjp"
SIGNUP_URL = f"chrome-extension://{EXTENSION_ID}/signup.html"
SIGNIN_URL = f"chrome-extension://{EXTENSION_ID}/signin.html"
ONBOARDING_URL = f"chrome-extension://{EXTENSION_ID}/onboarding.html"
DASHBOARD_URL = f"chrome-extension://{EXTENSION_ID}/dashboard.html"


class DawnSession(ChromeSession):
    connect_err_cnt = None
    points_stale_cnt = None
    last_earning = None

    def __init__(
        self, username, password, headless=False, extension=[], *args, **kwargs
    ):
        super().__init__(headless=headless, extension=extension, *args, **kwargs)
        self.username = username
        self.password = password

        self.get("http://ipinfo.io/json")
        ip = self.current_ip()
        logger.info(f"Current IP: {ip}")

    @retry(stop=stop_after_attempt(5), wait=wait_fixed(5))
    def login(self):
        logger.debug("Going to signin page")
        self.get(SIGNIN_URL)

        logger.debug(f"Entering email/username: {self.username}")
        email_input = self.xpath_wait_clickable("//input[@id='email']")
        email_input.clear()
        email_input.send_keys(self.username)

        logger.debug(f"Entering password: {self.password}")
        password_input = self.xpath_wait_clickable("//input[@id='password']")
        password_input.clear()
        password_input.send_keys(self.password)

        logger.debug(f"Extracting puzzle image")
        eqn_img = self.xpath_wait_clickable("//img[@id='puzzleImage']")
        image_string = eqn_img.get_attribute("src")
        logger.debug(f"Got puzzle as {image_string}, start to solve...")
        solution = solve_equation(image_string=image_string)

        logger.debug(f"Entering puzzle solution: {solution}")
        puzzle_input = self.xpath_wait_clickable("//input[@id='puzzelAns']")
        puzzle_input.clear()
        puzzle_input.send_keys(solution)

        logger.debug(f"Logginging")
        login_btn = self.xpath_wait_clickable("//button[@class='loginBtn']")
        login_btn.click()

        logger.debug("Checking login status")
        _ = self.wait_url_keyword("dashboard")

        logger.success("Login successful")

    @retry(stop=stop_after_attempt(5), wait=wait_fixed(5))
    def report(self):
        logger.debug("Fetching connection_status")
        connection_status = self.xpath_wait_located("//span[@id='isnetworkconnected']")
        connection_status = connection_status.text

        logger.debug("Fetching connection_quality")
        connection_quality = self.xpath_wait_located("//span[@id='netwokquality_']")
        connection_quality = connection_quality.text + "%"

        logger.debug("Fetching total_earnings")
        total_earnings = self.xpath_wait_located("//h5[@id='dawnbalance']")
        total_earnings = total_earnings.text

        logger.debug("Fetching last_updated")
        last_updated = self.xpath_wait_located("//span[@id='lastupdatedatetime']")
        last_updated = last_updated.text

        logger.info(
            f"\n{connection_status=}\n{connection_quality=}\n{total_earnings=}\n{last_updated=}"
        )

        if connection_status.lower() != "connected":
            logger.warning(f"{connection_status=}, record")
            self.connect_err_cnt += 1
        else:
            self.connect_err_cnt = 0

        if self.last_earning is not None and self.last_earning == total_earnings:
            logger.warning(f"{self.last_earning=} and {total_earnings=}, record")
            self.points_stale_cnt += 1
        else:
            self.points_stale_cnt = 0

    def run(self):
        self.login()
        while True:
            self.report()
            if self.connect_err_cnt >= 5 or self.points_stale_cnt >= 5:
                raise Exception(f"{self.points_stale_cnt=} f{self.connect_err_cnt=}")
            logger.info(f"{self.points_stale_cnt=} {self.connect_err_cnt=}")
            time.sleep(120)
