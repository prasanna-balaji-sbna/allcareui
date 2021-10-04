import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EditSOCDetails, StartOfCareBO } from '../client-parent.model';
import { GlobalComponent } from 'src/app/global/global.component';
import { CommonHttpService } from 'src/app/common.service';
import { IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { ClientHttpService } from '../client-parent.service';
import { ToastrService } from 'ngx-toastr';
import { DateService } from 'src/app/date.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-startofcareedit',
  templateUrl: './startofcareedit.component.html',
  styleUrls: ['./startofcareedit.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartofcareeditComponent implements OnInit {
  //====================================get event=======================//
  @Input() DataFromSOC: EditSOCDetails = new EditSOCDetails();
  @Output() BacktoClientSOC = new EventEmitter<EditSOCDetails>();
  @Output() changevalue = new EventEmitter<EditSOCDetails>();
  //===========================================Date picker format======================//
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };
  //===============================start of care=================================//
  startOfCare: any = new StartOfCareBO();
  dischargeDateDisable: boolean = false;
  saveSOCErr:string=""
  //====================================key value=======================// 
  companyList: [{ Key: string, Value: string }];
  DCList: [{ Key: string, Value: string }];
  dischargelst:any=[];
  Dcvalue: string = "client"
  enabledischage: boolean = false;
  dischargeStatus: [{ Key: string, Value: string }];
  constructor(public global: GlobalComponent, public commonhttp: CommonHttpService, public date: DatePipe,public toastrService:ToastrService,
  public clientservice: ClientHttpService,  public dateservice: DateService,private ref: ChangeDetectorRef) {


    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
   }
  ngOnInit(): void {
    //console.log(this.DataFromSOC)
    if (this.DataFromSOC.clientId != 0) {
      this.startOfCare = this.DataFromSOC.clientSOCData;
      this.startOfCare.companyId = this.startOfCare.companyId.toString();
      this.startOfCare.startDate=new Date(this.startOfCare.startDate).toLocaleDateString()
      this.startOfCare.dischargeDate=  this.startOfCare.dischargeDate!=null?new Date( this.startOfCare.dischargeDate).toLocaleDateString():null;
      this.startOfCare.dischargeLid = this.startOfCare.dischargeLid!=null? this.startOfCare.dischargeLid.toString():null
      if (this.startOfCare.dischargeStatus == "Yes") {
        this.dischargeDateDisable = true;
      }
   
      this.startOfCare.dischargeCodeDetailId = this.startOfCare.dischargeCodeDetailId != null ? this.startOfCare.dischargeCodeDetailId.toString() : null;
     //console.log(this.startOfCare)
    }

   //console.log(this.DataFromSOC.clientSOCData)
    if(this.DataFromSOC.type!="delete")
    {
      document.getElementById("modelopensoc").click();
    }
    else
    {
      document.getElementById("delete").click();
    }
  
    // if(this.global.globalAgencyId!=0){
    this.getCompanyList();
    this.getDCList();
    this.getYESNO();
    this.getdischargeLst();
    // }
  }
  //======================================ng on changes===================//
  ngOnChanges() {
    // debugger;
   //console.log("data from soc", this.DataFromSOC);
    this.startOfCare.description;


  }
  //=========================================getcompany list=============================//
  getCompanyList() {
    let myParams = new URLSearchParams();
    // myParams.append("agencyId", this.global.globalAgencyId);
    myParams.append("agencyId", this.global.globalAgencyId);
    this.commonhttp.getCompany(myParams).subscribe((data: any = []) => {
      this.companyList = data;
      data.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();
      })
     //console.log("company", this.companyList)
    })
  }
  //=========================================get dc list=============================//
  getDCList() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    // params.append("agencyId", "1");
    this.commonhttp.getDC(params).subscribe((data: any = []) => {
      this.DCList = data;
      this.DCList.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();
      })
    })
  }
  //========================================get Lov drop down==========================//
  getYESNO() {
    let params = new URLSearchParams();
    params.append("Code", "YESORNO");
    params.append("agencyId", this.global.globalAgencyId);
    // params.append("agencyId", "1");
    params.append("userId", this.global.userID);
    this.commonhttp.getStatus(params).subscribe((data: any) => {
      this.dischargeStatus = data;
      this.dischargeStatus.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();
      })
    })
  }
  //=======================================Reset dialog=============================//
  Closedialog() {
    document.getElementById("modelopensoc").click();
    this.BacktoClientSOC.emit(new EditSOCDetails);
  }
  Closedcdialog() {
    document.getElementById("dischargeopen").click();

  }
  closedelete()
  {
    document.getElementById("delete").click();
    this.BacktoClientSOC.emit(new EditSOCDetails);
  }
  opendischarge() {
    this.enabledischage = true;
    document.getElementById("dischargeopen").click();



  }
  datchange(value) {
    document.getElementById("dischargeopen").click();
   //console.log(value)
    this.getDCList();
    this.startOfCare.description = value.description;
    this.enabledischage = false;
    this.startOfCare.dischargeCodeDetailId = value.code.toString()

  }
  getDischargeValue(checkData) {

    if (checkData == "Yes") {
      this.dischargeDateDisable = true;
    }
    else {
      this.dischargeDateDisable = false;
    }
  }

  //===============================save SOC=============================================================//
   saveSOCRecord(val) {

let data=JSON.parse(JSON.stringify(val))
console.log(data)
if( data.dischargeDate!=null&& data.dischargeDate!=undefined)
{
  if(new Date( data.startDate).getTime()>new Date( data.dischargeDate).getTime())
  {
    this.saveSOCErr="End Date Should greater than Start Date";
  return
  }
  
}



       data.dischargeLid=data.dischargeLid!=null?parseInt(data.dischargeLid):null;
       data.companyId=data.companyId!=null?parseInt(data.companyId):null;
       data.dischargeCodeDetailId=data.dischargeCodeDetailId!=null?parseInt(data.dischargeCodeDetailId):null;
     data.clientId=this.global.clientId
    //console.log(this.global.clientId)
       data.startDate=data.startDate!=null?new Date(new Date(data.startDate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT"):null;
      // data.dischargeDate=data.dischargeDate!=null?data.dischargeDate:null;
       data.dischargeDate=data.dischargeDate!=null?new Date(new Date(data.dischargeDate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT"):null;
console.log(data)
if(data.id!=0)
{


     this.clientservice.saveStartOfCare(data).subscribe((data: any) => {

      
     
        this.toastrService.success(
           'Start of Care Updated Successfully',
           'Start of Care Updated');
           this.Closedialog();

       },
       (err:HttpErrorResponse) => {

        this.saveSOCErr= err.error;
       });
     }
    
    else
    {
      this.clientservice.saveStartOfCare(data).subscribe((data: any) => {

      
     
        this.toastrService.success(
           'Start of Care Created Successfully',
           'Start of Care Created');
           this.Closedialog();
       },
         (err:HttpErrorResponse) => {

          this.saveSOCErr= err.error;
         });
    }
  }

  newdates(event, type, name) {
   //console.log(type)
   //console.log(name);
    
    if (type == "inputchage") {
      if (name == 'dischargeDate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.startOfCare.dischargeDate = val1;

        }
      }
      if (name == 'startDate') {
        let val = this.dateservice.inputFeildchange(event);
       //console.log(val);
        
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
         //console.log(val1);
          this.startOfCare.startDate = val1;
         
        }
      }
    }
    if (type == "datechagned") {
      if (name == 'dischargeDate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.startOfCare.dischargeDate = val1;
        
        }
      }
      if (name == 'startDate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.startOfCare.startDate = val1;
         
        }
      }
    
    }
  }
  deleteSOC()
  {
    
    let param=new URLSearchParams()
    param.append("Id", this.startOfCare.id.toString())
    this.clientservice.deleteStartOfCare(param).subscribe((data:any)=>{
      this.toastrService.success(
        'Start of Care Deleted Successfully',
        'Start of Care Deleted');
        this.closedelete();
      // this.back();
    },
    (err:HttpErrorResponse)=>{
      this.toastrService.error(
        err.error,
        'Error');
    })
  }
  getdischargeLst()
  {
    let params = new URLSearchParams();
    params.append("agency", this.global.globalAgencyId);
    this.clientservice.getDischargedata(params).subscribe((data:any)=>{
      this.dischargelst=data;
    });
  }
  getDcCode(data)
  {
   //console.log(data)
if(data!=null&&data!=undefined&&data!="")
{
  this.startOfCare.description=this.dischargelst.filter(d=>d.id==parseInt(data.toString()))[0].codeDescription
}
    
  }
}
