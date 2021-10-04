import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { zipcodeDetailList, functionpermission,ColumnChangeBO } from './zip-code.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class zipcodeService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getZipcodeList( paramsData:URLSearchParams):Observable<zipcodeDetailList[]>
    {
        console.log("service working")

        let url = "api/ZipcodeDetail/GetZipcodeDetailList?";
        return  this.http.get<zipcodeDetailList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }

    saveupdate(saveList :zipcodeDetailList):Observable<number>
    {
        console.log("service working")
        let url = "api/ZipcodeDetail/SaveZipcodeDetail";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    deleteZipCode(id:number):Observable<any>
    {
      let url = "api/ZipcodeDetail/DeleteZipcodeDetail/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

 gettotalCount(paramsData:URLSearchParams):Observable<number>
 {
  console.log("service working")

  let url = "api/ZipcodeDetail/GetZipcodeDetailList_Count?";
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