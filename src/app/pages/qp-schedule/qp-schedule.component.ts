import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { QPService } from './qp-schedule.service';
import { GlobalComponent } from 'src/app/global/global.component';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateService } from 'src/app/date.service';

@Component({
  selector: 'app-qp-schedule',
  templateUrl: './qp-schedule.component.html',
  styleUrls: ['./qp-schedule.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class QPScheduleComponent implements OnInit {
/////////////////// Var fot Qp ////////////////////////////////////////////////////
Employee:any;
QPService:any;
public QPEmployeeDropDown: any = [];
public QPserviceList: any = [];
public ClinetDropDown: any = [];
QPForm:FormGroup
qpadd: any = [];
QPList: any = {};
AddedQP:boolean=false
loadingQpadd:boolean=false;
saveQPErr:string="";
isQpP:boolean=false;
isSer:boolean=false
isDate:boolean=false
isHours:boolean=false
///////////////////////////////Date Piker intialization////////////////////////////////////////////////////////////////
public myDatePickerOptions: IMyDpOptions = {
  dateFormat: 'mm/dd/yyyy',
  disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
  showClearDateBtn: false,
  editableDateField: true
};
//==================================Constructor=======================================//
constructor(public qpService:QPService,public dateservice: DateService,public global:GlobalComponent,private router:Router,private formBuilder: FormBuilder, private ref: ChangeDetectorRef) {
  ref.detach();
  setInterval(() => {
    this.ref.detectChanges();
  }, 10);
  this.QPForm = this.formBuilder.group({    
    client:'',
    services: ['', Validators.required],
    date: ['', Validators.required],
    hours: ['', Validators.required],
  })

 }
  ngOnInit(): void {
    this.getEmployeeDropDown()
    this.getService();
    this.addService();
    this.getClient()
  }
//======================================Get QP Employee Dropdown=========================//  
getEmployeeDropDown() {
  let params = new URLSearchParams();
  params.append("agencyId", this.global.globalAgencyId);
  this.qpService.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) =>
  {
  this.QPEmployeeDropDown = data;
  console.log(this.QPEmployeeDropDown);
  this.QPEmployeeDropDown.forEach(element => {
  element.Key = element.Key.toString();
  })
  }); 
  }
//=================================Close QP schedule Page ===================================//
closeQp(){this.router.navigateByUrl("/qptimesheet");}
//=================================Service dropdown==========================================//
getService() {
  let params = new URLSearchParams();
  console.log("agencyId", this.global.globalAgencyId);
  params.append("agencyId", this.global.globalAgencyId)
  this.qpService.getservice(params).subscribe((data: any) => {
    data.forEach(element => {
      element.Key = element.Key.toString()
    });
    this.QPserviceList = data;
    console.log(this.QPserviceList)
  });
}
//================================ on changes =================================================//
ngOnChanges() {

  this.QPList = {};
  this.qpadd = [];
  console.log(this.global.clientId)
  this.addService();

  
}
//================================ Add QP =====================================================//
addService() {

  this.QPList = {
    id: 0,
    client:'',
    services:'',
    date:'',
    hours:'',
    isAddQP:true

  }
  this.qpadd.push(this.QPList);
  console.log('this.qpadd',this.qpadd);
  
}
addQP(i) {
  if (i >= 0) {
    this.qpadd[i].isAddQP = false;
  }
  this.QPList = {
    id: 0,
    client:'',
    services:'',
    date:'',
    hours:'',
    isAddQP:true
   
  }
  this.qpadd.push(this.QPList);
 
}
//========================================= Remove QP =======================================//
removeList(i) {
  this.qpadd.splice(i, 1);
  var length = this.qpadd.length;
  var count = 0;
  this.qpadd.forEach(element => {
    if (element.isAdd == false) {
      count++;
    }
  })
  if (length == count) {
    this.qpadd[length - 1].isAdd = true;
  }
}
//=============================================== validation ====================================//
checkValidation(authList: any = []) {
  this.loadingQpadd=true;
  console.log(authList)
      this.saveQPErr == ""
      authList.forEach(element => {
        if (this.saveQPErr == "") {
          if (element.client == null || element.client == '') {
             this.loadingQpadd=false; 
             this.isQpP=true 
            this.saveQPErr = "Please Enter All details to proceed";
          }
          else if (element.services == null  || element.services == '') {
            this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
            this.isSer=true
          }
          else if (element.date == null  || element.date == "") {
            this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
            this.isDate=true
          }
          else if (element.hours == null  || element.hours == '') {
           this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
          this.isHours=true
          }
       console.log(this.saveQPErr);
        }  
      });
      if (this.saveQPErr == "") {
        // this.saveClientAuth(authList);
      }
    }

/////===========================data change========================================//
newdates(event, name, refname) {
  console.log(event)
  console.log(name)

  if (name == "inputchage") {
    console.log(this.qpadd.date)
    let val = this.dateservice.inputFeildchange(event);
    console.log(val)
    if (val != undefined) {
      let val1 = this.dateservice.inputFeildchange(event);
      if (refname == "Create") {
        this.qpadd.date = val1;
        console.log(this.qpadd.date)
      }
    }
  }
  if (name == "datechagned") {
    let val = this.dateservice.Datechange(event);
    console.log(val)
    if (val != undefined) {
      let val1 = this.dateservice.Datechange(event);
      if (refname == "Create") {
        this.qpadd.date = val1;
        console.log(this.qpadd.date)
      }
    }
  }
}
  ///////////////////////////////////////get Client///////////////////////////////////////////////////////////////////
getClient() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.qpService.getClient(params).subscribe((data: any) => {
      this.ClinetDropDown = data;
      console.log('ClinetDropDown',this.ClinetDropDown);
      
      this.ClinetDropDown.forEach(element => {
        element.id = element.id.toString();
      })
    });
  }
