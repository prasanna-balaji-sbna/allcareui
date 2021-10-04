import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { SettingList, LovBO, overallSideMenuItemBO, functionpermission } from './agency-settings.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class AgencySettingService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }

    getSettiings( paramsData:URLSearchParams):Observable<SettingList>
    {
       // console.log("service working")

        let url = "api/AgencySetting/GetAgencySetting?";
        return  this.http.get<SettingList>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    getSideMenuBasedRole( paramsData:URLSearchParams):Observable<overallSideMenuItemBO[]>
    {
       // console.log("service working")

        let url = "api/SideMenuItems/getSideMenuBasedRole?";
        return  this.http.get<overallSideMenuItemBO[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    getLov( paramsData:URLSearchParams):Observable<LovBO[]>
    {
      //  console.log("service working")

        let url = "api/LOV/getLovByCode?";
        return  this.http.get<LovBO[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }

    saveupdate(saveList :SettingList):Observable<number>
    {
     //   console.log("service working")
        let url = "api/AgencySetting/SaveAgencySetting";
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
}