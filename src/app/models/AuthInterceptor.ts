import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDependencyTelemetry } from '@microsoft/applicationinsights-web';
import { tap, catchError } from 'rxjs/operators';
import { BasePage } from '../pages/base/base.page';
import { IAuthTokenDto } from './dto/interfaces/IAuthTokenDto';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor extends BasePage implements HttpInterceptor {

	constructor() {
		super(null, null, null, null, null, null, null, null, null);
	}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		// Get the auth token from the service.
		let authToken: IAuthTokenDto = JSON.parse(localStorage.getItem('AuthToken'));
		let authReq = req;

		if (authToken != undefined && authToken != null) {

			if (req.url.toLowerCase().indexOf('/token') === -1) {
				// Clone the request and replace the original headers with
				// cloned headers, updated with the authorization.
				authReq = req.clone({
					headers: new HttpHeaders({
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authToken.Access_token}`,
						'Name': this.IdToken.name != null ? this.IdToken.name : "",
						'Email': this.IdToken.email,
						'Provider': this.IdToken.sub != null ? this.IdToken.sub : "google.com"
					})
				});
			}
		}

		//alert(`authReq ${JSON.stringify(authReq)}`);
		//alert(`authReq.headers.Name ${JSON.stringify(authReq.headers.get('Name'))}`);
		//alert(`authReq.headers.Authorization ${JSON.stringify(authReq.headers.get('Authorization'))}`);

		// send cloned request with header to the next handler.
		//return next.handle(authReq);
		return next.handle(authReq)
			.pipe(
				tap(event => {

					if (event instanceof HttpResponse) {

						let dependency: IDependencyTelemetry = {
							name: req.method,
							id: req.url,
							responseCode: event.status,
							data: req.body,
							success: true,
							correlationContext: event.body
						};

						this.AppInsights.trackDependencyData(dependency);

						const pageName: string = req.url.split('api/')[1];
						this.AppInsights.trackPageView({ name: pageName, uri: req.url });
					}

				},
					catchError(
						(error: HttpErrorResponse): Observable<any> => {
							let dependency: IDependencyTelemetry = {
								name: req.method,
								id: req.urlWithParams,
								responseCode: error.status,
								data: req.body,
								success: false,
								correlationContext: error.message
							};

							this.AppInsights.trackDependencyData(dependency);
							this.AppInsights.trackException(dependency);
							return throwError(error);
						})));

	}

}