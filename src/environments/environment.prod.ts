export const environment = {
  production: true,
  // OLD
  // httpBaseUrl: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/api",
  // httpBase: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net",

  // api.homeaZZon.com
  // httpBaseUrl: "https://api.homeazzon.com/api",
  // httpBase: "https://api.homeazzon.com",

  // azure
  httpBaseUrl: 'https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/api',
  httpBase: 'https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/',
  redirectUrl: 'https://homeazzon.com/redirect',
  //azureB2CUrl: 'https://cognitivegenerationenterpr.b2clogin.com/cognitivegenerationenterpr.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn_Public_HomeaZZon&client_id=236c9456-da32-4c2c-81b4-842dfd0442f1&nonce=defaultNonce&scope=openid&response_type=id_token&prompt=login',
  azureB2CUrl: 'https://cognitivegenerationenterpr.b2clogin.com/cognitivegenerationenterpr.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn_Public_HomeaZZon&client_id=236c9456-da32-4c2c-81b4-842dfd0442f1&nonce=defaultNonce&redirect_uri=https%3A%2F%2FhomeaZZon%2Ecom%2Fredirect&scope=openid&response_type=id_token&prompt=login',

  //local
  //httpBase: "https://localhost:44354",
  //httpBaseUrl: "https://localhost:44354/api",
  azureInstrumentaionKey: 'dd255efa-1918-4580-b352-624da7efc886',

  firebaseConfig: {
    apiKey: 'AIzaSyCdVct1XEXNX3j1Kuc4h3i2javjFrKWnaY',
    authDomain: 'homeazzon.firebaseapp.com',
    databaseURL: 'https://homeazzon.firebaseio.com',
    projectId: 'homeazzon',
    storageBucket: 'homeazzon.appspot.com',
    messagingSenderId: '885892578415',
  },
};
