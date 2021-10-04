import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { caseManagerList,  functionpermission, GetCaseListBo} from './case-manager.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../icd10/icd10.model';
//import { ColumnChangeBO } from '../list/list.model';


@Injectable()
export class casemanagerHTTPService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getCaseManagerList( paramsData:GetCaseListBo):Observable<caseManagerList[]>
    {
        console.log("service working")

        let url = "api/CaseManager/GetCaseManagerListFilter?";
        return  this.http.post<caseManagerList[]>(url,paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }

    saveupdate(saveList :caseManagerList):Observable<number>
    {
       //console.log("service working")
        let url = "api/CaseManager/SaveCaseManager";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    DeleteCaseManager(id:number):Observable<any>
    {
      let url = "api/CaseManager/DeleteCaseManager/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

 gettotalCount(paramsData:URLSearchParams):Observable<number>
 {
 //console.log("service working")

  let url = "api/CaseManager/GetCaseManagerList_Count?";
  return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
 }

 getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
 {
  let url="api/functionpermisssion/getfunctionpermission?";
  return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
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
 
}