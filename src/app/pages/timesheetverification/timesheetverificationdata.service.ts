import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
import { DatePipe } from '@angular/common';
import { TimeSheetVerificationList, GetTimesheetverificationBO } from './timesheetverification.model';

@Injectable()

export class timesheetverificationdataservice extends Subject<DataStateChangeEventArgs>{
    originaldata: any = [];
    childData: any = [];
    idsList: any = [];
    
  public details: any = [];
  errorlist: any= [];
  serialno: any;
    constructor(private http: HttpClient, public global: GlobalComponent, public general: generalservice, public datePipe: DatePipe) {
        super();

    }
    public execute(state: GetTimesheetverificationBO): void {
        this.getList(state).subscribe(x => super.next(x));
    }

    getList(state?: GetTimesheetverificationBO): Observable<DataStateChangeEventArgs> {

        
        return  this.http.post<any>("api/TimeSheetVerfication/GetTimeSheetVerficationFilter", state)
            .map(
                (response: any) => (<any>{
                    result: response['timesheetlist'],
                    count: response['totalCount'],
                    ids:response['idarray']
                })).map((e: any) => {
               console.log(e,"list");
               
                    e.result = this.setdata(e);
               

                    return e;
                })


                
    }

    setdata1(data) {
        let parentArray = [];
        let childArray = [];
  
        let objArray: any = [];
      let objArray1: any = [];

      // this.parentData
      if (data.length != 0) {
          this.originaldata= data
    
      }

      
       
        return this.originaldata;
    }

