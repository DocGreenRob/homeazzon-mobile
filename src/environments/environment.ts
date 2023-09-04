// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	// OLD 1
	//httpBaseUrl: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/api",
	//httpBase: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net",

	// OLD 2
	//httpBaseUrl: "https://mypaduat.azurewebsites.net/api",
	//httpBase: "https://mypaduat.azurewebsites.net",

	// api.homeaZZon.com
	// httpBaseUrl: "https://api.homeazzon.com/api",
	// httpBase: "https://api.homeazzon.com",

	// azure
	//httpBaseUrl: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/api",
	//httpBase: "https://homeazzon-webapi-dev-eastus2-001.azurewebsites.net/",

	// LOCAL - Docker
	//httpBaseUrl: "http://localhost:60662/api",
	//httpBase: "http://localhost:60662",

	// LOCAL - Kastrel
	httpBaseUrl: "https://localhost:5001/api",
	httpBase: "https://localhost:5001",

	azureInstrumentaionKey: "dd255efa-1918-4580-b352-624da7efc886",
	firebaseConfig: {
		apiKey: "AIzaSyCdVct1XEXNX3j1Kuc4h3i2javjFrKWnaY",
		authDomain: "homeazzon.firebaseapp.com",
		databaseURL: "https://homeazzon.firebaseio.com",
		projectId: "homeazzon",
		storageBucket: "homeazzon.appspot.com",
		messagingSenderId: "885892578415"
	}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
