from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

URL = 'http://www.google.com'
TMP_IMG = 'screenshot.png'

s=Service('./chromedriver105')
chrome_options = Options()
chrome_options.add_argument("--headless")
browser = webdriver.Chrome(service=s, options=chrome_options)

browser.get(URL)

# Take screenshot
screenshot = browser.save_screenshot(TMP_IMG)
print(screenshot)

# Get current time truncate to minute
import datetime
now = datetime.datetime.now()
now = now.replace(second=0, microsecond=0)
print(now)

# Load screenshot
from PIL import Image
im = Image.open(TMP_IMG)

# Make hash of screenshot image + URL + time
import hashlib
hash = hashlib.sha256()
hash.update(im.tobytes())
hash.update(browser.current_url.encode('utf-8'))
hash.update(now.isoformat().encode('utf-8'))
print(hash)
hash = hash.hexdigest()
print(hash)

browser.quit()
