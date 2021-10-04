import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IsViewEditpayrate, PayRateUnit, ManagePayrate } from '../emloyee.model'
import { GlobalComponent } from '../../../global/global.component';
import { EmployeeService } from '../employee.service';
import { DateService } from '../../../date.service';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-pay-rates-edit',
  templateUrl: './pay-rates-edit.component.html',
  styleUrls: ['./pay-rates-edit.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayRatesEditComponent implements OnInit {
  @Input() payrateevntchange: IsViewEditpayrate;
  @Output() IsViewEditpayrate = new EventEmitter<IsViewEditpayrate>();
  payrate: any = new PayRateUnit();
  service: any;
  PayRateUnitList: any;
  RateUnitList: [{ Key: string, Value: string }]
  ManagepayrateArray: any;
  managepayratelist:any = new ManagePayrate();
  deleteid:number=0;
  //////////////////////////Date picker Options/////////////////////////////////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    // disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  constructor(public global: GlobalComponent, public employeeservice: EmployeeService, public dateservice: DateService,
    public toastrService: ToastrService, private ref: ChangeDetectorRef) {


      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
     }

  ngOnInit() {
    //console.log(this.payrateevntchange)
    if (this.payrateevntchange.payratetype == 'manage') {
      document.getElementById("openmanage").click();
      this.managepayratelist=new ManagePayrate();
      this.managepayratelist.id=0;
    

    }
    else if(this.payrateevntchange.payratetype == 'delete')
    {
      document.getElementById("deletepayratemodal").click();
      this.deleteid=this.payrateevntchange.payrateId;
    }
    else {

      //console.log(this.payrate)

      document.getElementById("modelopen").click();
    }
    if (this.payrateevntchange.payrateId != 0) {
      this.payrate = this.payrateevntchange.payrate.filter(p => p.id == this.payrateevntchange.payrateId)[0]
      this.payrate.managePayrateId=this.payrate.managePayrateId.toString()
      this.payrate.masterServiceId=this.payrate.masterServiceId.toString()
      this.payrate.startDate=  this.payrate.startDate
      //console.log( this.payrate)
    }
    else {
      this.payrate = new PayRateUnit()
      this.payrate.id = this.payrateevntchange.payrateId
    }
  
    this.getservice()
    this.getPayrateUnitLst()
    this.getmanagepayrateList()
    this.getmanagepayrate(this.payrateevntchange.employeeId);
  }
  ////////////////////////////////////////get service ////////////////////////////////////////////////////////////////
  getservice() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId)
    this.employeeservice.getpayorservice(params).subscribe((data: any) => {
      this.service = data;
      this.service.forEach(element => {
        element.Value = element.masterServiceCode.toString();
        element.Key = element.id.toString();
      });

    })
  }
  ////////////////////////////////////get pay rate unit List/////////////////////////////////////////////////////////
  getPayrateUnitLst() {
    this.employeeservice.getPayrateUnit().subscribe((data: any) => {
      data.forEach(element => {
        element.Key = element.Key.toString();
        element.Value = element.Value.toString();
      });
      this.RateUnitList = data
    })
  }
  /////////////////////////////////get manage payrate List///////////////////////////////////////////////////////
  getmanagepayrateList() {
    let params = new URLSearchParams();
    params.append("Code", "PAYRATEUNIT");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.employeeservice.getmanagepayrate(params).subscribe((data: any) => {
      this.PayRateUnitList = data;
      this.PayRateUnitList.forEach(element => {
        element.Key =  element.Key.toString();
      });
      this.managepayratelist.payarateLid=this.PayRateUnitList[0].Key
    })
  }

  ///////////////////////////////////Date Function//////////////////////////////////////////////////////////////////
  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'start') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.payrate.startDate = val1;
        }
      }


    }
    if (type == "datechagned") {
      if (name == 'start') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.payrate.startDate = val1;
        }
      }


    }
  }
  ////////////////////////////////save PayRates///////////////////////////////////////////////////////////////////
  savePayRate(save) {
    //console.log(save)
    let data = JSON.parse(JSON.stringify(save))
    data.masterServiceId = parseInt(data.masterServiceId.toString())
    data.startDate = data.startDate != null ? new Date(data.startDate + " " + "00:00:00" + " " + "GMT").toISOString() : null;
    data.managePayrateId = data.managePayrateId != null ? parseInt(data.managePayrateId.toString()) : null
    data.employeeId = this.payrateevntchange.employeeId
    //console.log(data);
    if (data.id == 0) {
      this.employeeservice.savePayorRate(data).subscribe((data: any) => {

        this.toastrService.success('Pay Rate Created successfully', 'Pay Rate Created');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        document.getElementById("modelopen").click();
        this.back()
      },
      (err:HttpErrorResponse)=>{
        this.toastrService.error(
          err.error,
          'Error');
      })
    }
    else {
      this.employeeservice.savePayorRate(data).subscribe((data: any) => {
        this.toastrService.success('Pay Rate Updated successfully', 'Pay Rate Updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        document.getElementById("modelopen").click();
        this.back()
      },
      (err:HttpErrorResponse)=>{
        this.toastrService.error(
          err.error,
          'Error');
      })
    }
  }
  //////////////////////////////////Back Funcion//////////////////////////////////////////////////////////////////
  back() {
    this.IsViewEditpayrate.emit({ isView: true, isEdit: false, isEditPayorrate: false, employeeId: this.payrateevntchange.employeeId, payrateId: 0, payrate: this.payrateevntchange.payrate, payratetype: '' })
  }
  //////////////////////////////////////save manage Payrates//////////////////////////////////////////////////////////
  saveMangePayRates(mangepayrate) {
    //console.log(mangepayrate)
    let manage=JSON.parse(JSON.stringify(mangepayrate));
  
    manage.payarateLid=parseInt( manage.payarateLid.toString())
    if(manage.id==0)
    {
    this.employeeservice.saveMangePayorRate(manage).subscribe((data:any)=>{
      this.toastrService.success('Manage Pay Rate Created successfully', 'Manage Pay Rate Created');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      document.getElementById("openmanage").click();
      this.back();
    },
    (err:HttpErrorResponse)=>{
      this.toastrService.error(
        err.error,
        'Error');
    })
   
  }
  else{
    this.employeeservice.saveMangePayorRate(manage).subscribe((data:any)=>{
      this.toastrService.success('Manage Pay Rate Updated successfully', ' Manage Pay Rate Updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      document.getElementById("openmanage").click();
      this.back();
    },
    (err:HttpErrorResponse)=>{
      this.toastrService.error(
        err.error,
        'Error');
    })
  }
  }
  //////////////////////////////get manage payrates////////////////////////////////////////////////////////////////
  getmanagepayrate(EmployeeId) {

    let url = "api/ManagePayrate/GetManagePayrateList?";
    let myparams = new URLSearchParams();
    myparams.append("EmployeeID", EmployeeId);

    this.employeeservice.getManagePayrateUnit(myparams).subscribe((data: any) => {

      this.ManagepayrateArray = data;

    })

  }
  ///////////////////////update payrate/////////////////////////////////////////////////////////////////////
  updateManagePayrateunits(managedata) {
    //console.log(managedata);
    this.managepayratelist = managedata;
    this.managepayratelist.payarateLid= this.managepayratelist.payarateLid.toString()
  }
  ///////////////////////////////new pay rate///////////////////////////////////////////////////////
  newmanage() {
    this.managepayratelist = new ManagePayrate();
    this.managepayratelist.id=0;
    this.managepayratelist.payarateLid=this.PayRateUnitList[0].Key
  }
  deletepayrae()
  {
    let params = new URLSearchParams();
    params.append("Id",this.deleteid.toString());
    this.employeeservice.deletepayrate(params).subscribe((data:any)=>{
      this.toastrService.success('Employee payrate Deleted successfully', 'payrate Deleted');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      this.back();
    },
    
    (err:HttpErrorResponse)=>{
      this.toastrService.error(
        err.error,
        'Error');
    })
  }
}
