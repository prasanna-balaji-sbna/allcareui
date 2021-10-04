import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
import { GetClientEvaluation } from './relationship.model';
@Injectable()

export class RelationshipDataService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: GetClientEvaluation): void {
    this.getList(state).subscribe(x => super.next(x ));
  }
 
  public executeClient(state: GetClientEvaluation): void {
    this.getListClient(state).subscribe(x => super.next(x ));
  }
  getList(state?: GetClientEvaluation): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/EmployeeClientRelationship/GetEmployeeClientRelationshipList", state)
.map(
        (response: any) =>(<any>{
            result: response['relationList'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
            //   element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
            //    element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }


  getListClient(state?: GetClientEvaluation): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClientEmployeeRelationship/GetClientEmployeeRelationshipList", state)
.map(
        (response: any) =>(<any>{
            result: response['relationList'],
            count: response['totalCount']
          })).map((e:any)=>{
        //   console.log(e)
            e.result.forEach(element => {
              
            //   element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
            //    element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
       //    console.log(e)
            return e;})


  }

}
