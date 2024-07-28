import { EsmLoginPageElement, EsmPlusLoginTabIndex, EsmPlusPageURL } from '@domain';
import axios from 'axios';
import puppeteer, { Browser, Page } from 'puppeteer';

import { EsmPlusLoginFailedError } from './esm-plus-errors';
import { EsmPlusTimer } from './esm-plus-timer';

export class EsmPlusLoginPage {
  private browser: Browser;
  private page: Page;

  async create(visible: boolean) {
    this.browser = await puppeteer.launch({
      headless: !visible,
      extraPrefsFirefox: {
        'download.default_directory': './downloads',
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'safebrowsing.enabled': true,
      },
    });

    this.page = (await this.browser.pages()).pop() ?? (await this.browser.newPage());

    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.goto(EsmPlusPageURL.Login);
  }

  async clickTab(tabIndex: EsmPlusLoginTabIndex) {
    const tabs = await this.page.waitForSelector(EsmLoginPageElement.TabClassName, { timeout: 10000 });
    const tabButtons = await tabs.$$('button');
    const tabButton = tabButtons.at(tabIndex);
    await tabButton.click();
  }

  async inputAccount(account: string) {
    const input = await this.page.waitForSelector(EsmLoginPageElement.InputAccountID, { timeout: 10000 });
    await input.type(account);
  }

  async inputPassword(password: string) {
    const input = await this.page.waitForSelector(EsmLoginPageElement.InputPasswordID, { timeout: 10000 });
    await input.type(password);
  }

  async submitForm() {
    const form = await this.page.waitForSelector(EsmLoginPageElement.FormClassName, { timeout: 10000 });
    const formButton = await form.$('button');
    await formButton.click();
  }

  async waitFor(seconds: number) {
    while (true) {
      if (this.page.url().includes('/login') === false) {
        break;
      }

      const errorLabel = await this.page.$(EsmLoginPageElement.ErrorLabelClassName);
      const errorContent = await errorLabel.getProperty('textContent');
      const errorMessage = await errorContent.jsonValue();

      if (errorMessage) {
        throw new EsmPlusLoginFailedError(errorMessage);
      }

      if ((await EsmPlusTimer(seconds)) < 0) {
        throw new EsmPlusLoginFailedError('exceed 10 seconds.');
      }
    }
  }

  async getCookies() {
    const cookies = await this.page.cookies();
    const cookiesMap = cookies.map((cookie) => [cookie.name, cookie.value].join('='));

    return cookiesMap.join('; ');
  }

  async createRequest(cookies: string) {
    return axios.create({ headers: { Cookie: cookies } });
  }

  async close() {
    for (const page of await this.browser.pages()) {
      await page.close();
    }

    await this.browser.close();
  }
}
