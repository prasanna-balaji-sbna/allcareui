import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { GroupPayorList, getMappedCompanyBO, GetGroupPayorBO ,ColumnChangeBO} from './group-payor.model';
import { ToastrService } from 'ngx-toastr';
// import { GroupPayorList} from './group-payor-service.model';


@Injectable()
export class GroupPayorsService{
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
    constructor(private http: HttpClient,public errorService: ErrorService,public toastrService: ToastrService,) { }
    // getGroupPayorList( paramsData:URLSearchParams):Observable<GroupPayorList[]>
    // {
    //     console.log("group payor working")

    //     let url = "api/GroupPayor/GetGroupPayorFilterList?";
    //     return  this.http.get<GroupPayorList[]>(url + paramsData,{observe :'response'}).pipe(
    //     map(data => data.body ),
        
    //     catchError(this.errorService.handleError)
      
    //     )
    // }
    getGroupPayorList(paramsdata:GetGroupPayorBO):Observable<GroupPayorList[]>
    {
        console.log("service working")

        let url = "api/GroupPayor/GetGroupPayorFilterList?";
    return  this.http.post<GroupPayorList[]>(url,paramsdata,{observe :'response'}).pipe(
    map(data => data.body),
    catchError(this.errorService.handleError)
    )
}
    getPayorTotalItem(paramsData:URLSearchParams):Observable<GroupPayorList[]>
    {

        let url = "api/GroupPayor/GetGroupPayorFilterList_Count?";
        return  this.http.get<GroupPayorList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        
        catchError(this.errorService.handleError)
      
        )
    }
deleteGroup(paramsData:URLSearchParams):Observable<any>
{

    let url = "api/GroupPayor/DeleteGroupPayor?";
    return  this.http.delete(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    
    catchError(this.errorService.handleError)
  
    )
}

deleteCompanyMapping(paramsData:URLSearchParams):Observable<any>
{

  let url = "api/GroupPayorCompanyMapping/DeleteGroupPayorCompany?";
    return  this.http.delete(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    
    catchError(this.errorService.handleError)
  
    )
}
getCompanyItem(paramsData:URLSearchParams):Observable<getMappedCompanyBO[]>
{

  let url = "api/GroupPayorCompanyMapping/GetGroupPayorCompanyMappingList?";

    return  this.http.get<getMappedCompanyBO[]>(url + paramsData,{observe :'response'}).pipe(
    map(data => data.body ),
    
    catchError(this.errorService.handleError)
  
    )
}
saveupdate(data :GroupPayorList):Observable<number>
{
    console.log("service working",data)
    let url = "api/GroupPayor/SaveGroupPayor";
     return  this.http.post<number>(url,data,{observe :'response'}).pipe(
     map(data => data.body ),
    // catchError(this.errorService.handleError)
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
