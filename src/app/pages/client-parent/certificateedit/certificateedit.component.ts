import { Component, OnInit,Input,EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ClientCertificationBO, PhysicianBO,editcertificate} from '../client-parent.model';

import { IMyInputFieldChanged, IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GlobalComponent } from 'src/app/global/global.component';
import { FormBuilder } from '@angular/forms';
import { CommonHttpService } from 'src/app/common.service';
import { generalservice } from 'src/app/services/general.service';
import { ClientHttpService } from '../client-parent.service';

@Component({
  selector: 'app-certificateedit',
  templateUrl: './certificateedit.component.html',
  styleUrls: ['./certificateedit.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateeditComponent implements OnInit {
  ModelType: string = 'edit';
  @Input() certificate:editcertificate=new editcertificate();
  @Output()  DatafromCertificate=new EventEmitter<editcertificate>();
  CLientSOCList: [{ Key: string, Value: string }];
  
 startofcaredate:boolean=false;
  companyList: [{ Key: number, Value: string }];
  deletecertificate:number=0;
  ICD10List: [{ Key: string, Value: string }];
  ClientCertificationList = new ClientCertificationBO();
  saveorUpdatecertificationErr: string = "";
  enableICD10:boolean=false;
  constructor(public toastrService: ToastrService,public http: HttpClient, public datepipe: DatePipe, public commonhttp: CommonHttpService, public ClientService: ClientHttpService, public general: generalservice,
    private formBuilder: FormBuilder, public global: GlobalComponent, private ref: ChangeDetectorRef) { 
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
  
  
    }
    ICD10value:string="client"
  ngOnInit(): void {
   // console.log("datafromclient")
   //console.log(this.certificate);
  
    this.getStartofCareList()
    this.getCompanyList();
    this.ICD10List=this.global.globalICD10List;
   // this.getICD10List();
    if(this.certificate.type=="edit")
    {
      this.AddNewCertification("edit");
      this.Certificationdatabind(this.certificate.clientcertifcateData)
      document.getElementById("opencertificate").click();
    }
    if(this.certificate.type=="new")
    {
      this.AddNewCertification("new");
      document.getElementById("opencertificate").click();
    }
    if(this.certificate.type=="delete")
    {
      document.getElementById("deletecertificatedata").click();
      this.deletecertificate=this.certificate.certificateId;
     //console.log("deleteid",this.deletecertificate)
     //console.log(this.certificate.certificateId);
    }
  }
  AddNewCertification(type: string) {

   //console.log("Im here in cer general", type);
    if (type == 'new') {
     //console.log("Im here in cer type");
      this.ModelType = 'new';
      this.ClientCertificationList = new ClientCertificationBO();

    }
    else {
      this.ModelType = 'edit';
    }
  }
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };

  Certificationdatabind(data: ClientCertificationBO) {
  
   
    this.ClientCertificationList = data;
  //console.log(data)
    this.ClientCertificationList.startOfCareId = this.ClientCertificationList.startOfCareId.toString();
    this.ClientCertificationList.icD10PrimaryId = this.ClientCertificationList.icD10PrimaryId.toString();
    this.ClientCertificationList.startDate = new Date(this.ClientCertificationList.startDate).toLocaleDateString();
    this.ClientCertificationList.endDate = this.ClientCertificationList.endDate != null ? new Date(this.ClientCertificationList.endDate).toLocaleDateString() : null;
   //console.log(this.ClientCertificationList)
  }

  //==========================================Date format options===============================//
  Certificationstartdatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.ClientCertificationList.startDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }

  onDateChangedCertificationStart(event: IMyDateModel) {
    ;
    this.ClientCertificationList.startDate = event.formatted;

  }
  Certificationenddatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.ClientCertificationList.endDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }

  onDateChangedCertificationEnd(event: IMyDateModel) {
    this.ClientCertificationList.endDate = event.formatted;

  }
  

   //===============================delete certificate==========================================================//
   deleteCertificateConfirmation() {

    let params = new URLSearchParams();
   //console.log("deleteid",this.deletecertificate)
    params.append("Id", this.deletecertificate.toString());
    this.ClientService.deletecertificate(params).subscribe((data: any) => {
      this.toastrService.success(
        "Certificate has been deleted successfully",
        "Certificate deleted",
      ), 8000
      document.getElementById('deletecertificatedata').click();
      this.back();
   
    },
      (err: HttpErrorResponse) => {


        this.saveorUpdatecertificationErr = "";
        this.saveorUpdatecertificationErr = err.error;
        if (this.saveorUpdatecertificationErr != "") {
          setTimeout(function () {
            this.saveorUpdatecertificationErr = "";
          }.bind(this), 8000);

        }
      });
  }

  //=========================================Search NPI===================================//
  searchNPI(NPI) {
    NPI = NPI != null ? parseInt(NPI) : null;
    let params = new URLSearchParams();
    params.append("searchNPI", NPI);
    this.ClientService.getNPIDetails(params).subscribe((data: PhysicianBO) => {
      if (data != null) {
        this.ClientCertificationList.physician = data.physicianName;
        this.ClientCertificationList.clinic = data.clinicName != null ? data.clinicName : '' + '' + data.clinicAddress != null ? data.clinicAddress : '' + ',' + data.clinicCity != null ? data.clinicCity : '' + ',' + data.clinicState != null ? data.clinicState : '' + ',' +
          data.zipCode != null ? data.zipCode : ''
      }
      else {
        this.ClientCertificationList.physician = "";
        this.ClientCertificationList.clinic = "";
        this.saveorUpdatecertificationErr = "";
        this.saveorUpdatecertificationErr = "Invalid NPI";
        if (this.saveorUpdatecertificationErr != "") {
          setTimeout(function () {
            this.saveorUpdatecertificationErr = "";
          }.bind(this), 8000);
        }
      }
    },(err:HttpErrorResponse)=>{
      this.saveorUpdatecertificationErr=""
      this.saveorUpdatecertificationErr = err.error;
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
    })
  }
   //=================================Restrict text in text field======================//
   keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //==============================check cerficate============================================================//
  checkCertificationValidation(socList) {
   console.log(socList);

    socList.socDate=this.CLientSOCList.filter(s=>s.Key==socList.startOfCareId)[0].Value
    this.saveorUpdatecertificationErr = "";


    if (new Date(socList.socDate).getTime() > new Date(socList.startDate).getTime()) {


      this.saveorUpdatecertificationErr = "Start date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
     //console.log(socList);
    }
    else if ((socList.endDate != null && socList.endDate != "" && socList.endDate != undefined)
      && (new Date(socList.socDate).getTime() > new Date(socList.endDate).getTime())) {


      this.saveorUpdatecertificationErr = "End date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
     //console.log(socList);
    }
     else if ((socList.endDate != null && socList.endDate != "" && socList.endDate != undefined
     && socList.startDate != null && socList.startDate != "" && socList.startDate != undefined)
      && (new Date(socList.startDate).getTime() == new Date(socList.endDate).getTime())) {


      this.saveorUpdatecertificationErr = "Start date and end date should not be same"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
     //console.log(socList);
    }

    else if ((socList.endDate != null && socList.endDate != "" && socList.endDate != undefined)
      && (new Date(socList.startDate).getTime() > new Date(socList.endDate).getTime())) {


      this.saveorUpdatecertificationErr = "End date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
     //console.log(socList);
    }
    else {
      if (this.saveorUpdatecertificationErr == "") {
        this.savephyscian(socList)


      }
    }
  }
  //===================================save physcian==========================================================//
  savephyscian(socList) {
   //console.log(socList)
    if (socList.npi != null && socList.physician != null  && socList.npi != undefined &&
      socList.physician != undefined ) {
      let val = {};
      if(socList.clinic==undefined||socList.clinic=='')
      {
        socList.clinic=null;
      }
     //console.log(socList)
      val = {
        Id: 0,
        NPI: socList.npi,
        PhysicianName: socList.physician,
        ClinicName: socList.clinic!=null? socList.clinic.split(',').length > 0 ? socList.clinic.split(',')[0] : null:null,
        ClinicAddress:socList.clinic!=null? socList.clinic.split(',').length > 1 ? socList.clinic.split(',')[1] : null:null,
        ClinicCity:socList.clinic!=null? socList.clinic.split(',').length > 2 ? socList.clinic.split(',')[2] : null:null,
        ClinicState:socList.clinic!=null? socList.clinic.split(',').length > 3 ? socList.clinic.split(',')[3] : null:null,
        ZipCode:socList.clinic!=null? socList.clinic.split(',').length > 4 ? socList.clinic.split(',')[4] : null:null,
      }


      this.ClientService.savephysican(val).subscribe((data: any) => {
        this.saveClientCertification(socList)
      },

        (err: HttpErrorResponse) => {


          this.saveorUpdatecertificationErr = "";
          this.saveorUpdatecertificationErr = err.error;
          if (this.saveorUpdatecertificationErr != "") {
            setTimeout(function () {
              this.saveorUpdatecertificationErr = "";
            }.bind(this), 8000);

          }
        });

    }
    else {
      this.saveClientCertification(socList);
     //console.log(socList)
    }
  }
  //========================================save certificate===================================================//
  saveClientCertification(socList) {
   //console.log(socList)
    socList = JSON.parse(JSON.stringify(socList));
    if ((socList.startDate != null && socList.startDate != "")) {

      let val = ""
      if (socList.endDate != null && socList.endDate != undefined && socList.endDate != "") {
        val = new Date(new Date(socList.endDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString()
      }
      else {
        val = null;
      }

      let certObj = {
        Id: socList.id,
        ClientId: this.global.clientId,
        StartOfCareId: socList.startOfCareId != null ? parseInt(socList.startOfCareId) : null,
        StartDate: new Date(new Date(socList.startDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString(),
        EndDate: val,


        CompanyId: socList.companyId != null ? parseInt(socList.companyId) : null,
        NPI: socList.npi,
        Icd10primaryId: this.ICD10List.filter(i => i.Key == socList.icD10PrimaryId)[0].Value,
        Icd10secondaryId: socList.icD10SecondaryId,
        Physician: socList.physician,
        Clinic: socList.clinic
      }




      socList.clientId = this.global.clientId;
     //console.log(socList)
      if (socList.id == 0) {
        this.ClientService.savecertificate(certObj).subscribe((data: any = []) => {



          this.toastrService.success(
            'Certificate has been created successfully!',
            'Certificate  created'), 3000;
         
          document.getElementById("opencertificate").click()
          this.back()
        },


          (err: HttpErrorResponse) => {

            this.saveorUpdatecertificationErr = "";
            this.saveorUpdatecertificationErr = err.error;
            if (this.saveorUpdatecertificationErr != "") {
              setTimeout(function () {
                this.saveorUpdatecertificationErr = "";
              }.bind(this), 8000);

            }
          });
      }

      else {
        this.ClientService.savecertificate(certObj).subscribe((data: any = []) => {



          this.toastrService.success(
            'Certificate has been updated successfully!',
            'Certificate  updated'), 3000;
        
          document.getElementById("opencertificate").click()
          this.back();
        },


          (err: HttpErrorResponse) => {

            this.saveorUpdatecertificationErr = "";
            this.saveorUpdatecertificationErr = err.error;
            if (this.saveorUpdatecertificationErr != "") {
              setTimeout(function () {
                this.saveorUpdatecertificationErr = "";
              }.bind(this), 8000);

            }
          });
      }
    }


  }
  //=========================================close ICD10================================================================//
  Closedcdialog() {
    document.getElementById("ICD10eopen").click();
  }
  //=========================================get soc date list=============================//
getStartofCareList() {
  let myParams = new URLSearchParams();
 //console.log(this.certificate.clientId,"clientID=======");
  
  // myParams.append("clientId", this.global.clientId.toString());
  myParams.append("clientId", this.certificate.clientId.toString());
  this.commonhttp.getStartofCareListdate(myParams).subscribe((data: any = []) => {
    this.CLientSOCList = data;
   //console.log(this.CLientSOCList)
    this.CLientSOCList.forEach(element => {
      element.Value = this.datepipe.transform(element.Value, "M/d/yyyy");
      element.Key = element.Key.toString();
    })

    if(data.length == 0)
    {
      this.startofcaredate =true;
    }
  })
}

//=========================================getcompany list=============================//
getCompanyList() {
  let myParams = new URLSearchParams();
  // myParams.append("agencyId", this.global.globalAgencyId);
  myParams.append("agencyId", this.global.globalAgencyId);
  this.commonhttp.getCompany(myParams).subscribe((data: [{ Key: number, Value: string }]) => {

    this.companyList = data;
    this.companyList.forEach(element => {
      element.Value = element.Value;
      element.Key = element.Key;
    })
  })
}
//======================================Data from ICD10================================================//
ICD10data(event) {
  // this.ClientCertificationList.icD10PrimaryId
 //console.log(event);
  this.ClientCertificationList.icD10PrimaryId = event.toString();
  this.getICD10List();
  document.getElementById("ICD10eopen").click();
  this.enableICD10 = false;
}

//////////////////////////////////////Back function///////////////////////////////////////////////////////////////////////
back()
{
 //console.log("back fuction");
  this.DatafromCertificate.emit({ isView:true,
    isEdit:false,
    certificateId:0,
    clientcertifcateData:this.certificate.clientcertifcateData,
    clientId:this.global.clientId,
  type:''})
}
//===================================Get COmmon Icd10=========================//
getICD10List() {
  this.commonhttp.getICD10().subscribe((data: any = []) => {
    this.ICD10List = data;
    this.ICD10List.forEach(element => {
      element.Value = element.Value;
      element.Key = element.Key.toString();
    })
  })
}
}