    setdata(data) {
        let parentArray = [];
        let childArray = [];
        this.details = [];
        // this.childData=[];
        this.errorlist=[];
    
        let clientId : number ;
      let companyId : number ;
      let grouppayorId : number ;
      let grouppayorServiceId : number ;
      let clientcertiificationId : number ;
      let clietauthId : number ;
      let employeeId : number ;
      let payrname : string ;
        this.originaldata= data.result;
        
        this.idsList = data.ids;
            let objArray: any = [];
            if (data.result.length != 0) {
             data.result.forEach(element => {
               this.serialno = element.serialNo
               // ----------for errolist-----------
               let btncount = 0;
               let buttoncolor: any;
               clientId = element.clientId;
               companyId = element.companyId;
               grouppayorId = element.groupPayorId;
               grouppayorServiceId = element.groupPayorServiceId;
               clietauthId = element.clientAuthorizationId;
               employeeId = element.employeeId;
               payrname = element.payorName;
               element.error.forEach(element => {
     
                 if (element.isValid == true) {
     
                   this.global.loading = false;
                   element.color = "Green";
                   element.colr = 'black'
                   element.status = 'Valid'
                   //  this.buttoncolor = "Green"
                 }
                 if (element.isValid == false) {
                   element.color = "Red"
                   element.colr = 'Red'
                   //  this.buttoncolor = "red"
                   element.status = 'Not valid'
                   btncount += 1;
                 }
                 if (btncount > 0) {
                   buttoncolor = "Red"
                 }
                 else {
                   buttoncolor = "Green"
                 }
                 element.serialno = this.serialno;
                 element.clientId = clientId;
                 element.companyId = companyId;
                 element.groupPayorId = grouppayorId;
                 element.grouppayorServiceId = grouppayorServiceId;
                 element.clientauthId = clietauthId;
                 element.employeeId= employeeId;
                 element.payorName= payrname;
                 this.errorlist.push(element);
               });
              
               // ----------for parentgrid list-----------
               element.clientName = element.client_LastName.toString() + "," + " " + element.client_FirstName.toString();
               element.employee = element.employee_LastName.toString() + "," + " " + element.employee_FirstName.toString();
               if (element.claimStatus == "Validate") {
                 element.bit = 1;
                 element.color = 'red'
               }
               else {
                 element.bit = 0;
                 element.color = 'green'
               }
               let fromDate = this.datePipe.transform(element.fromDate, "MM/dd/yyyy")
               let toDate = this.datePipe.transform(element.toDate, "MM/dd/yyyy")
               let obj =
               {
                 clientName: element.clientName,
                 insuredId: element.client_InsuranceNo,
                 'payer': element.payorName,
                 'fromDate': fromDate,
                 "employeeID": element.employeeId,
                 'toDate': toDate,
                 // 'HireDate': new Date(704692800000),
                 'totalHours': element.totalHours,
                 'employee': element.employee,
                 'employeeUMPI': element.employee_UMPI,
                 'payorID': element.billingpayorID,
                 'totalAmountBIlled': element.totalAmountBIlled,
                 'claimStatus': element.claimStatus,
                 'service': element.serviceCode,
                 'serialNo': element.serialNo,
                 'buttoncolor': buttoncolor,
                 'color': element.color,
                 'bit': element.bit,
                 'validate': '',
                 'timesheetId':element.timesheetId
               }
     
               objArray.push(obj);
               // ----------for childgrid data-----------
               element.lineItem.forEach(element => {
                 if (element.lineStatus == "Validate") {
                   element.bit = 1;
                   // element.color = 'red'
                 }
                 else {
                   element.bit = 0;
                   // element.color = 'green'
                 }
                 let serviceDate = this.datePipe.transform(element.serviceDate, "MM/dd/yyyy")
                 let obj1 =
                 {
     
                   'serialNo': element.serialNo,
                   'lineStatus': element.lineStatus,
                   'serviceDate': serviceDate,
                   'dailyHours': element.dailyHours,
                   'procedureCode': element.procedureCode,
                   'serviceId':element.serviceId,
                   // 'HireDate': new Date(704692800000),
                   'moD1': element.moD1,
                   'moD2': element.moD2,
                   'moD3': element.moD3,
                   'over275Hrs': element.over275Hrs,
                   'remaimimgAuthorizedHours': element.remaimimgAuthorizedHours,
                   'overDaily16Hours': element.overDaily16Hours,
                   'timeSheetId': element.timeSheetId,
                   'bit': element.bit,
                   'payDate': this.datePipe.transform(element.paydate, "MM/dd/yyyy")
     
                 }
     
                 childArray.push(obj1);
     
     
               });
     
               parentArray = objArray;
               this.childData = childArray;
              
     
             });
             // ----------for splitday data-----------
            
             data.result.forEach(element => {
     
     
               element.lineItem.forEach(element => {
                 element.lineItemDetail.forEach(element => {
                   let serviceDate = this.datePipe.transform(element.serviceDate, "MM/dd/yyyy")
     
                   let obj2 =
                   {
     
                     // 'serialNo': element.serialNo,
                     'lineStatus': element.lineStatus,
                     'serviceDate': serviceDate,
                     "dailyHours": element.dailyHours,
                     'procedureCode': element.procedureCode,
                     'serviceId':element.serviceId,
                     // 'HireDate': new Date(704692800000),
                     'moD1': element.moD1,
                     'moD2': element.moD2,
                     'moD3': element.moD3,
                     'over275Hrs': element.over275Hrs,
                     'remaimimgAuthorizedHours': element.remaimimgAuthorizedHours,
                     'overDaily16Hours': element.overDaily16Hours,
                     'timeSheetId': element.timeSheetId
                      
     
                   }
                   this.details.push(obj2)
                 });
     
     
               });
     
     
     
             });
           }

       
        else {
            parentArray = []
            this.childData = [];
        }

// if(data.ids.length !=0)
// {
//   let objArray: any = [];
//   data.ids.forEach(element => {
//     let btncount = 0;
//     let buttoncolor: any;
    
//     if (element.isValid == true) {
     
//       this.global.loading = false;
//       element.color = "Green";
//       element.colr = 'black'
//       element.status = 'Valid'
//       //  this.buttoncolor = "Green"
//     }
//     if (element.isValid == false) {
//       element.color = "Red"
//       element.colr = 'Red'
//       //  this.buttoncolor = "red"
//       element.status = 'Not valid'
//       btncount += 1;
//     }
//     if (btncount > 0) {
//       buttoncolor = "Red"
//     }
//     else {
//       buttoncolor = "Green"
//     }
//    // ----------for parentgrid list-----------
//    element.clientName = element.client_LastName.toString() + "," + " " + element.client_FirstName.toString();
//    element.employee = element.employee_LastName.toString() + "," + " " + element.employee_FirstName.toString();
//    if (element.claimStatus == "Validate") {
//      element.bit = 1;
//      element.color = 'red'
//    }
//    else {
//      element.bit = 0;
//      element.color = 'green'
//    }
//     let fromDate = this.datePipe.transform(element.fromDate, "MM/dd/yyyy")
//     let toDate = this.datePipe.transform(element.toDate, "MM/dd/yyyy")
//     let obj =
//     {
//       clientName: element.clientName,
//       insuredId: element.client_InsuranceNo,
//       'payer': element.payorName,
//       'fromDate': fromDate,
//       "employeeID": element.employeeId,
//       'toDate': toDate,
//       // 'HireDate': new Date(704692800000),
//       'totalHours': element.totalHours,
//       'employee': element.employee,
//       'employeeUMPI': element.employee_UMPI,
//       'payorID': element.billingpayorID,
//       'totalAmountBIlled': element.totalAmountBIlled,
//       'claimStatus': element.claimStatus,
//       'service': element.serviceCode,
//       'serialNo': element.serialNo,
//       'buttoncolor': buttoncolor,
//       'color': element.color,
//       'bit': element.bit,
//       'validate': '',
//       'timesheetId':element.timesheetId
//     }
    
//     objArray.push(obj);

//     this.idsList= objArray;
    
//   });
// }

        // var i=0;
        // 
        // console.log(data.ids,"idslist");
        // parentArray.forEach(element => {
        //   if(element.color=="red")
        //   {
        //     this.idsList.pop(i);
        //     console.log(i,"i");
        //   }
        //   ++i;
        // });
       
        // console.log(this.idsList,"ids");
        
        return parentArray;
    }

    getserialNo(){
        return this.serialno;
    }
    getChildData(){
        return this.childData;

    }
  getDetails(){
      return this.details;
  }

  getErrorlist(){
    return this.errorlist;
}

getwholeData(){
  return this.originaldata;
}

getidsList(){
  return this.idsList;
}
}
