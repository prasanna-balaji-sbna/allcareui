import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { ErrorService } from './error.service';
import { ZipcodeDetailBO } from './pages/client-parent/client-parent.model';
@Injectable() export class CommonHttpService{
    constructor(public http:HttpClient,public errorService:ErrorService,private handler: HttpBackend){}


     /////////////////////////////////get state /////////////////////////////////////////////////////////////////////////
 
     getJSON(): Observable<any> {
        let httpLocal = new HttpClient(this.handler);
        return httpLocal.get("./assets/states.json");
    }
     
       ////////////////////////////getPayorDropDown////////////////////
       getPayorDropDown(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>{
        let url = "api/GroupPayor/CommonGetGPList?";
        return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
       }

       ////////////////////////////////////////getcompany////////////////////////////////
       getCompany(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>{
        let url = "api/Company/CommonGetCompanyList?";
        return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
       }

       /////////////////////////////////getdclist///////////////////////////////////
       getDC(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>{
        let url = "api/Client/CommonGetDCList?";
        return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
       }

       /////////////////////////////////////getlovdropdown////////////////////////////
       getStatus( paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>{        
           let url = "api/LOV/getLovDropDown?"
           return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
           map(data => data.body ),
           catchError(this.errorService.handleError)         
           )
       }

       ////////////////////////////////////////getZipCodeDetails///////////////////////
       getZipCodeDetails( paramsData:URLSearchParams):Observable<ZipcodeDetailBO>{        
        let url = "api/Client/getZipcode?"
        return  this.http.get<ZipcodeDetailBO>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)         
        )
    }

    /////////////////////////////////////////getICD10////////////////////////////////////////
    getICD10():Observable<[{Key:number,Value:string}]>{        
        let url = "api/Client/commonICDList"
     
        return  this.http.get<[{Key:number,Value:string}]>(url,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)         
        )
    }

    ////////////////////////////////////////getStartofCareListdate/////////////////////////
    getStartofCareListdate(params):Observable<[{Key:number,Value:string}]>{        
        let url = "api/StartOfCare/GetStartOfCareDate?"
        return  this.http.get<[{Key:number,Value:string}]>(url+params,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)         
        )
    }

}
