import { Component, OnInit, Input ,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,SimpleChanges} from '@angular/core';
import { EditDetailsAuthorization, ClientAuthorizationBO, functionpermission } from '../client-parent.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClientHttpService } from '../client-parent.service';
import { GlobalComponent } from 'src/app/global/global.component';
import { IMyDateModel, IMyInputFieldChanged, IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpService } from 'src/app/common.service';

@Component({
  selector: 'app-client-authorization-edit',
  templateUrl: './client-authorization-edit.component.html',
  styleUrls: ['./client-authorization-edit.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientAuthorizationEditComponent implements OnInit {
fp:functionpermission
  @Input() DataFromAuthorizationList: EditDetailsAuthorization = new EditDetailsAuthorization();
  @Output() EventToEditAuth=new EventEmitter< EditDetailsAuthorization>();
//==================================Date pciker options=============================//
today = new Date();
public myDatePickerOptions: IMyDpOptions = {
  dateFormat: 'mm/dd/yyyy',
  showClearDateBtn: false,
  editableDateField: true
};
public myDatePickerOptionsDOB: IMyDpOptions = {
  dateFormat: 'mm/dd/yyyy',
  disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
  showClearDateBtn: false,
  editableDateField: true
};
  //=====================================Add list===============================//  
  serviceinbox: any = [];
  serviceObjList: any = {};
  updateAuthList:any=new ClientAuthorizationBO();
  getErr_count: string = '';
  grouppayor_serviceDescription: any = [];
  billingvalue: number = 0;
  saveAuthErr:string="";
  grouppayorServiceArray:[{Key:number,Value:string}];
  grouppayorServiceArray1:[{Key:number,Value:string}];
  payorList: [{Key:string,Value:string}];
  //=================================Boolean initial===============================//
  loadingAuthadd:boolean=false;
  loadingAuthupdate:boolean=false;
  constructor(public http:ClientHttpService,public global:GlobalComponent,public toastrService:ToastrService,private ref: ChangeDetectorRef) { 

    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
  }

  ngOnInit(): void {
  // //console.log(this.DataFromAuthorizationList);
   
    if(this.DataFromAuthorizationList.type=='edit')
     {
      
    //console.log(this.updateAuthList)
     let value:any = this.DataFromAuthorizationList.AuthorizationData;
    //console.log(value,"cvalue=====");
    //console.log(this.DataFromAuthorizationList.AuthorizationData,"auth=====");
     
      this.updateAuthList=this.DataFromAuthorizationList.AuthorizationData
    //console.log(this.updateAuthList)
    //console.log(this.updateAuthList.id,"companyId")
    //console.log(this.updateAuthList.startDate,"companyId")

      this.updateAuthList.startDate=new Date( this.updateAuthList.startDate).toLocaleDateString();
      this.updateAuthList.endDate=new Date( this.updateAuthList.endDate).toLocaleDateString();
    
      this.updateAuthList.groupPayorId=this.updateAuthList.groupPayorId;
      this.updateAuthList.companyId=this.updateAuthList.companyId.toString();
      this.grouppayorService( this.updateAuthList,false);
      this.getbillingValue(this.updateAuthList)
      this.updateAuthList.groupPayorServiceId= this.updateAuthList.groupPayorServiceId.toString()
      // setTimeout(() => {
      //   this.calculatetotalhour1(this.updateAuthList.startDate, this.updateAuthList.endDate, this.updateAuthList.totalUnits,this.updateAuthList.billingvalue)
      // }, 2000);
      document.getElementById("editmodelopen").click();
     } 
     if(this.DataFromAuthorizationList.type=='new')
     {
      this.global.clientId=this.DataFromAuthorizationList.ClientId
     //console.log(  this.global.clientId)
      document.getElementById("modelopen").click();

     }    
     if(this.DataFromAuthorizationList.type=='delete')
     {
      document.getElementById("deletemodal").click();
     } 
 

    if(this.global.globalAgencyId!=0){
      this.getCompanyList();
      this.getPayorList();  
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
    console.log(f);
    this.saveAuthErr = ""
    this.serviceObjList = {};
    this.serviceinbox = [];
    this.global.clientId=this.DataFromAuthorizationList.ClientId
   //console.log(  this.global.clientId)
    this.addService();
  
    
   //console.log("Incoming edit", this.DataFromAuthorizationList);
    
  }

  //================================Add service===============================//

  addService() {

    this.serviceObjList = {
      id: 0,
      clientId: this.global.clientId,
      startDate: null,
      endDate: null,
      companyId: null,
      isAdd: true,
      groupPayorId: null,
      insuranceNo: null,
      serviceAgreementNo: null,
      groupPayorServiceId: null,
      serviceDescription: null,
      totalUnits: null,
      unitsUsed: null,
      unitsRemaining: null,
      billingvalue:null,
      grouppayorServiceArray:[]
    }
    this.serviceinbox.push(this.serviceObjList);
  }





  addSer(i, serviceList:ClientAuthorizationBO) {
    if (i >= 0) {
      this.serviceinbox[i].isAdd = false;
    }
    this.serviceObjList = {
      id: 0,
      clientId: this.global.clientId,
      startDate: serviceList.startDate,
      endDate: serviceList.endDate,
      isAdd: true,
      companyId: serviceList.companyId != null ? serviceList.companyId.toString() : null,
      groupPayorId: serviceList.groupPayorId != null ? serviceList.groupPayorId.toString() : null,
      insuranceNo: serviceList.insuranceNo,
      serviceAgreementNo: serviceList.serviceAgreementNo,
      groupPayorServiceId: null,
      serviceDescription: null,
      totalUnits: null,
      unitsUsed: null,
      unitsRemaining: null,
      billingvalue:null,
      grouppayorServiceArray:[]
    }
    this.serviceinbox.push(this.serviceObjList);
    if(serviceList.groupPayorId != null ){
      this.grouppayorService(serviceList,false);
    }
    
  }


    ///////////////////////remove added list in auth////////////////
    removeList(i) {
      this.serviceinbox.splice(i, 1);
      var length = this.serviceinbox.length;
      var count = 0;
      this.serviceinbox.forEach(element => {
        if (element.isAdd == false) {
          count++;
        }
      })
      if (length == count) {
        this.serviceinbox[length - 1].isAdd = true;
      }
    }


      ///////////////////////////total hours per day /////////////////////////////////////////
  calculatetotalhour(start, end, unit, i,billingvalue) {

    if (start != null && end != null && unit != null) {
      let diffDays = (Math.round(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))) + 1;
      let units = unit / diffDays;
      let val = (units / billingvalue).toFixed(2).toString();
      console.log(val)
      let val2 = val.split('.');
      if (val2.length == 1) {
        this.serviceinbox[i].unitperday = val2[0] + " hr " + "0 Min";
      }
      else {
        let vals2 = 0 + "." + val2[val2.length - 1];
        this.serviceinbox[i].unitperday = val2[0] + " hr " + (parseFloat(vals2)*60).toString().split('.')[0] + "Min";;
        // if (parseFloat(vals2) < 0.25) {
        //   this.serviceinbox[i].unitperday = val2[0] + " hr " + "0 Min";
        // } else if (parseFloat(vals2) < 0.50) {
        //   this.serviceinbox[i].unitperday = val2[0] + " hr " + "15 Min";
        // } else if (parseFloat(vals2) < 0.75) {
        //   this.serviceinbox[i].unitperday = val2[0] + " hr " + "30 Min";
        // } else if (parseFloat(vals2) >= 0.75) {
        //   this.serviceinbox[i].unitperday = val2[0] + " hr " + "45 Min";
        // }

      }

    }
  }
//====================================Service code update================================//
  serviceCodeUpdate(index, value) {
   //console.log(value);
   //console.log(this.grouppayorServiceArray)
    if (value != "" && value != undefined && value != null) {
      let params = new URLSearchParams();
      params.append("Id", value.toString());

      this.http.getServiceDescription( params).subscribe((data: any) => {
       //console.log(data)
        if (index == -1) {
          this.updateAuthList.serviceDescription = data[0];
        }
        else {
          this.serviceinbox[index].serviceDescription = data[0];

        }

      });
  }
    else {
      this.serviceinbox[index].serviceDescription = null;
    }

  }

  //========================================get billing value============================//
  getbillingValue(id) {
    if (id != undefined) {
      let params = new URLSearchParams();
      params.append("grouppayor", id.groupPayorServiceId.toString());
      params.append("agencyId", this.global.globalAgencyId)
      this.http.getbillingvalue(params).subscribe((data: any) => {
       //console.log(data);
        id.billingvalue = data;
        if (id.billingvalue == 0) {
          id.billingvalue = 0;
          this.saveAuthErr = "There is no Billing Unit "

        }
        else
        {
          if(this.updateAuthList.totalUnits!=null&&this.updateAuthList.totalUnits!=undefined&&this.updateAuthList.totalUnits!=''&&this.updateAuthList.totalUnits!="")
          {
            this.calculatetotalhour1(this.updateAuthList.startDate, this.updateAuthList.endDate, this.updateAuthList.totalUnits,this.updateAuthList.billingvalue)
          }
         
        }
      }, (err: HttpErrorResponse) => {
        if (err.error.errors) {
          this.getErr_count = JSON.stringify(err.error.errors);
        }
        else {
          this.getErr_count = JSON.stringify(err.error);

        } if (this.getErr_count != "") {
          setTimeout(() => {
            this.getErr_count = "";
          }, 8000)
        }

      })

    }
    else { this.billingvalue = 0 }
  }


  //================================get group payor service=======================//
  grouppayorService(id,data:boolean) {
   //console.log(id)

    if (id.groupPayorId != undefined&&id.groupPayorId!=null) {
      let params = new URLSearchParams();
      params.append("payorId", id.groupPayorId.toString());
      params.append("agencyId", this.global.globalAgencyId)
      this.http.getgrouppayorservice( params).subscribe((data: any) => {
        data.forEach(element => {
          element.label = element.Value;
          element.value = element.Key.toString();
        })
        if(data==true)
        {
          id.groupPayorServiceId=null;
        }
        id.grouppayorServiceArray=null;
        id.grouppayorServiceArray= data;
     //  
        this.grouppayorServiceArray1=null;
        this.grouppayorServiceArray1=data;
        

      }, (err: HttpErrorResponse) => {
        id.grouppayorServiceArray = null;  id.groupPayorServiceId=null;id.serviceDescription=null
        if (err.error.errors) {
          this.getErr_count = JSON.stringify(err.error.errors);
        }
        else {
          this.getErr_count = JSON.stringify(err.error);

        } if (this.getErr_count != "") {
          setTimeout(() => {
            this.getErr_count = "";
          }, 8000)
        }

      })

    }
    else { id.grouppayorServiceArray = null;  id.groupPayorServiceId=null;id.serviceDescription=null}


  }

  //================================get payor list=============================//
  
  getPayorList() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.http.getPayorDropDown(params).subscribe((data: any = []) => {

      this.payorList = data;
    },
      err => {

      })
  }
//=====================================change date===========================//

onDateChangedCareAUTHEND(i, event: IMyDateModel) {
  this.serviceinbox[i].endDate = event.formatted;

}


CareAUTHENDDatechange(i, event: IMyInputFieldChanged) {
  let value = event.value;

  if (value.length == 5 && value.substring(2, 3) != '/') {

    this.serviceinbox[i].endDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  }
}

onDateChangedCareAUTHStart(i, event: IMyDateModel) {
  this.serviceinbox[i].startDate = event.formatted;

}


CareAUTHStartDatechange(i, event: IMyInputFieldChanged) {
  let value = event.value;

  if (value.length == 5 && value.substring(2, 3) != '/') {

    this.serviceinbox[i].startDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  }
}
onDateChangedCareUpdateAUTHStart(event: IMyDateModel) {
  
  this.updateAuthList.startDate = event.formatted;

}
UpdateAUTHStartDatechange(event: IMyInputFieldChanged) {
 
  let value = event.value;
  if (value.length == 5 && value.substring(2, 3) != '/') {

    this.updateAuthList.startDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  }
}
onDateChangedUpdateAUTHENd(event: IMyDateModel) {
 
  this.updateAuthList.endDate = event.formatted;

}
UpdateAUTHENDchange(event: IMyInputFieldChanged) {
 
  let value = event.value;

  if (value.length == 5 && value.substring(2, 3) != '/') {

    this.updateAuthList.endDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  }
}
//=========================================getcompany list=============================//
companyList: any = [];
getCompanyList() {
  let myParams = new URLSearchParams();
  myParams.append("agencyId", this.global.globalAgencyId);
  this.http.getCompany(myParams).subscribe((data: any = []) => {
    this.companyList = data;
    this.companyList.forEach(element => {
      element.label = element.Value;
      element.value = element.Key.toString();
    })
  },
    err => {

    })
}

//==========================================Close dialog=============================//
Closedialog(){
  document.getElementById("modelopen").click();
  this.DataFromAuthorizationList=new EditDetailsAuthorization();
}

//===============================Save Authorization=====================================//
checkValidation(authList: any = []) {
  this.loadingAuthadd=true;
 //console.log(authList)
      this.saveAuthErr == ""
      authList.forEach(element => {
        if (this.saveAuthErr == "") {
          if (element.startDate == null) {
             this.loadingAuthadd=false;  
            this.saveAuthErr = "Please select start date to proceed";
          }
          else if (element.endDate == null) {
            this.loadingAuthadd=false;  
            this.saveAuthErr = "Please select end date to proceed";
          }
          else if (element.groupPayorServiceId == null) {
            this.loadingAuthadd=false;  
            this.saveAuthErr = "Please select service to proceed";
          }
          else if (element.totalUnits == null) {
           this.loadingAuthadd=false;  
            this.saveAuthErr = "Please enter total units to proceed";
          }
          else if (new Date(element.startDate).getTime() > new Date(element.endDate).getTime()) {
           this.loadingAuthadd=false;  
            element.unitperday = " ";
            this.saveAuthErr = "End date must be larger than start date";  
          }
          else if (element.insuranceNo == null) {
           this.loadingAuthadd=false;  
            this.saveAuthErr = "Please enter insurance number to proceed";  
          }
        }  
      });
      if (this.saveAuthErr == "") {
        this.saveClientAuth(authList);
      }
    }


  /////////////////////////////////////////save client Authorization////////////////////////////////////////
   saveClientAuth(authList) {
      let val = JSON.parse(JSON.stringify(authList));
//console.log(authList,"authList=======");
 
       val.forEach(element => {
    
        element.clientId = parseInt(element.clientId.toString());
             element.startDate = element.startDate != null ? new Date(new Date(element.startDate).toLocaleDateString() + " " + "00:00:00"+" " +"GMT"): "";
              element.endDate = element.endDate != null ? new Date(new Date(element.endDate).toLocaleDateString() + " " + "00:00:00"+" "  +"GMT") : "";
              element.serviceDescription = element.serviceDescription;
              element.companyId = element.companyId != null ? parseInt(element.companyId.toString()) : null;
       element.groupPayorId = element.groupPayorId != null ? parseInt(element.groupPayorId.toString()) : null;
        element.groupPayorServiceId = element.groupPayorServiceId != null ? parseInt(element.groupPayorServiceId.toString()) : null;
        element.totalUnits = element.totalUnits != null ? parseInt(element.totalUnits.toString()) : null;
        element.serviceAgreementNo = element.serviceAgreementNo;
         element.insuranceNo = element.insuranceNo;  
       
       });
  
      this.http.saveauthorization(val).subscribe((data: any = []) => {
  
        this.toastrService.success('Client Authorization Created successfully', 'Client Authorization Created');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        document.getElementById("modelopen").click();
        this.back();
      },
      (err:HttpErrorResponse)=>{
        this.saveAuthErr=err.error
      });
  
  
  
    }
//////////////////////////////////////////update Client Authorization//////////////////////////////////////////////////

updateClientAuth(authList) {
  if (new Date(authList.startDate).getTime() > new Date(authList.endDate).getTime()) {
    this.loadingAuthadd=false;  
    authList.unitperday = " ";
     this.saveAuthErr = "End date must be larger than start date";  
     return
   }
  let val = JSON.parse(JSON.stringify(authList));

 
    val.id=val.id
    val.clientId = parseInt(val.clientId.toString().toString());
         val.startDate = val.startDate != null ? new Date(new Date(val.startDate).toLocaleDateString() + " " + "00:00:00"+" " +"GMT"): "";
          val.endDate = val.endDate != null ? new Date(new Date(val.endDate).toLocaleDateString() + " " + "00:00:00"+" "  +"GMT") : "";
          val.serviceDescription = val.serviceDescription;
          val.companyId = val.companyId != null ? parseInt(val.companyId.toString()) : null;
   val.groupPayorId = val.groupPayorId != null ? parseInt(val.groupPayorId.toString()) : null;
    val.groupPayorServiceId = val.groupPayorServiceId != null ? parseInt(val.groupPayorServiceId.toString()) : null;
    val.totalUnits = val.totalUnits != null ? parseInt(val.totalUnits.toString()) : null;
    val.serviceAgreementNo = val.serviceAgreementNo;
     val.insuranceNo = val.insuranceNo;  
   
  

  this.http.updateeAuthorizationData(val).subscribe((data: any = []) => {
    this.toastrService.success('Client Authorization Updated successfully', 'Client Authorization Updated');
    setTimeout(() => {
      this.toastrService.clear();
    }, 8000);
    document.getElementById("editmodelopen").click();
  this.back();
  },
  (err:HttpErrorResponse)=>{
    this.saveAuthErr=err.error
  });



}

//////////////////////////////////////Back function///////////////////////////////////////////////////////////////////////
    back()
    {
      this.EventToEditAuth.emit({ isView:true,
        isEdit:false,
        isEditAuthorization:false,
        AuthorizationId:0,
        
        AuthorizationData:this.DataFromAuthorizationList.AuthorizationData,
        ClientId:this.global.clientId,
      type:''})
    }
    //////////////////////////////caluclate hours////////////////////////////////////////////////////////
    calculatetotalhour1(start, end, unit,billingvalue) {

      if (start != null && end != null && unit != null) {
        if (billingvalue != 0) {
          let diffDays = (Math.round(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))) + 1;
          let units = unit / diffDays;
          let val = (units / billingvalue).toFixed(2).toString();
          let val2 = val.split('.');
          if (val2.length == 1) {
            this.updateAuthList.totalUnitsperday = val2[0] + " hr " + "0 Min";
          }
          else {
            let vals2 = 0 + "." + val2[val2.length - 1];
            this.updateAuthList.totalUnitsperday = val2[0] + " hr " + (parseFloat(vals2)*60).toString().split('.')[0] + "Min";
            // if (parseFloat(vals2) < 0.25) {
            //   this.updateAuthList.totalUnitsperday = val2[0] + " hr " + "0 Min";
            // } else if (parseFloat(vals2) < 0.50) {
            //   this.updateAuthList.totalUnitsperday = val2[0] + " hr " + "15 Min";
            // } else if (parseFloat(vals2) < 0.75) {
            //   this.updateAuthList.totalUnitsperday = val2[0] + " hr " + "30 Min";
            // } else if (parseFloat(vals2) >= 0.75) {
            //   this.updateAuthList.totalUnitsperday = val2[0] + " hr " + "45 Min";
            // }
  
          }
        }
        else {
          this.updateAuthList.totalUnitsperday = "0" + " hr " + "0 Min";
        }
  
        //this.serviceinbox[i].unitperday=(units/4).toFixed(2);
  
      }
    }
    ///////////////////////delete Authorization//////////////////////////////////////////////////////////////
    deleteAuth()
    {
      let params = new URLSearchParams();
      params.append("Id", this.DataFromAuthorizationList.AuthorizationId.toString());
      this.http.deleteAuthdata(params).subscribe((data: any) => {
    //    document.getElementById("deletemodal").click();
        this.toastrService.success('Client Authorization Deleted successfully', 'Client Authorization Deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        
        this.back();
      });
    }
    cleardata(i)
    {
      console.log(i,(this.serviceinbox.length-1))
      console.log( JSON.parse(    JSON.stringify(  this.serviceinbox[i])))
      this.serviceObjList = {
        id: 0,
        clientId: this.global.clientId,
        startDate: null,
        endDate: null,
        companyId: null,
        isAdd: false,
        groupPayorId: null,
        insuranceNo: null,
        serviceAgreementNo: null,
        groupPayorServiceId: null,
        serviceDescription: null,
        totalUnits: null,
        unitsUsed: null,
        unitsRemaining: null,
        billingvalue:null,
        grouppayorServiceArray:[]
      }
     
     
      this.serviceinbox[i]= this.serviceObjList;
      if (i >= 0) {
        this.serviceinbox[i].isAdd = false;
      
      if(i== (this.serviceinbox.length-1))
      {
        this.serviceinbox[i].isAdd = true;
      }
    }
      console.log(this.serviceinbox[i])
    }
    allowonlynum(e)
    {
      if (
        // Allow: navigation keys: backspace, delete, arrows etc.
        (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
        (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
        (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
        (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
        (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
        (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
        (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
        (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
      ) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    }
}