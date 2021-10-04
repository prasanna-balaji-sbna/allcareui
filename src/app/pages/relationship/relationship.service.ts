import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import{EmployeeClientRelationship} from './relationship.model'
import { ColumnChangeBO } from '../icd10/icd10.model';
@Injectable({
  providedIn: 'root'
})
export class RelationshipService {

  constructor(private http: HttpClient, public errorService: ErrorService) { }
  /////////////////////////////////////////get Client//////////////////////////////////////////////////////////
  getclient(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/EmployeeClientRelationship/ClientDropDown?";
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
   /////////////////////////////////////////get Client//////////////////////////////////////////////////////////
   getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/ClientEmployeeRelationship/GetEmployeeDrop?";
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(map(data => data.body),
      catchError(this.errorService.handleError));
  }
  //////////////////////////////get Status//////////////////////////////////////////////////////////////////////
  getStatus(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {

    let url = "api/LOV/getLovDropDown?";
    return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  //////////////////////////get Employee Relationship data///////////////////////////////////////////////////
  getEmployeeRelationshipData(paramsData: URLSearchParams):Observable<EmployeeClientRelationship[]>
  {
    let url = "api/EmployeeClientRelationship/GetEmployeeClientRelationshipList?"
    return this.http.get<EmployeeClientRelationship[]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
   //////////////////////////get Employee Relationship data///////////////////////////////////////////////////
   getClientRelationshipData(paramsData: URLSearchParams):Observable<EmployeeClientRelationship[]>
   {
    let url = "api/ClientEmployeeRelationship/GetClientEmployeeRelationshipList?"
     return this.http.get<EmployeeClientRelationship[]>(url + paramsData, { observe: 'response' }).pipe(
       map(data => data.body),
       catchError(this.errorService.handleError)
     )
   }
  saveRelationship(relatioship):Observable<number>
{
  let url = "api/EmployeeClientRelationship/SaveEmployeeClientRelationship";
  return this.http.post<number>(url , relatioship,{observe :'response'}).pipe(
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
savecolumwidth(list:ColumnChangeBO ):Observable<any>
{


let url = "api/ColumnChange/Savewidth?";
return  this.http.post<number>(url,list,{observe :'response'}).pipe(
map(data => data.body ),
catchError(this.errorService.handleError)
)
}
}
