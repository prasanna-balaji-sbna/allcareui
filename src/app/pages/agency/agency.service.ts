import { Injectable } from '@angular/core';
import { functionpermission, AgencyList, agencyStatusList, StatusList, CompanyList, StatusListCompany, ZipcodeDetail, GetAgencyBO ,GetCompanyBO, AgencyInfoBO, SaveReturnBO, CompanyReturnBO} from '../agency/agency.model';
import { ErrorService } from 'src/app/services/error.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ColumnChangeBO } from '../list/list.model';

@Injectable()
export class AgencyService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
 {
  let url="api/functionpermisssion/getfunctionpermission?";
  return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }

 getAgencyList( paramsData:GetAgencyBO):Observable<AgencyList[]>
 {
     console.log("service working")

     
    let url = "api/Agency/GetAgencyListFilterNew";
    return  this.http.post<AgencyList[]>(url,paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }
 getStatusForAgency( paramsData:URLSearchParams):Observable<agencyStatusList[]>
 {
     

     
     let url = "api/LOV/getLovDropDown?"
     return  this.http.get<agencyStatusList[]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }
 getStatus( paramsData:URLSearchParams):Observable<StatusList[]>
 {
     

     
     let url = "api/LOV/getLovDropDown?"
     return  this.http.get<StatusList[]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }


 getAgencyCount( paramsData:URLSearchParams):Observable<number>
 {
     
    let url = "api/Agency/GetAgencyListCount?"
     
     
     return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 saveupdate(saveList :AgencyList):Observable<SaveReturnBO>
 {
     
    let url = "api/Agency/SaveAgency";

      return  this.http.post<SaveReturnBO>(url ,saveList,{observe :'response'}).pipe(
      map(data => data.body ),
     catchError(this.errorService.handleError)
      )
 }

 getCompanyList( paramsData:GetCompanyBO):Observable<CompanyList[]>
 {
     console.log("service working")

     
     let url = "api/Company/GetCompanyListFilterNew"
     return  this.http.post<CompanyList[]>(url,paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 getStatusForCompany( paramsData:URLSearchParams):Observable<StatusListCompany[]>
 {
     
     let url = "api/LOV/getLovDropDown?"
     return  this.http.get<StatusListCompany[]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 
 getCompanyListCount( paramsData:URLSearchParams):Observable<number>
 {
    
     let url = "api/Company/GetCompanyListFilterCount?"
     return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 saveupdateCompany(saveList :CompanyList):Observable<CompanyReturnBO>
 {
     
    let url = "api/Company/SaveCompany";

      return  this.http.post<CompanyReturnBO>(url ,saveList,{observe :'response'}).pipe(
      map(data => data.body ),
     catchError(this.errorService.handleError)
      )
 }

 getZipcode( paramsData:URLSearchParams):Observable<ZipcodeDetail>
 {
    let url = "api/Client/getZipcode?"
     return  this.http.get<ZipcodeDetail>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }
//////////////////////////getOverAllAgencyDropdown///////////////////////////////////////////
 getOverAllAgency():Observable<AgencyList[]>
 {
    let url = "api/Agency/OverallAgency";
     return  this.http.get<AgencyList[]>(url,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 ////////////////////////////////////////getOverAllAgencyInfo///////////////////////////////////
 getOverAllAgencyInfo(paramsData:URLSearchParams):Observable<AgencyInfoBO>
 {
    let url = "api/Agency/OverallAgencyInfo";
     return  this.http.get<AgencyInfoBO>(url+paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }

 //////////////////////////////////////////////httpService saveServiceAndDCCodesAgency/////////////
 saveServiceAndDCCodesAgency(paramsData:URLSearchParams):Observable<void>
 {
    let url = "api/Agency/saveServiceAndDCCodes?";
     return  this.http.post<void>(url + paramsData, "",{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
   
     )
 }
  //////////////////////////////////////////////httpService saveServiceAndDCCodesAgency/////////////
  saveAgencySettingUser(paramsData:URLSearchParams):Observable<void>
  {
     let url ="api/AgencySetting/SaveAgencySettingOnAgencyCreation?";
      return  this.http.post<void>(url + paramsData, "",{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
    
      )
  }

  getsample( paramsData:URLSearchParams):Observable<any>
  {
      
 
      
      let url = "api/Client/getExpiredSAListDropdown?"
      return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
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