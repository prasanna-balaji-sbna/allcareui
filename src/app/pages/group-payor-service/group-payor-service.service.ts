import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { GroupPayorServiceTableBO, GetGroupPayorServiceBO,ColumnChangeBO} from './group-payor-service.model';


@Injectable()
export class GroupPayorService{
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getGroupPayorServiceList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("group payor service working")

        let url = "api/GroupPayorServiceTable/GetGroupPayorServiceTableList?";
        return  this.http.get(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
      
        )
    }
    getPayorTotalItem(paramsData:URLSearchParams):Observable<GroupPayorServiceTableBO[]>
    {

        let url = "api/GroupPayorServiceTable/getPayorTotalItem?";
        return  this.http.get<GroupPayorServiceTableBO[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
      
        )
    }
//     getPayorTotalItemFilter(paramsdata:GetGroupPayorServiceBO):Observable<GroupPayorServiceTableBO[]>
//     {
//         console.log("service working")

//         let url = "api/GroupPayorServiceTable/getPayorTotalItemFilter?";
//     return  this.http.post<GroupPayorServiceTableBO[]>(url,paramsdata,{observe :'response'}).pipe(
//     map(data => data.body),
//     catchError(this.errorService.handleError)
//     )
// }
    getGroup( paramsData:URLSearchParams):Observable<any> {
   
        let url = "api/LOV/getLovDropDownByCode?";
        return  this.http.get(url + paramsData,{observe :'response'}).pipe(
            map(data => data.body ),
            
            catchError(this.errorService.handleError)
          
            )
    }
  //   getGroup():Observable<any> {
   
  //     return  this.http.get("api/LOV/getLovDropDownByCode?").pipe(catchError(this.errorService.handleError))
  // }
    getAllpayer(paramsData:URLSearchParams):Observable<any> 
    {
      console.log(paramsData);

      let url="api/GroupPayor/CommonGetGPList?";
      return  this.http.get(url + paramsData,{observe :'response'}).pipe(
        
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
      
        )
        
    }
    getProviderDropDown(paramsData:URLSearchParams):Observable<any> {
   
        let url = "api/LOV/getLovDropDownByCode?";
        return  this.http.get(url + paramsData,{observe :'response'}).pipe(
            map(data => data.body ),
            
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
 getpayer(groupId)
  {
    let url="api/GroupPayor/getpayerId?";
    return  this.http.get(url + groupId,{observe :'response'}).pipe(
        map(data => 
          {
            data.body
          }
           ),
        
        catchError(this.errorService.handleError)
    )
  }
 
getgroupPayorTotal(paramsData:URLSearchParams):Observable<GroupPayorServiceTableBO[]> 
{
 
  let url="api/GroupPayorServiceTable/GetGroupPayorServiceTotal?";
  return  this.http.get<GroupPayorServiceTableBO[]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    
    catchError(this.errorService.handleError)
)
}
saveupdate(data :GroupPayorServiceTableBO):Observable<number>
{
    console.log("service working",data)
    let url = "api/GroupPayorServiceTable/SaveGroupPayorServiceTable";
     return  this.http.post<number>(url ,data,{observe :'response'}).pipe(
     map(data => data.body ),
    catchError(this.errorService.handleError)
     )
}
deleteGrpService(paramsData:URLSearchParams):Observable<any> 
{
  let url = "api/GroupPayorServiceTable/DeleteGroupPayorServiceTable?";
  return  this.http.delete<number>(url+paramsData,{observe :'response'}).pipe(
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
