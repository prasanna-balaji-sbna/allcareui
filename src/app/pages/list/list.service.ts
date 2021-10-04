import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Listlst, functionpermission,GetListBO, WhereCondition, ColumnChangeBO } from './list.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, Sorts, DataResult } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { AnyAaaaRecord } from 'dns';
@Injectable()

export class ListPageHTTPService{
    ListSendBO:GetListBO = new GetListBO();
    conditionlist:WhereCondition[]=[];
    constructor(private http: HttpClient,public errorService: ErrorService,public global:GlobalComponent) {
       
     }
    
    

    saveupdate(saveList :Listlst):Observable<number>
    {
        console.log("service working")
        let url = "api/List/SaveList";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    DeleteList(id:number):Observable<any>
    {
      let url = "api/List/DeleteList/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

    gettotalCount(paramsdata:WhereCondition[]):Observable<number>
    {
    console.log("service working")

    let url = "api/List/GetList_Count?";
    return  this.http.post<number>(url,paramsdata,{observe :'response'}).pipe(
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