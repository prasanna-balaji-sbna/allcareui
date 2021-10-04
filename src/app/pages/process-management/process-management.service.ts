import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { processListBo, LovBO, DropList, functionpermission } from './process-management.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../icd10/icd10.model';

@Injectable()
export class PMHttpService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }

    GetLOVList(params: URLSearchParams):Observable<LovBO[]>
    {
        console.log("service working")
        let url="api/Lov/getLovtype?";
        return  this.http.get<LovBO[]>(url+params,{observe :'response'}).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
        )
    }
    
    GetRole():Observable<DropList[]>
    {
        console.log("service working")
        let url="api/LoginRole/getRole";
        return  this.http.get<DropList[]>(url,{observe :'response'}).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
        )
    }
    
    GetUser(params: URLSearchParams):Observable<DropList[]>
    {
        console.log("service working")
        let url="api/User/GetUserDropDown?";
        return  this.http.get<DropList[]>(url+params,{observe :'response'}).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
        )
    }

    DeleteProcessdata(id:number):Observable<any>
    {
      let url = "api/ProcessManagement/DeleteCareCoordinator/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

    saveupdate(saveList :processListBo):Observable<number>
    {
        console.log("service working")
        let url = "api/ProcessManagement/SaveProcess";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    saveupdateLOV(saveList):Observable<number>
    {
        console.log("service working")
        let url = "api/LOV/SaveLov";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
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