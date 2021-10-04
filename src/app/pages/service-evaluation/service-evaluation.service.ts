import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
// import { ServiceList,DropList, functionpermission,GetMSListBo } from './manage.model';
import { ErrorService } from 'src/app/services/error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ColumnChangeBO } from './service-evaluation.model';


@Injectable({
  providedIn: 'root'
})
export class ServiceEvaluationService {

  constructor(private http: HttpClient,public errorService: ErrorService,private ngxService: NgxUiLoaderService,) { }
  getClientDropdown(paramsData:URLSearchParams):Observable<any>
  {
    let url = "api/Client/GetClientForServiceEvaluation?";
   return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
     map(data => data.body ,
    this.ngxService.stop()
    ),

     catchError(this.errorService.handleError)
     )
  }
  gettoltaliteam(paramsData:URLSearchParams):Observable<any>
  {
    let url = "api/ServiceEvaluation/GetServiceEvaluation?";

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
