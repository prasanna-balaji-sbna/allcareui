import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { filters, sortingObj, SaveTimeSheet, returnTimesheet,TimesheetreturnBO } from './timesheet.model';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO} from '../list/list.model';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private http: HttpClient, public errorService: ErrorService) { }
  /////////////////////////////////////////get Employee/////////////////////////////////////////////////////////////

  // getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
  //   let url = "api/Client/GetEmpListbyId?"
  //   return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
  //     map(data => data.body),
  //     catchError(this.errorService.handleError)
  //   )
  // }
  getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Employee/getPCAEmployee?"
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }


  /////////////////////////////////////////get Payor/////////////////////////////////////////////////////////////

  getPayor(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/GroupPayor/CommonGetGPList?"
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////////////////////get Client///////////////////////////////////////////////////////

  getClient(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetClientListbyTd?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  /////////////////////////////get time sheet Iteams////////////////////////////////////////////

  getTimesheetIteam(timesheet): Observable<TimesheetreturnBO> {
    let url = "api/Timesheet/FilterTimeSheetItem?";
    return this.http.post<TimesheetreturnBO>(url ,timesheet, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////get timesheet total///////////////////////////////////////////

  getTimesheetTotal(params: URLSearchParams): Observable<number> {
    let url = "api/Timesheet/FilterTimeSheet?";
    return this.http.get<number>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ///////////////////////////get eployee Delails////////////////////////////////////////

  getEmpumpi(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetEmplUIdInsprvdno?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
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

  //////////////////////////////get Authorization//////////////////////////////////////////////////////////////////////

  getAuthorization(params: URLSearchParams): Observable<any> {
    let url = "api/Timesheet/FilteracctoStartdate?";
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////////Check timesheets//////////////////////////////////////////////////////////////////////

  Checktimesheets(params: URLSearchParams): Observable<any> {
    let url = "api/timesheet/checktimesheet?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////////save Timesheet///////////////////////////////////////////////////////////////

  saveTimesheet(value: any): Observable<any> {
    let url = "api/Timesheet/SaveTimesheet"
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////update Client and Employee///////////////////////////////////////////////////////

  updateTimesheetdata(value: any): Observable<any> {
    let url = "api/Timesheet/edittimesheet"
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  /////////////////////////////// delete All timesheet////////////////////////////////////////////////////////

  deleteAllTimesheetdata(value: any) {
    let url = "api/Timesheet/deletetotalTimesheet"
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  /////////////////////////////// delete All timesheet////////////////////////////////////////////////////////

  deleteTimesheetdata(value: any) {
    let url="api/Timesheet/DeleteTimesheet";   
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ////////////////////////////////////edit Timesheet////////////////////////////////////////////////

  editTimesheetdata(value: any) {
    let url = "api/Timesheet/updateTimesheet"
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ///////////////////////////////////get Timesheet Upload////////////////////////////////////////////////

  gettimesheetUpload(params: URLSearchParams): Observable<any> {
    let url = "api/TimesheetUpload/getTimesheetUpload?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  ///////////////////////upload Timesheeet////////////////////////////////////////////////////////////
  uploadTimesheet(value:any): Observable<any> {
    var url = "api/TimesheetUpload/saveTimesheetUpload?serialnumber="+value.SequenceNumber;
    return this.http.post<any>(url , value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  getpermission(params: URLSearchParams): Observable<any> {
    let url = "api/functionpermisssion/getfunctionpermissionclient?";
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
   //////////////////////////////get Employee Status//////////////////////////////////////////////////////////////////////
   getEmployeeStatus(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
   {
 
     let url = "api/LOV/getLovDropDown?";
     return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
     )
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
//////////////////////////////get Authorization//////////////////////////////////////////////////////////////////////

getAuth(params: URLSearchParams): Observable<any> {
  let url = "api/Timesheet/GetAuth?";
  return this.http.get<any>(url + params, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}

}
