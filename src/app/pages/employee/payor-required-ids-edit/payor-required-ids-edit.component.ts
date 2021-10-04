import { Component, OnInit, Input ,ViewChild,TemplateRef,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges} from '@angular/core';
import { IsViewEditpayorequired, PayorRequiredID } from '../emloyee.model';
import { DateService } from '../../../date.service';
import { IMyDpOptions } from 'mydatepicker';
import{GlobalComponent} from '../../../global/global.component';
import{EmployeeService} from '../employee.service'
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payor-required-ids-edit',
  templateUrl: './payor-required-ids-edit.component.html',
  styleUrls: ['./payor-required-ids-edit.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayorRequiredIdsEditComponent  implements OnInit{
  @Input() payoRequiredViewEditdata: IsViewEditpayorequired;
  @Output() IsViewEditpayorequired=  new EventEmitter<IsViewEditpayorequired>();
  PayorRequired: PayorRequiredID =new PayorRequiredID();
  PayorRequiredLst: PayorRequiredID[];
  closeResult: string;
  GroupLst:[{Key:number,Value:string}]
  deleteid:number=0;
  //////////////////////////Date picker Options/////////////////////////////////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
  //  disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  constructor(public dateservice: DateService,public global:GlobalComponent,public Employeeservice:EmployeeService,public toastrService:ToastrService,
    private ref: ChangeDetectorRef) 
  { 

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 100);
  }
  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
    console.log(f);

   
  }

  ngOnInit() {
    
 
   //console.log(this.payoRequiredViewEditdata);
   if(this.payoRequiredViewEditdata.payorRequiredId!=0)
   {
     if(this.payoRequiredViewEditdata.payorActiotype=='edit')
     {
    this.PayorRequired=this.payoRequiredViewEditdata.payorRequired.filter(p=>p.id==this.payoRequiredViewEditdata.payorRequiredId)[0];
    document.getElementById("modelopen").click();
     }
     else
     {
      this.deleteid=this.payoRequiredViewEditdata.payorRequiredId
      document.getElementById("deletemodal").click();
     }
     
   }
   else
   {
    this.PayorRequired.id=0;
    document.getElementById("modelopen").click();
   }
   
   this.getpayor();
  //   modal.style.display = "block";
  }
  getpayor()
  {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.Employeeservice.getpayor(params).subscribe((data:[{Key:number,Value:string}])=>{
      this.GroupLst=data;
    })
  }
   back() {
      this.IsViewEditpayorequired.emit({isView: true, isEdit: false,isEditPayorRequired:false,employeeId:this.payoRequiredViewEditdata.employeeId,payorRequiredId:0,payorRequired:this.payoRequiredViewEditdata.payorRequired,payorActiotype:''  })
   }

  //////////////////////////////////Date function/////////////////////////////////////////////////////////////////////
  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'start') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.PayorRequired.startDate = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.PayorRequired.endDate = val1;
        }
      }
      if (name == 'fax') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.PayorRequired.faxDate = val1;
        }
      }

    }
    if (type == "datechagned") {
      if (name == 'start') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.PayorRequired.startDate = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.PayorRequired.endDate = val1;
        }
      }
      if (name == 'fax') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.PayorRequired.faxDate = val1;
        }
      }

    }
  }
savePayorRequired(val)
{
  let savevalue = JSON.parse(JSON.stringify(val))
  if(savevalue.startDate!=null&&savevalue.endDate)
  {
  if(new Date(savevalue.startDate).getTime()>new Date(savevalue.endDate).getTime())
  {
    this.toastrService.error('End date shold greater than start date', 'Warning');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      return
  }
}
  
  if(savevalue.id==0||savevalue.id==null)
  {
    savevalue.id==0;
    savevalue.employeeId=this.payoRequiredViewEditdata.employeeId;
  }
  savevalue.startDate= savevalue.startDate!=null?new Date(savevalue.startDate + " " + "00:00:00" + " " + "GMT").toISOString():null;
  savevalue.endDate= savevalue.endDate!=null?new Date(savevalue.endDate + " " + "00:00:00" + " " + "GMT").toISOString():null;
  savevalue.faxDate= savevalue.faxDate!=null?new Date(savevalue.faxDate + " " + "00:00:00" + " " + "GMT").toISOString():null;
  savevalue.groupPayorId=parseInt( savevalue.groupPayorId.toString())
  if(  this.PayorRequired.id==0)
  {
  this.Employeeservice.savePayorRequired( savevalue).subscribe((data:number)=>
  {
    document.getElementById("modelopen").click();
  
    this.toastrService.success('Employee PayorRequiredId Created successfully', 'PayorRequiredId Created');
    setTimeout(() => {
      this.toastrService.clear();
    }, 8000);
    this.back()
   },
    
    (err:HttpErrorResponse)=>{
      this.toastrService.error(
        err.error,
        'Error');
    })
  }
   if(  this.PayorRequired.id!=0)
   {
    this.Employeeservice.savePayorRequired( savevalue).subscribe((data:number)=>
    {
      document.getElementById("modelopen").click();
    
    this.toastrService.success('Employee PayorRequiredId Updated successfully', 'PayorRequiredId Updated');
    setTimeout(() => {
      this.toastrService.clear();
    }, 8000);
   
    this.back();
  },(err:HttpErrorResponse)=>{
    this.toastrService.error(
      err.error,
      'Error');
  });
}
}
///////////////////////////////////////////delete payor///////////////////////////////////////////////////////
deletepayor()
{
  let params = new URLSearchParams();
  params.append("Id",this.deleteid.toString());
  this.Employeeservice.deletepayorReqiured(params).subscribe((data:any)=>{
    this.toastrService.success('Employee PayorRequiredId Deleted successfully', 'PayorRequiredId Deleted');
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
