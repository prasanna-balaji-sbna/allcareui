import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
// import { map } from 'rxjs-compat/operator/map';
import { catchError, map} from 'rxjs/operators';
import { sortingObj, TimeSheetVerificationList,LineItemDetail,LineItem } from '../timesheetverification/timesheetverification.model';
import { ColumnChangeBO } from '../list/list.model';


@Injectable()
export class TimesheetverificationService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    
 gettimesheetList( paramsData:URLSearchParams):Observable<TimeSheetVerificationList[]>
 {
     console.log("service working")

     
     let url = "api/TimeSheetVerfication/GetTimeSheetVerfication?";
     return  this.http.get<TimeSheetVerificationList[]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }
//////////////////////////update Service and servicedate//////////////////////////////////////////////////////

updateTimesheetdata(value: any): Observable<any> {
  let url = "api/Timesheet/updateTimesheetService"
  return this.http.post<any>(url, value, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}

 Selectbill(saveList: TimeSheetVerificationList[]): Observable<number> {
console.log(saveList,"SaveList=======");


    let url = "api/BillingClaim/SaveBillingClaim";

    console.log(saveList,"SaveList=======");
    return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
    )
}



UpdateTimesheetErr(saveList: any): Observable<number> {
    console.log(saveList,"SaveList=======");
    
    
        let url = "api/TimeSheetVerfication/GetTimeSheetVerficationFilterErrUpdate";
    
        console.log(saveList,"SaveList=======");
        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
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

  getLOV(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/LOV/getLovDropDown?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  getLOVCode(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/LOV/getLovDropDownByCode?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  getService(paramsData:URLSearchParams):Observable<any> 
  {
    let url="api/MasterService/getCommonServicedropdown?";
    return  this.http.get(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
    )
    }

    ////////////////////////////getPayorDropDown////////////////////
    getPayorDropDown(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
        let url = "api/GroupPayor/CommonGetGPList?";
        return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
        )
      }
      getAgencySetting(paramsData: URLSearchParams): Observable<any> {
        let url = "api/AgencySetting/GetAgencySetting?";
        return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
        )
      }
       ////////////////////////////getPayorDropDown////////////////////
       getpayer(paramsData: URLSearchParams): Observable<any> {
        let url="api/GroupPayor/getpayerId?";
        return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
        )
      }
    

      getauth(paramsData: URLSearchParams): Observable<any> {
        let url = "api/ClientAuthorization/Getauth?";
        return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
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
  
}