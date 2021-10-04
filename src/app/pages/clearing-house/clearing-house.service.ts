import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ClearingHouseList, functionpermission, GroupPayorList, DropList, ClearingHousePayorMapping, GetCHListBo, ColumnChangeBO } from './clearing-house.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class ClearingHouseHTTPService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    ClearingHouseList( paramsData:GetCHListBo):Observable<ClearingHouseList[]>
    {
       //console.log("service working")

        let url = "api/ClearingHouse/GetClearingHouseList?";
        return  this.http.post<ClearingHouseList[]>(url,paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    GetGroupPayorList( paramsData:URLSearchParams):Observable<GroupPayorList[]>
    {
       //console.log("service working")

        let url = "api/GroupPayor/GetGroupPayorList?";
        return  this.http.get<GroupPayorList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    getFormat_type( paramsData:URLSearchParams):Observable<DropList[]>
    {
       //console.log("service working")

        let url = "api/LOV/getLovDropDown?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getSenderIdQualifier( paramsData:URLSearchParams):Observable<DropList[]>
    {
       //console.log("service working")

        let url = "api/LOV/LovDropDownQualifier?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getReceiver_id_qualifier( paramsData:URLSearchParams):Observable<DropList[]>
    {
       //console.log("service working")

        let url = "api/LOV/LovDropDownQualifier?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    getClearingHouseDropdown( paramsData:URLSearchParams):Observable<DropList[]>
    {
       //console.log("service working")

        let url = "api/ClearingHouse/GetClearingHouseListDropDown_formatType?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getClearingHouseDropdown_receiverId( paramsData:URLSearchParams):Observable<DropList[]>
    {
       //console.log("service working")

        let url = "api/ClearingHouse/GetClearingHouseListDropDown_receiverId?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getClearingHousePayorMapping( paramsData:URLSearchParams):Observable<ClearingHousePayorMapping[]>
    {
       //console.log("service working")

        let url = "api/ClearingHousePayorMapping/GetClearingHousePayorMappingList_withId?";
        return  this.http.get<ClearingHousePayorMapping[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    saveupdate(saveList :ClearingHouseList):Observable<number>
    {
       //console.log("service working")
        let url = "api/ClearingHouse/SaveClearingHouse";
        return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    deleteClearingHousePayorMapping(id:number):Observable<any>
    {
     //console.log("Service Workiong");
     //console.log("Delete Id in service==",id);
      let url = "api/ClearingHousePayorMapping/DeleteClearingHousePayorMapping/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

    gettotalCount(paramsData:URLSearchParams):Observable<number>
    {
   //console.log("service working")

    let url = "api/ClearingHouse/GetClearingHouseList_Count?";
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