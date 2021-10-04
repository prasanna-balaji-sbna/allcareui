import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'src/app/error.service';
import { Observable } from 'rxjs';
import { PayorList, groupList, StatusList, getBatchFilter, EmployeeList, ClientList, ClearinghouseList, ResubmissionList, Proclaim, ClaimServiceLine, ZipcodeDetail, BillingClaimWithDetailBO, BatchFileBO, SaveBatchFileNewBO, SaveBatchFileNewReturnBO, BatchFileIdList, AmountInfo } from './batch.model';
import { catchError, map } from 'rxjs/operators';
import { ColumnChangeBO, functionpermission } from '../icd10/icd10.model';
@Injectable()
export class BatchService {
    constructor(private http: HttpClient, public errorService: ErrorService) { }

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

    getStatusList(paramsData: URLSearchParams): Observable<StatusList[]> {
        let url = "api/LOV/LovDropDownBatch?"
        return this.http.get<StatusList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }
    getEMployee(paramsData: URLSearchParams): Observable<EmployeeList[]> {
        let url = "api/Client/GetEmpListbyId?"
        return this.http.get<EmployeeList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    getClient(paramsData: URLSearchParams): Observable<ClientList[]> {
        let url = "api/Client/GetCommonClientListByAgency?"
        return this.http.get<ClientList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    getClearing(paramsData: URLSearchParams): Observable<ClearinghouseList[]> {
        let url = "api/ClearingHouse/getCommonClearingHouselist?";
        return this.http.get<ClearinghouseList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    getClaimWithoutBatchFun(saveList: getBatchFilter): Observable<number> {

        let url = "api/ClaimMaster/getBillingClaimWithoutBatch";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    getActiveClaimWithoutBatchFun(saveList: getBatchFilter): Observable<number> {

        let url = "api/ClaimMaster/getActiveClaimWithoutBatch";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    getCompany(paramsData: URLSearchParams): Observable<ClearinghouseList[]> {

        let url = "api/Company/CommonGetCompanyList?";
        return this.http.get<ClearinghouseList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }
    getClaimwithbatch(paramsData: URLSearchParams): Observable<BillingClaimWithDetailBO[]> {

        let url = "api/BillingClaim/getBillingClaimWithBatch?";
        return this.http.get<BillingClaimWithDetailBO[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    getresubmissionCode(paramsData: URLSearchParams): Observable<ResubmissionList[]> {
        let url = "api/LOV/getLovDropDown?"
        return this.http.get<ResubmissionList[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }


    GetClaimViewDetail(paramsData: URLSearchParams): Observable<Proclaim> {
        let url = "api/ClaimMaster/GetClaimViewDetail?"
        return this.http.get<Proclaim>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    updateProfessionalClaim(saveList: Proclaim): Observable<number> {


        let url = "api/ClaimMaster/EditClaim";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    SaveServiceLine(saveList: ClaimServiceLine): Observable<number> {


        let url = "api/ClaimMaster/AddServiceLine";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    getZipcode(paramsData: URLSearchParams): Observable<ZipcodeDetail> {
        let url = "api/Client/getZipcode?"
        return this.http.get<ZipcodeDetail>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }

    deleteservice(id: number): Observable<any> {
        let url = "api/ClaimMaster/DeleteServineLine?Id=" + id;
        return this.http.delete<number>(url, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    getBatch(paramsData: URLSearchParams): Observable<BatchFileBO[]> {

        let url = "api/BatchFile/GetBatchFile?";
        return this.http.get<BatchFileBO[]>(url + paramsData, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)

        )
    }
    CreateBatch(saveList: SaveBatchFileNewBO): Observable<SaveBatchFileNewReturnBO> {


        let url = "api/ClaimProcess/SaveBatchFile";

        return this.http.post<SaveBatchFileNewReturnBO>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    MovetoarchiveFun(saveList: BatchFileIdList[]): Observable<number> {

        let url = "api/ClaimMaster/MovetoArchive";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    reexport(saveList: BatchFileIdList[]): Observable<number> {

        let url = "api/ClaimMaster/ReexportClaim";

        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    MovetoactiveFun(saveList: BatchFileIdList[]): Observable<number> {

        let url = "api/ClaimMaster/MovetoActive";
        return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    MarkAsPaidFunction(params: URLSearchParams): Observable<void> {

        let url = "api/ClaimMaster/MarkAsPaid?";
        return this.http.get<void>(url + params, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    getServiceLLineDetails(params: URLSearchParams): Observable<ClaimServiceLine[]> {

        let url = "api/ClaimMaster/getServiceLineDetails?";
        return this.http.get<ClaimServiceLine[]>(url + params, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }

    getClaimAmtDetails(params: URLSearchParams): Observable<AmountInfo> {

        let url = "api/ClaimMaster/GetClaimAmount?";
        return this.http.get<AmountInfo>(url + params, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    deleteClaimData(params: URLSearchParams) {
        let url = "api/ClaimProcess/deleteClaim?";
        return this.http.get<ClaimServiceLine[]>(url + params, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    deleteBatchClaimservice(params: URLSearchParams) {
        let url = "api/ClaimProcess/deleteBatchClaim?";
        return this.http.get<ClaimServiceLine[]>(url + params, { observe: 'response' }).pipe(
            map(data => data.body),
            catchError(this.errorService.handleError)
        )
    }
    /* Get status key value pair */
    getStatusForClaim( paramsData:URLSearchParams)   {
        
   
        
        let url = "api/LOV/getLovDropDown?"
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