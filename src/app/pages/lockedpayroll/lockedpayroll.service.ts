import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { PayrollreturnBO, getPayrollListBO,updatePayDateBO } from './lockedpayroll.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../list/list.model';


@Injectable()
export class LPRHTTPService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getClientList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("service working")

        let url = "api/Client/GetClientListbyTd?";
        return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getEmployeeList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("service working")

        let url = "api/Client/GetEmpListbyId?";
        return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getStatusList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("service working")

        let url = "api/LOV/LovDropDownBatch?";
        return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    saveupdate(saveList: updatePayDateBO):Observable<any>
    {
        console.log("savelist",saveList);
        console.log("service working")
        let url = "api/Payroll/UpdatePaydate?";
         return  this.http.post<any>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    Lock(id:number):Observable<any>
    {
      let url = "api/Payroll/LockPayroll?PayrollId="+id;
      return  this.http.post<any>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }
    
    Unlock(id:number):Observable<any>
    {
      let url = "api/Payroll/UnLockPayroll?PayrollId="+id;
      return  this.http.post<any>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

//  gettotalCount(paramsData:URLSearchParams):Observable<number>
//  {
//   console.log("service working")

//   let url = "api/CaseManager/GetCaseManagerList_Count?";
//   return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
//   map(data => data.body ),
//   catchError(this.errorService.handleError)
//   )
//  }

//  getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
//  {
//   let url="api/functionpermisssion/getfunctionpermission?";
//   return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
//     map(data => data.body ),
//     catchError(this.errorService.handleError)
//     )
//  }
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