import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ClientAidReportBO } from './aid-report-modal';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../list/list.model';
@Injectable({
  providedIn: 'root'
})
export class AidReportService {

  constructor(private http: HttpClient,public errorService: ErrorService) { }
  //============================get Status==========================================================//
  getstutus(param:URLSearchParams):Observable<[{label:string,value:string}]>
  {
    let url="api/LOV/getLovType?"
  return  this.http.get<[{label:string,value:string}]>(url+param,{observe:'response'}).pipe(map(
      data=>data.body
    ),catchError(this.errorService.handleError))
  }

  //============================get Client========================================================//
  getclient(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetClientListDropdown?";
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get submissionType========================================================//
   getsubmissionType(params: URLSearchParams): Observable<any> {
    let url="api/LOV/getLovType?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
  //============================get checklist========================================================//
  getcheckListdata(params: URLSearchParams): Observable<any> {
    let url="api/LOV/getLovType?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get service========================================================//
  getserviceListdata(params: URLSearchParams): Observable<any> {
    let url="api/MasterServiceActivity/getServiceData?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get service Activity========================================================//
  getActivityList(params: URLSearchParams): Observable<any> {
    let url="api/MasterServiceActivity/getActivitiesList_new?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get Responsiple party Name========================================================//
  getRPlst(params: URLSearchParams): Observable<any> {
    let url="api/Contact/GetContactList?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get Employee========================================================//
  getEmp(params: URLSearchParams): Observable<any> {
    let url="api/Employee/GetEmployeeDropdown?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================save Report========================================================//
  savereport(list): Observable<any> {
    let url ="api/ClientAidReport/SaveProcess"
    return this.http.post<any>(url , list, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   //============================get Aid Report========================================================//
  getAidReportById(params: URLSearchParams): Observable<any> {
    let url="api/ClientAidReport/getClientAidById?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }

  
  getcolumwidth():Observable<any>
  {
  console.log("service working")

  let url = "api/ColumnChange/getwidth?";
  return  this.http.get<any>(url,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
  }
  savecolumwidth(list:ColumnChangeBO):Observable<any>
  {
  console.log("service working")

  let url = "api/ColumnChange/Savewidth?";
  return  this.http.post<number>(url,list,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
  }
}