//============================================== Restrict Hours ==========================================================//
  numberonly(event: any,type) {
if (((event.which < 48 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 57) && ((event.which < 96 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 105)) {
      event.preventDefault();
}
let txt = "";
// console.log('value',event.target.value);
if (type == "create") {
  txt = event.target.value;
  console.log('hours',event.target.value);
  
}
txt = (txt.trim) ? txt.trim() : txt.replace(/^\s+/, '');
    if (txt.length == 1) {
      if (txt == "2") {
        if (event.key > 3) {
          event.preventDefault();
        }
      }
      if (parseInt(txt) > 2) {
        if (event.which != 46) {
          event.preventDefault();
        }
      }
      if (txt == '.') {
        if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
          event.preventDefault();
        }
      }
    }
    if (txt.length == 2) {
      let tempdata = txt.split("");
      if (!(tempdata[1] == ".")) {
        if (tempdata[0] == ".") {
          if (tempdata[1] == "5" || tempdata[1] == "0") {
            if (!(event.which == 48)) {
              event.preventDefault();
            }
          }
          if (tempdata[1] == "2" || tempdata[1] == "7") {
            if (!(event.which == 53)) {
              event.preventDefault();
            }
          }
        }
        else if (event.which != 46) {
          event.preventDefault();
        }
      }
      else {
        if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
          event.preventDefault();
        }
      }
    }
    if (txt.length == 3) {
      let tempdata = txt.split("");
      if (tempdata[0] == ".") {
        event.preventDefault();
      }
      if (tempdata[2] == ".") {
        if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
          event.preventDefault();
        }
      }
      if (tempdata[1] == ".") {
        let tempdata1 = txt.split(".");
        if (tempdata1[1] == "5" || tempdata1[1] == "0") {
          if (!(event.which == 48)) {
            event.preventDefault();
          }
        }
        if (tempdata1[1] == "2" || tempdata1[1] == "7") {
          if (!(event.which == 53)) {
            event.preventDefault();
          }
        }
      }
    }
    if (txt.length == 4) {
      let tempdata = txt.split(".");
      if (tempdata[1].length == 2) {
        event.preventDefault();
      }
      if (tempdata[1] == "5" || tempdata[1] == "0") {
        if (!(event.which == 48)) {
          event.preventDefault();
        }
      }
      if (tempdata[1] == "2" || tempdata[1] == "7") {
        if (!(event.which == 53)) {
          event.preventDefault();
        }
      }
    }
    let val = txt.split('.');
    if (txt.length > 4) {
      event.preventDefault();
    }

  }

}
