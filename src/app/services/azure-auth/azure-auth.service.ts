import { Injectable } from '@angular/core';
import {OAuth2AuthenticateOptions, OAuth2Client} from "@byteowls/capacitor-oauth2";
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class AzureAuthService {

  getAzureB2cOAuth2Options(): OAuth2AuthenticateOptions {
    return {
        appId: '236c9456-da32-4c2c-81b4-842dfd0442f1',
        authorizationBaseUrl: `https://cognitivegenerationenterpr.b2clogin.com/cognitivegenerationenterpr.onmicrosoft.com/B2C_1_SignUpSignIn_Public_HomeaZZon/oauth2/v2.0/authorize`,
        scope: "openid", // See Azure Portal -> API permission
        accessTokenEndpoint: ``,
        responseType: "id_token",
        pkceEnabled: true,
        logsEnabled: true,
        web: {
          redirectUrl: environment.redirectUrl
        },
        android: {
            redirectUrl: environment.redirectUrl // See Azure Portal -> Authentication -> Android Configuration "Redirect URI"
        },
        ios: {
            pkceEnabled: true, // workaround for bug #111
            redirectUrl: "msauth.com.homeazzon.homeazzon://redirect"
        }
    };
  }

  login() {
    return OAuth2Client.authenticate(this.getAzureB2cOAuth2Options());
  }
}
