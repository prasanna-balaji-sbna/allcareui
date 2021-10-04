import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ServiceList,DropList, functionpermission,GetMSListBo, ActivityList,ColumnChangeBO } from './manage.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class ManageHttpService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getServiceList( paramsData:GetMSListBo):Observable<ServiceList[]>
    {
        console.log("service working")
        let url = "api/MasterService/GetMasterServiceListFilter?";
        return  this.http.post<ServiceList[]>(url,paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    getServiceStatusList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("service working")
        let url = "api/MasterServiceActivity/getServiceList_withOutIn_MasterServiceActivity?";
        return  this.http.get<any>(url+paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getActivityStatusList( paramsData:URLSearchParams):Observable<any>
    {
        console.log("service working")
        let url = "api/MasterServiceActivity/getServiceActivityList?";
        return  this.http.get<any>(url+paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    gettotalCount(paramsData:URLSearchParams):Observable<number>
    {
        console.log("service working")
        let url = "api/MasterService/GetMasterServiceList_Count?";
        return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    getStatusList( paramsData:URLSearchParams):Observable<DropList[]>
    {
        console.log("service working")
        let url = "api/LOV/getLovDropDown?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    saveupdateService(saveList :ServiceList):Observable<number>
    {
        console.log("service working")
        let url = "api/MasterService/SaveMasterService";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }
    
    saveupdateActivity(saveList :ActivityList):Observable<number>
    {
        console.log("service working")
        let url = "api/MasterActivity/SaveMasterActivity";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }
    
    saveupdateServiceActivity(saveList):Observable<any>
    {
        console.log("service working")
        let url = "api/MasterServiceActivity/updateServiceActivity";
         return  this.http.post<any>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    DeleteStatus(id:number):Observable<any>
    {
      let url = "api/MasterService/DeleteMasterService/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }
    
    DeleteActivity(id:number):Observable<any>
    {
      let url = "api/MasterActivity/DeleteMasterActivity/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
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