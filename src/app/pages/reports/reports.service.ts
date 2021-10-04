import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'src/app/error.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ColumnChangeBO, functionpermission } from '../icd10/icd10.model';
import { groupList, PayorList } from '../batch/batch.model';
@Injectable()
export class ReportsService {
    constructor(private http: HttpClient, public errorService: ErrorService) { }

  

//    getServiceLLineDetails(params: URLSearchParams): Observable<ClaimServiceLine[]> {

//         let url = "api/ClaimMaster/getServiceLineDetails?";
//         return this.http.get<ClaimServiceLine[]>(url+params, { observe: 'response' }).pipe(
//             map(data => data.body),
//             catchError(this.errorService.handleError)
//         )
//     }

getPayorList(paramsData: URLSearchParams): Observable<PayorList[]> {
    let url = "api/GroupPayor/GetGroupPayorBatch?"
        return this.http.get<PayorList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    getgroupList(paramsData: URLSearchParams): Observable<groupList[]> {
        let url = "api/LOV/getLovDropDown?"
        return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
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
  
    ////////////////////////////////////////cleRINGHOUSE////////////////////////////////
    getClearinghouse(paramsData: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
        let url = "api/ClearingHouse/getCommonClearingHouselist?";
        return this.http.get<[{ Key: number, Value: string }]>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
        )
      }

      Submissionreports(saveList: URLSearchParams): Observable<any> {


        let url = "api/BatchFile/GetBatchFilesreport?";

        return this.http.get<any>(url+ saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    Exceptionreports(saveList: URLSearchParams): Observable<any> {


      let url = "api/Import/GetExceptionlist?";

      return this.http.get<any>(url+ saveList, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
      )
  }
    getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
      let url = "api/Client/GetEmpListbyType?"
      return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
      )
    }

    
  //////////////////////////////////////////get Client///////////////////////////////////////////////////////

  getClient(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetClientListbyTd?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }




  //===========================get Lov=============================================================//
  getfilterList(paramsData: URLSearchParams): Observable<any> {
    let url = "api/LOV/getLovDropDown?"
    return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)

    )
}

//===========================get Lov=============================================================//
getReport(paramsData: URLSearchParams): Observable<any> {
  let url = "api/Client/getInactiveReport?"
  return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)

  )
}
//=======================get 835===============================================================//
get835(paramsData: URLSearchParams): Observable<any> {

  let url = "api/Import/Get835Dropdown?"
  return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
  )}
  createspendowndlist(paramsData: URLSearchParams): Observable<any> {
    
      let url = "api/Import/CreatespenDown?"
      return this.http.get<any>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)
      )}
      downloadspendowndlist(paramsData:any): Observable<any> {
    
        let url = "api/Import/printspendown?"
        return this.http.post<any>(url , paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )}


getRevenuePayorList(paramsData: URLSearchParams): Observable<PayorList[]> {
  let url = "api/GroupPayor/CommonGetGPList?"
      return this.http.get<PayorList[]>(url + paramsData, { observe: 'response' }).pipe(
          map(data => data.body),
          catchError(this.errorService.handleError)

      )
  }
  getDateLidList(paramsData: URLSearchParams): Observable<groupList[]> {
    let url = "api/LOV/getLovDropDown?"
    return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)

    )
}
getChargeLidList(paramsData: URLSearchParams): Observable<groupList[]> {
  let url = "api/LOV/getLovDropDown?"
  return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)

  )
  
}
getRevenueList(paramsData: URLSearchParams): Observable<groupList[]> {
  let url = "api/ClaimMaster/GetRevenuesbyPayor?"
  return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)

  )
}
getClaimvsPaidListDetails(paramsData: URLSearchParams): Observable<groupList[]> {
  let url = "api/ClaimMaster/getClaimChargesVsPaidList?"
  return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)

  )
}
getFinancialListDetails(paramsData: URLSearchParams): Observable<groupList[]> {
  let url = "api/ClaimMaster/getfinancial?"
  return this.http.get<groupList[]>(url + paramsData, { observe: 'response' }).pipe(
      map(data => data.body),
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

Exceptionreports835(saveList: URLSearchParams): Observable<any> {


  let url = "api/Import/Get835Exceptionlist?";

  return this.http.get<any>(url+ saveList, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
  )
}
}
