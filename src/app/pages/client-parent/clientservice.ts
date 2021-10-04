import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { AuthListBO, CertificationListBO, getClient, GetClientCasemanager, GetClientEvaluation, GetClientNotes, SOCListBO } from './client-parent.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class clienttserivce extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: getClient): void {
    this.getList(state).subscribe(x => super.next(x ));
  }
  public executeEvaluation(state: GetClientEvaluation): void {
    this.getClientEvaluation(state).subscribe(x => super.next(x ));
  }

  public executecasemanager(state: GetClientCasemanager): void {
    this.getClientCasemanager(state).subscribe(x => super.next(x ));
  }

  public executecarecoordinator(state: GetClientEvaluation): void {
    this.getClientCarecoodinator(state).subscribe(x => super.next(x ));
  }
 
  public executenotes(state: GetClientEvaluation): void {
    this.getClientNotes(state).subscribe(x => super.next(x ));
  }
  public executedocuments(state: GetClientNotes): void {
    this.getClientDocuments(state).subscribe(x => super.next(x ));
  }
  public executeSOC(state: GetClientNotes): void {
    this.getClientSOC(state).subscribe(x => super.next(x ));
  }

  public executeAuth(state: AuthListBO): void {
    this.getClientAuth(state).subscribe(x => super.next(x ));
  }

  public executeCertification(state: CertificationListBO): void {
    this.getClientCertification(state).subscribe(x => super.next(x ));
  }
  getList(state?: getClient): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Client/GetClientListFilter", state)
.map(
        (response: any) =>(<any>{
            result: response['clientLst'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
              element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
               element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }

  getClientEvaluation(state?: GetClientEvaluation): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Client/GetServiceEvaluation", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli1'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
              // element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
              //  element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }


  getClientCasemanager(state?: GetClientCasemanager): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClientCaseManagerRelationship/GetCaseManagerRelationshipList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
              // element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
              //  element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }

  getClientCarecoodinator(state?: GetClientCasemanager): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClientCoordinatorRelationship/GetClientCoordinatorRelationshipList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
              // element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
              //  element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }

  getClientNotes(state?: GetClientNotes): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClientNote/GetClientNoteList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
            
            })
       //    console.log(e)
            return e;})


  }

  getClientDocuments(state?: GetClientCasemanager): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Document/GetDocumentList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
            
            })
       //    console.log(e)
            return e;})


  }

  getClientSOC(state?: SOCListBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/StartOfCare/GetStartOfCareList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
            
            })
       //    console.log(e)
            return e;})


  }

  getClientAuth(state?: AuthListBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClientAuthorization/GetClientAuthorizationList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
            
            })
       //    console.log(e)
            return e;})


  }

  getClientCertification(state?: CertificationListBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Certification/GetCertificationList", state)
.map(
        (response: any) =>(<any>{
            result: response['listcli'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
            
            })
       //    console.log(e)
            return e;})


  }
}
