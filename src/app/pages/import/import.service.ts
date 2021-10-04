import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ImportBO, functionpermission,GetListBO, ImportreturnBO } from './import.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO} from '../list/list.model';

@Injectable()
export class ImportService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }


    getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
    {
    let url="api/functionpermisssion/getfunctionpermission?";
    return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getImportarray(paramsData:URLSearchParams):Observable<ImportreturnBO>
    {
         let url = "api/Import/GetImport?";

    return  this.http.get<ImportreturnBO>(url + paramsData,{observe :'response'}).pipe(
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