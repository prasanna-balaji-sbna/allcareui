import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class QPService {

  constructor(private http: HttpClient, public errorService: ErrorService) { }
  /////////////////////////////////////////get Employee/////////////////////////////////////////////////////////////

  getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Client/GetEmployeeDrop?"
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  /////////////////////////get service////////////////////////////////////////////////////////////////

  getservice(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Timesheet/GetServicedropdownByAgencyService?";
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  //////////////////////////////////////////get Client///////////////////////////////////////////////////////

  // getClient(params: URLSearchParams): Observable<any> {
  //   let url = "api/Client/GetClientListbyTd?"
  //   return this.http.get<any>(url + params, { observe: 'response' }).pipe(
  //     map(data => data.body),
  //     catchError(this.errorService.handleError)
  //   )
  // }
  getClient(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetClientListbyTd?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

}
