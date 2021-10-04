import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LovBO, lovDropdown, GetListBO,ColumnChangeBO } from './lov.model';
import { ErrorService } from '../../error.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map,  retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgZone } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LovService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    })
  };
  constructor(private http: HttpClient,public errorService: ErrorService,public toastrService: ToastrService, public zone: NgZone) { }

  public sendGetRequest(){
    console.log('dd');
    
    return this.http.get<lovDropdown[]>('api/List/ListDropDown?').pipe(catchError(this.errorService.handleError));
  } 
// getLovList( paramsData:URLSearchParams):Observable<any> 
// {
//   console.log("service working")

//   let url = "api/LOV/GetLovListFilter?";
//   return  this.http.get<LovBO[]>(url + paramsData,{observe :'response'}).pipe(
//   map(data => data.body ),
//   catchError(this.errorService.handleError)

//   )
// }
getLovList(paramsdata:GetListBO):Observable<LovBO[]>
{
    console.log("service working")

    let url = "api/LOV/GetLovListFilter?";
return  this.http.post<LovBO[]>(url,paramsdata,{observe :'response'}).pipe(
map(data => data.body),
catchError(this.errorService.handleError)
)
}
saveupdate(saveList :LovBO):Observable<number>
  {
      console.log("save working",saveList)
      let url = "api/LOV/SaveLov";
       return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
       map(data => data.body ),
      catchError(this.errorService.handleError)
       )
  }
  deleteLov( paramsData:URLSearchParams):Observable<any> 
  {
 
    
    let url = "api/LOV/DeleteLov?";
    return  this.http.delete<number>(url+paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    catchError(this.errorService.handleError)
    )
  }
//   handleError(error: HttpErrorResponse){
//     console.log("lalalalalalalala");
//   this.toastrService.error('Something went wrong!');
//     return throwError(error);
//     }
////////===========================Column change func==================///
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