import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { careCordinatorList, functionpermission, GetCareListBo } from './care-coordinator.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../list/list.model';


@Injectable()
export class carecordinatorService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getCareCordinatorList( paramsData:GetCareListBo):Observable<careCordinatorList[]>
    {
       //console.log("service working")

        let url = "api/CareCoordinator/GetCareCoordinatorListFilter?";
        return  this.http.post<careCordinatorList[]>(url,paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }

    saveupdate(saveList :careCordinatorList):Observable<number>
    {
       //console.log("service working")
        let url = "api/CareCoordinator/SaveCareCoordinator";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    deleteCareCoordinator(id:number):Observable<any>
    {
      let url = "api/CareCoordinator/DeleteCareCoordinator/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

 gettotalCount(paramsData:URLSearchParams):Observable<number>
 {
 //console.log("service working")

  let url = "api/CareCoordinator/GetCarcoordinator_Count?";
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
////////===========================Column change func==================///
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