
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import {Employee,PayorRequiredID ,PayRollInformation,PayRateUnit,OnboardList,returnonboard,zip,getEmployee } from './emloyee.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../icd10/icd10.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient,public errorService: ErrorService) { }
//////////////////////////////////////////get Employee Total Count /////////////////////////////////////////////////
  getEmployeeTotal( paramsData:URLSearchParams):Observable<number>
  {
    let url = "api/Employee/Gettotal?";
    return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
//////////////////////////////////////get Employee Total Iteam//////////////////////////////////////////////////////////
getEmployeeTotaIteam(paramsData:URLSearchParams):Observable<Employee[]>
{
  let url = "api/Employee/Gettotalitem?";
  return  this.http.get<Employee[]>(url + paramsData,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
}
///////////////////////////get Employee data using Filter/////////////////////////////////////////////////////////////

getEmployeedata(postData:getEmployee):Observable<Employee[]>
{
  let url = "api/Employee/getEmployeeFilter";
  return  this.http.post<Employee[]>(url , postData,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
}
 //////////////////////////////get Employee Status//////////////////////////////////////////////////////////////////////
  getEmployeeStatus(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
  {

    let url = "api/LOV/getLovDropDown?";
    return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
  //////////////////////////////get diability List//////////////////////////////////////////////////////////////////////
  getdisabilitylist(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
  {

    let url = "api/LOV/getLovDropDown?";
    return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }

  //==============================get Service Dropdown==========================================//
getService(paramsData:URLSearchParams):Observable<any>
{
  // let url = "api/Employee/getServicedropdownForPayrates?";
  let url ="api/Timesheet/GetServicedropdownByAgencyService?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}

  //////////////////////////////get job list//////////////////////////////////////////////////////////////////////
  getjoblist(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
  {

    let url = "api/LOV/getLovDropDown?";
    return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }

   //////////////////////////////get race list//////////////////////////////////////////////////////////////////////
   getracelst(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
   {
 
     let url = "api/LOV/getLovDropDown?";
     return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
     )
   }
    //////////////////////////////get vetran Disability//////////////////////////////////////////////////////////////////////
    getvetran(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
    {
  
      let url = "api/LOV/getLovDropDown?";
      return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
      map(data => data.body ),
      catchError(this.errorService.handleError)
      )
    }

 ///////////////////////////////get Eployee Type///////////////////////////////////////////////////////////////////
 getEmployeeType(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
 {

   let url = "api/LOV/getLovDropDown?";
   return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
 }
 ///////////////////////////////get Maritial  Type///////////////////////////////////////////////////////////////////
 getMaritialStatus(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
 {

   let url = "api/LOV/getLovDropDown?";
   return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
 }
 ///////////////////////////////get Maritial  Type/////////////////////////////////////////////////////////////////
 getGender(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
 {

   let url = "api/LOV/getLovDropDown?";
   return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
 }
 ///////////////////////////////get Location///////////////////////////////////////////////////////////////////
 getLocationr(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
 {

   let url = "api/LOV/getLovDropDown?";
   return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
 }
  ///////////////////////////////get PayCheckTYpe//////////////////////////////////////////////////////////////
  getPayCheckType(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
  {
 
    let url = "api/LOV/getLovDropDown?";
    return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
 ////////////////////////////get payorrequiredId data/////////////////////////////////////////////////////////
 getPayorRequiredId(paramsData:URLSearchParams):Observable<PayorRequiredID[]>
 {
  let url = "api/PayorRequiredID/GetPayorRequiredIDList?"
  return  this.http.get<PayorRequiredID[]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }
 ///////////////get payroll Information//////////////////////////////////
 getpayrollInfrom(paramsData:URLSearchParams):Observable<PayRollInformation>
 {
  let url = "api/PayRollInformation/GetPayRollInformationList?"
  return  this.http.get<PayRollInformation>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }
 
  ///////////////get payroll Information//////////////////////////////////
 getpayrate(paramsData:URLSearchParams):Observable<PayRateUnit[]>
 {
  let url = "api/PayRateUnit/GetPayRateUnitList?"
  return  this.http.get<PayRateUnit[]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }
 //////////////////////get Onboard/////////////////////////////////////
 getOnBoard(paramsData:URLSearchParams):Observable<OnboardList[]>
 {
  let url = "api/OnboardList/GetOnboardListList?"
  return  this.http.get<OnboardList[]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }


  //////////////////////get Onboard/////////////////////////////////////
  getOIGAnalysis(paramsData:URLSearchParams):Observable<any>
  {
   let url = "api/Employee/GetOIGData?"
   return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
     )
  }
 /////////////////////////upload Onboard//////////////////////////////
 uploadOnboard(data):Observable<any>
 {
  

   let url='api/OnboardList/uploadonboard'
  return  this.http.post(url ,data,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }
 //////////////////////////////save payroll/////////////////////////////////////////////////////
 savePayroll(savepayroll:PayRollInformation):Observable<number>
 {
  let url = "api/PayRollInformation/SavePayRollInformation";
  return  this.http.post<number>(url , savepayroll,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
 }
 //////////////////////get zip////////////////////////////////////////////////////////////////
getZip(paramsData:URLSearchParams):Observable<zip>
{
  let url = "api/Client/getZipcode?";
  return  this.http.get<zip>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
////////////////save onboard//////////////////////////////////////////////////////////////////
saveOnBoard(saveonboard):Observable<number>
{
  let url = "api/OnboardList/SaveOnboardList";
  return this.http.post<number>(url , saveonboard,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
////////////////////////save Employee////////////////////////////////////////////////////////
saveEmployeedata(Employee):Observable<number>
{
  let url = "api/Employee/SaveEmployee";
  return this.http.post<any>(url , Employee,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//////////////////////////get Payor////////////////////////////////////////////////////////////////
getpayor(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
{
  let url = "api/PayorRequiredID/GroupPayorDropDown?";
  return this.http.get<[{Key:number,Value:string}]>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
///////////////////////get payor service///////////////////////////////////////////////////////
getpayorservice(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/Employee/getServicedropdownForPayrates?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
///////////////////////get payor service///////////////////////////////////////////////////////
getmanagepayrate(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/LOV/getLovDropDown?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//////////////////////////////////////////get payRate Unit///////////////////////////////////////
getPayrateUnit():Observable<[{Key:number,Value:string}]>
{
  let url = "api/PayRateUnit/PayRateUnitDropDown?";
  return this.http.get<[{Key:number,Value:string}]>(url ,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
///////////////////////////////////////////save payor RequiredId////////////////////////////////////////////////
savePayorRequired(payor):Observable<number>
{
  let url = "api/PayorRequiredID/SavePayorRequiredID";
  return this.http.post<number>(url , payor,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
///////////////////////////////save payrate//////////////////////////////////////////////////////////

savePayorRate(payrate):Observable<number>
{
  let url = "api/PayRateUnit/SavePayRateUnit";
  return this.http.post<number>(url , payrate,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
////////////////////////get Manage Payrates////////////////////////////////////////////////////////////

getManagePayrateUnit(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/ManagePayrate/GetManagePayrateList?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
/////////////////////////////////save manage payrate/////////////////////////////////////////////
saveMangePayorRate(payrate):Observable<number>
{
  let url = "api/ManagePayrate/SaveManagePayrate";
  return this.http.post<number>(url , payrate,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
////////////////////////delete payor required id////////////////////////////////////////////////
deletepayorReqiured(paramsData:URLSearchParams)
{
  let url = "api/PayorRequiredID/DeletePayorRequiredID?"
  return this.http.delete<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )

}
////////////////////////delete payrate ////////////////////////////////////////////////
deletepayrate(paramsData:URLSearchParams)
{
  let url = "api/PayRateUnit/DeletePayRateUnit?"
  return this.http.delete<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )

}
//////////////////upload employee/////////////////////////////////////////////////
uploadEmployeedata(val):Observable<any>
{
  let url = "api/Employee/uploademployee?agencyId"  
  
   

  return this.http.post<any>(url , val,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get employee permission==========================================//
getEmployeepermission(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/functionpermisssion/getfunctionpermissionemployee?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Activity==========================================//
getServiceActivity(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/EmployeeServiceActivity/getMappedServiceSeperateData?"
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Dropdown==========================================//
getServiceDropDown(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/Employee/getServicedropdownForPayrates?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Dropdown==========================================//
getMappedService(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/EmployeeServiceActivity/getServiceActivityList?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}

ResetPassword(paramsData:URLSearchParams):Observable<any>
{
    const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        // observe:'response'
      };
    //console.log("service working");
    //console.log("Dat=======",paramsData);
    let url = "api/Login/EmpResetPassword?";
     return  this.http.post<number>(url+paramsData,httpOptions).pipe(
        // map(data => data.body ),
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
