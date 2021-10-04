import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ICD10List, GetICD10BO, WhereCondition,ColumnChangeBO } from './icd10.model';
import { ErrorService } from '../../error.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map,  retry } from 'rxjs/operators';
import { functionpermission } from '../icd10/icd10.model';
@Injectable({
  providedIn: 'root'
})
export class ICD10Service {
  ListSendBO:GetICD10BO = new GetICD10BO();
  conditionlist:WhereCondition[]=[];
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    })
  };
  constructor(private http: HttpClient,public errorService: ErrorService) { }

  public sendGetRequest(){
    return this.http.get<ICD10List[]>('api/ICD10/GetICD10List').pipe(catchError(this.errorService.handleError));
  }
  // getIcdList( paramsData:URLSearchParams):Observable<any>  {
  //     console.log("service working")

  //     let url = "api/Client/commonICDList?";
  //     return  this.http.get(url + paramsData,{observe :'response'}).pipe(
  //     map(data => data.body ),
     
  //     catchError(this.errorService.handleError)
    
  //     )
  // }
  saveupdate(saveList :ICD10List):Observable<number>
  {
      console.log("save working",saveList)
      let url = "api/ICD10/SaveICD10";
       return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
       map(data => data.body ),
      catchError(this.errorService.handleError)
       )
  }
  deleteIcd10(id:number):Observable<any>
  {
    console.log(id);
    
    let url = "api/ICD10/DeleteICD10?"+id;
    return  this.http.delete<number>(url,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
//   getIcdList( paramsData:URLSearchParams):Observable<any> 
//   {
//     console.log("service working")

//     let url = "api/ICD10/GetICD10ListFilter?";
//     return  this.http.get<ICD10List[]>(url + paramsData,{observe :'response'}).pipe(
//     map(data => data.body ),
//     catchError(this.errorService.handleError)
  
//     )
// }
// getIcdList(paramsdata:GetListBO):Observable<ICD10List[]>
// {
//     console.log("service working")

//     let url = "api/ICD10/GetICD10ListFilter?";
// return  this.http.post<ICD10List[]>(url,paramsdata,{observe :'response'}).pipe(
// map(data => data.body),
// catchError(this.errorService.handleError)
// )
// }
gettotalCount(paramsdata:WhereCondition[]):Observable<number>
{
console.log("service working")

let url = "api/ICD10/GetICD10List_Count?";
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