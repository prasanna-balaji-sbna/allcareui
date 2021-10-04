import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { ClientReturnBO, StartOfCareBO, ClientCertificationBO, PhysicianBO, ClientBO, returnClientAuthorization,
  carecoordinate,getMappedCMDataBO,DocumentBO } from './client-parent.model';
import { ColumnChangeBO } from '../list/list.model';


@Injectable({
  providedIn: 'root'
})
export class ClientHttpService {
  constructor(private http: HttpClient, public errorService: ErrorService,private handler: HttpBackend) { }


  getConsumer(): Observable<any> {
    let httpLocal = new HttpClient(this.handler);
    return httpLocal.get("./assets/consumerAssesment.json");
}

  //////////////////////////////get Employee Status//////////////////////////////////////////////////////////////////////
  getLOV(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/LOV/getLovDropDown?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ////////////////////////////getDescription//////////////////////////////////
  getServiceDescription(paramsData: URLSearchParams): Observable<any> {
    let url = "api/ClientAuthorization/GetServiceDescription?";
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }
    return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )



  }

  ////////////////////////////getPayorDropDown////////////////////
  getPayorDropDown(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/GroupPayor/CommonGetGPList?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ////////////////////////////////////////getcompany////////////////////////////////
  getCompany(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Company/CommonGetCompanyList?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ////////////////////////////////////////save Authorization////////////////////////////////
  saveauthorization(authList: ClientReturnBO[]): Observable<number> {
    let url = "api/ClientAuthorization/SaveClientAuthorization";
    return this.http.post<number>(url, authList, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  ////////////////////////////getbillingvalue//////////////////////////////////
  getbillingvalue(paramsData: URLSearchParams): Observable<number> {
    let url = "api/ClientAuthorization/GetBilling?";
    return this.http.get<number>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  ////////////////////////////getgrouppayorservice////////////////////
  getgrouppayorservice(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/ClientAuthorization/GetServicedropdown?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }




  ////////////////////////////////get Authorization///////////////////////////////////////////////////////////////////////

  getauthorization(authList: URLSearchParams): Observable<returnClientAuthorization> {
    let url = "api/ClientAuthorization/GetClientAuthorizationList?";
    return this.http.get<returnClientAuthorization>(url + authList, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ////////////////////////////////update Authorization///////////////////////////////////////////////////
  updateeAuthorizationData(authList: ClientReturnBO[]): Observable<number> {
    let url = "api/ClientAuthorization/UpdateClientAuthorization";
    return this.http.post<number>(url, authList, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  //////////////////////////////delete Authorization/////////////////////////////////////////////////
  deleteAuthdata(paramsData: URLSearchParams) {
    let url = "api/ClientAuthorization/DeleteClientAuthorization?"
    return this.http.delete<any>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }


  //////////////////////////////////////getsoclist/////////////////////////////////
  getClientSOClist(params: URLSearchParams): Observable<StartOfCareBO[]> {
    let url = "api/StartOfCare/GetStartOfCareList?";
    return this.http.get<StartOfCareBO[]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////////////////getcertification/////////////////////////////////
  getCertificationList(params: URLSearchParams): Observable<ClientCertificationBO[]> {
    let url = "api/Certification/GetCertificationList?";
    return this.http.get<ClientCertificationBO[]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  /////////////////////////////////////////getNPIDetails///////////////////////////////////
  getNPIDetails(params: URLSearchParams): Observable<PhysicianBO> {
    let url = "api/Physician/getPhysicianData?";
    return this.http.get<PhysicianBO>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  //////////////////////////////////////////////saveClientData//////////////////////////////////
  saveClientData(list: ClientBO): Observable<ClientReturnBO> {
    let url = "api/Client/SaveClient";
    return this.http.post<ClientReturnBO>(url, list, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ///////////////////////////////////////////getClientListTotalCount/////////////////////////////
  getClientListTotalCount(params: URLSearchParams): Observable<number> {
    let url = "api/Client/GetClientListCount?";
    return this.http.get<number>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

  ///////////////////////////////////////////getClientList/////////////////////////////
  getClientListDetails(params: URLSearchParams): Observable<ClientBO[]> {
    let url = "api/Client/GetClientList?";
    return this.http.get<ClientBO[]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  /////////////////save soc////////////////////////////////////
  saveStartOfCare(list): Observable<number> {
    let url = "api/StartOfCare/SaveStartOfCare";
    return this.http.post<number>(url, list, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError))

  }
  /////////////////delete start of care/////////////////////////////////////
  deleteStartOfCare(paramsData: URLSearchParams): Observable<any> {
    let url = "api/StartOfCare/DeleteStartOfCare?";
    return this.http.delete<any>(url + paramsData).pipe(
      map(data => data),
      catchError(this.errorService.handleError))

  }
  /////////////////save certificate////////////////////////////////////
  savecertificate(list): Observable<number> {
    let url = "api/Certification/SaveCertification";
    return this.http.post<number>(url, list, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError))

  }
  /////////////////save certificate////////////////////////////////////
  savephysican(list): Observable<number> {
    let url = "api/Physician/SavePhysician?"
    return this.http.post<number>(url, list, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError))

  }
  /////////////////delete certificate////////////////////////////////////////
  deletecertificate(paramsData: URLSearchParams): Observable<number> {
    let url = "api/Certification/DeleteCertification?"
    return this.http.delete<any>(url + paramsData).pipe(
      map(data => data),
      catchError(this.errorService.handleError))

  }
  //////////////////////////////////////getsoclist/////////////////////////////////
  getDischargedata(params: URLSearchParams): Observable<any> {
    let url = "api/DischargeCodeDetail/GetDischargeCodeDetailList?";
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
   ///////////////////////////////////////////getClientList/////////////////////////////
   getcareLst(params: URLSearchParams): Observable<carecoordinate[]> {
    let url = "api/ClientCoordinatorRelationship/GetClientCoordinatorRelationshipList?";
    return this.http.get<carecoordinate[]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  /////////////////save client carecoordinator////////////////////////////////////
  savecare(list): Observable<number> {
    let url = "api/ClientCoordinatorRelationship/SaveClientCoordinatorRelationship"
    return this.http.post<number>(url, list, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError))

  }
   /////////////////delete client carecoordinator////////////////////////////////////////
   deletecare(paramsData: URLSearchParams): Observable<number> {
    let url = "api/ClientCoordinatorRelationship/DeleteClientCoordinatorRelationship?"
    return this.http.delete<any>(url + paramsData).pipe(
      map(data => data),
      catchError(this.errorService.handleError))

      
  }
   //////////////////////////////get Employee Status//////////////////////////////////////////////////////////////////////
   getStatus(paramsData:URLSearchParams):Observable<[{Key:number,Value:string}]>
   {
 
     let url = "api/LOV/getLovDropDown?";
     return  this.http.get<[{Key:number,Value:string}]>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ),
     catchError(this.errorService.handleError)
     )
   }
   //==============================get case manager===================================//
   getcaseLst(params: URLSearchParams): Observable<getMappedCMDataBO[]>
   {
    let url = "api/ClientCaseManagerRelationship/GetCaseManagerRelationshipList?";
    return this.http.get<getMappedCMDataBO[]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
}
 /////////////////save client caseManger////////////////////////////////////
 savecase(list): Observable<number> {
  let url = "api/ClientCaseManagerRelationship/SaveClientCaseManagerRelationship"
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))

}
 /////////////////delete client carecoordinator////////////////////////////////////////
 deletecase(paramsData: URLSearchParams): Observable<number> {
  let url = "api/ClientCaseManagerRelationship/DeleteClientCaseManagerRelationship?"
  return this.http.delete<any>(url + paramsData).pipe(
    map(data => data),
    catchError(this.errorService.handleError))

    
}
//======================get document =====================================================//

getDocumentData(paramsData: URLSearchParams):Observable<DocumentBO[]> 
{
  let url = "api/Document/GetDocumentList?"
  return this.http.get<DocumentBO[]>(url + paramsData, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
 //////////////////////////////get Employee Status//////////////////////////////////////////////////////////////////////
 getDocumentName(paramsData: URLSearchParams): Observable<any> {
  let url = "api/LOV/getLovType?";
  return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
/////////////////save client Document////////////////////////////////////
saveDocumentData(list:FormData): Observable<number> {
  let url = "api/Document/SaveDocument";
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))

}
//=====================save Lov===============================================================//
saveLovData(list):Observable<number>
{
  let url = "api/LOV/SaveLov";
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}

//=====================delete client carecoordinator===============================================================//
deletedocument(paramsData: URLSearchParams): Observable<number> {
  let url = "api/Document/DeleteDocument?"
  return this.http.delete<any>(url + paramsData).pipe(
    map(data => data),
    catchError(this.errorService.handleError))

    
}
Clientdropdown(paramsData: URLSearchParams)
{
  let url = "api/ClientEmployeeRelationship/ClientDropDown2?"
  return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
EmployeeDropdown(paramsData: URLSearchParams)
{
  let url = "api/ClientEmployeeRelationship/GetEmployeeDrop1?"
  return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
getClientEmployeeRelation(params:URLSearchParams)
{
  let url = "api/ClientEmployeeRelationship/GetClientEmployeeRelationshipList1?"
  return this.http.get<any>(url + params, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}

saveClientEmployeedatas(list):Observable<number>
{
  let url = "api/ClientEmployeeRelationship/SaveClientEmployeeRelationship1";
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}
getNoteData(params:URLSearchParams):Observable<any>
{
  let url = "api/ClientNote/GetClientNoteList?";
  return this.http.get<any>(url + params, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
getTypeLst():Observable<any>
{
  let url = "api/TypeList/GetTypeListList";
  return this.http.get<any>(url , { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
savenotedata(list,url):Observable<number>
{
  
  
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}
uploadClientlst(param:FormData,url:string):Observable<any>
{
  
  return this.http.post<any>(url, param, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}
getContact(params:URLSearchParams):Observable<any>
{
  let url = "api/Contact/GetContactList?"
  return this.http.get<any>(url +params, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}
saveContactdata(list)
{
  let url="api/Contact/SaveContact"
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}
saveTypedata(list)
{
  let url="api/TypeList/SaveTypeList"
  return this.http.post<number>(url, list, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError))
}
deltenotedatas(params:URLSearchParams)
{
  let url="api/ClientNote/DeleteClientNote?"
  return this.http.delete<any>(url + params).pipe(
    map(data => data),
    catchError(this.errorService.handleError))
}
getEvalutiondata(params:URLSearchParams):Observable<any>
{
  let url = "api/client/GetServiceEvaluation?";
  return this.http.get<any>(url +params, { observe: 'response' }).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
  )
}

//==============================get employee permission==========================================//
getClientpermission(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/functionpermisssion/getfunctionpermissionclient?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Activity==========================================//
getServiceActivity(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/ClientServiceActivity/getMappedServiceData?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Dropdown==========================================//
getServiceDropDown(paramsData:URLSearchParams):Observable<any>
{
  // let url = "api/Employee/getServicedropdownForPayrates?";
  let url ="api/Timesheet/GetServicedropdownByAgencyService?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}
//==============================get Service Dropdown==========================================//
getMappedService(paramsData:URLSearchParams):Observable<any>
{
  let url = "api/ClientServiceActivity/getClientServiceActivityMappedList?";
  return this.http.get<any>(url +paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
}

 
getcolumwidth():Observable<any>
{


let url = "api/ColumnChange/getwidth?";
return  this.http.get<any>(url,{observe :'response'}).pipe(
map(data => data.body ),
catchError(this.errorService.handleError)
)
}
savecolumwidth(list:ColumnChangeBO):Observable<any>
{


let url = "api/ColumnChange/Savewidth?";
return  this.http.post<number>(url,list,{observe :'response'}).pipe(
map(data => data.body ),
catchError(this.errorService.handleError)
)
}
}
