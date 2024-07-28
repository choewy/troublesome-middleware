import { CredentialsDTO, ThirdPartyServiceImpl } from '@common';
import { AppConfigService } from '@core';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';

import { EsmPlusLoginPage } from './implements';

@Injectable()
export class EsmPlusService implements ThirdPartyServiceImpl {
  constructor(private readonly appConfigService: AppConfigService) {}

  async collectOrders(credentials: CredentialsDTO) {
    const request = await this.login(credentials);

    console.log(request);

    return null;
  }

  async transferInvoices<T = any>(credentials: CredentialsDTO): Promise<T> {
    const request = await this.login(credentials);

    console.log(request);

    return null;
  }

  async login(credentials: CredentialsDTO): Promise<AxiosInstance | null> {
    const loginPage = new EsmPlusLoginPage();

    try {
      await loginPage.create(this.appConfigService.isLocal);
      await loginPage.clickTab(credentials.type);
      await loginPage.inputAccount(credentials.account);
      await loginPage.inputPassword(credentials.password);
      await loginPage.submitForm();
      await loginPage.waitFor(10);

      const cookies = await loginPage.getCookies();
      const request = await loginPage.createRequest(cookies);

      return request;
    } catch (e) {
      Logger.error({
        context: EsmPlusService.name,
        error: {
          name: e?.name,
          message: e?.message,
          stack: e?.stack,
        },
      });

      return null;
    } finally {
      await loginPage.close();
    }
  }
}
