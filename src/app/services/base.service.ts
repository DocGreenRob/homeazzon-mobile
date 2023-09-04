import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class baseService {
  constructor(public http: HttpClient) {}

  private formatErrors(error: any) {
    console.log(JSON.stringify(error));
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.httpBaseUrl}${path}`, { params }).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${environment.httpBaseUrl}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
  }

  patch(path: string, body: Object = {}): Observable<any> {
    return this.http.patch(`${environment.httpBaseUrl}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${environment.httpBaseUrl}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(`${environment.httpBaseUrl}${path}`).pipe(catchError(this.formatErrors));
  }
}
