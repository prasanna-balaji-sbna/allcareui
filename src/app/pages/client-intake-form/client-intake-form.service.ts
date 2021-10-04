import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
//import {ColumnChangeBO} from './client-intake-form.model';


@Injectable({
  providedIn: 'root'
})
export class ClientIntakeFormService {

  constructor(private http: HttpClient,public errorService: ErrorService) { }
  getStatus( paramsData:URLSearchParams):Observable<any>
  {


      let url ="api/LOV/getLovDropDown?";
      return  this.http.get(url + paramsData,{observe :'response'}).pipe(
      map(data => data.body ),
      
      catchError(this.errorService.handleError)
    
      )
  }
  getClient(paramsData:URLSearchParams):Observable<any>
  {
      let url = "api/IntakeClient/ClientDropDown?";

      return  this.http.get(url+paramsData,{observe :'response'}).pipe(
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
