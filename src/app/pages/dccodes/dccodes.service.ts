import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { DischargeCodeDetailBO, functionpermission, ColumnChangeBO } from './dccodes.model';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
export class dccodesService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    // GetDischargeCodeDetailList( paramsData:URLSearchParams):Observable<DischargeCodeDetailBO[]>
    // {
    //     console.log("service working")

    //     let url = "api/DischargeCodeDetail/GetDischargeCodeListFilter?";
    //     return  this.http.get<DischargeCodeDetailBO[]>(url + paramsData,{observe :'response'}).pipe(
    //     map(data => data.body ),
    //     catchError(this.errorService.handleError)

    //     )
    // }
//     GetDischargeCodeDetailList(paramsdata:GetDccBO):Observable<DischargeCodeDetailBO[]>
//     {
//         console.log("service working")

//         let url = "api/DischargeCodeDetail/GetDischargeCodeListFilter?";
//     return  this.http.post<DischargeCodeDetailBO[]>(url,paramsdata,{observe :'response'}).pipe(
//     map(data => data.body),
//     catchError(this.errorService.handleError)
//     )
// }

    getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
 {
  let url="api/functionpermisssion/getfunctionpermission?";
  return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }

 gettotalCount(paramsData:URLSearchParams):Observable<number>
 {
  //console.log("service working")

  let url = "api/DischargeCodeDetail/GetDischargeCodeList_Count?";
  return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
 }


 saveupdate(saveList :DischargeCodeDetailBO):Observable<number>
 {
     //console.log("service working")
     let url = "api/DischargeCodeDetail/SaveDischargeCodeDetail";
      return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
      map(data => data.body ),
     catchError(this.errorService.handleError)
      )
 }


 deleteDischarge(id:number):Observable<any>
    {
      let url = "api/DischargeCodeDetail/DeleteDischargeCodeDetail/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
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