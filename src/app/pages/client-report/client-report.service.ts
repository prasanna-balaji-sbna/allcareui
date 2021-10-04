import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../icd10/icd10.model';

@Injectable({
  providedIn: 'root'
})
export class ClientReportService {

  constructor(public http:HttpClient,public errorService: ErrorService) { }
///=========================================get Client========================================================//
  getClientdata(paramsData:URLSearchParams):Observable<any>
  {

    let url="api/Client/GetClientListbyTd?"
    return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
  getstatusdata(paramsData:URLSearchParams):Observable<any>
  {

    let url = "api/LOV/getLovDropDown?";
    return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
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
