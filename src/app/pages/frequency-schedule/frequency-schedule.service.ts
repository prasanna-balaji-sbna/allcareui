import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { ToastrService } from 'ngx-toastr';
// import { GroupPayorList} from './group-payor-service.model';


@Injectable()
export class FrequencyScheduleService{
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
    constructor(private http: HttpClient,public errorService: ErrorService,public toastrService: ToastrService,) { }

    getActiveEmployee(paramsData:URLSearchParams):Observable<any>
    {
    
      let url = "api/Employee/getActiveEmployee?";
    
        return  this.http.get<any>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
      
        )
    }
}
