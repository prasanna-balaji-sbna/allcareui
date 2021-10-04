import { Component, OnInit, Input, Output,EventEmitter, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgencyService } from '../../agency.service';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { CompanyList, agencyStatusList, StatusList, StatusListCompany, Compaysort ,IsViewEdit, CompanyReturnBO} from '../../agency.model';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpService } from 'src/app/common.service';
// import { IsViewEdit } from 'src/app/pages/employee/emloyee.model';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompanyEditComponent implements OnInit {
   /////===============Main functionality initialisation=====================///
   companylist: CompanyList[];
   Company: CompanyList = new CompanyList();
   // Agency: AgencyList = new AgencyList();
   agencyStatusList: agencyStatusList[];
   statusList: StatusList[];
   StatusListCompany:StatusListCompany[];
   valuechangeCompany: any = [];
   saveErr:string="";
   ///////////////=============Form initialization==========//
   // AgencyGroup: FormGroup;
   CompanyGroup:FormGroup;

    ///////////////-===================Table initializations==========// 
    dropInstance: DropDownList;
    public searchSettings: SearchSettingsModel;
    public toolbar: ToolbarItems[];
    initialPage: object;
    filterOptions: FilterSettingsModel;
    grid: GridComponent;
    filter: IFilter;
    TotalCount: number;
    pagesort:Compaysort = new Compaysort();
 ///////////////////////////////////////////////Event Emitter///////////////////////////////////////////////////////////
 @Input() ViewEdit: IsViewEdit;
 @Output() isViewEdit = new EventEmitter<IsViewEdit>();
 editCompanyId:number=0;
 isEditCompany: boolean = false;
 isView: boolean = false;
 isEdit: boolean = false;
 AgencyId:number;
 CompanyData:CompanyList;
 //////////////////////////////////////////////////////////////////////////////////////
 Type:string='edit';
 stateList:any=[]
  constructor(public http: HttpClient, private formBuilder: FormBuilder,private ref: ChangeDetectorRef,public commonhttp: CommonHttpService,
    public global: GlobalComponent, public httpService: AgencyService, public toastrService: ToastrService, public general: generalservice
    ,private modalService: NgbModal) { 
      

    //  ref.detach(); 
    //   setInterval(() => {
    //     this.ref.detectChanges();
    //   }, 10);
    this.CompanyGroup = this.formBuilder.group({
      Provider_No: ["	", Validators.required],
      Company_Name: ["", Validators.required],
      Admin_LastName: ["	"],
      Admin_FirstName: ["	"],
      SubmissionType: ["	"],
      SubCom_MANo: ["	"],
      SubCom_MCNo: ["	"],
      TaxCode_MANo: ["	"],
      TaxCode_MCNo: ["	"],
      FEIN_MCNo: ["	"],
      BP_MANo: ["	"],
      BP_MCNo: ["	"],
      billto_Name: ["	"],
      billto_Street: ["	"],
      billto_City: ["	"],
      billto_State: ["	"],
      billto_zipcode: ["	"],
      payTo_Street: ["	"],
      PayTo_City: ["	"],
      PayTo_State: ["	"],
      PayTo_zipcode: ["	"],
      Phone: ["	"],
      Fax: ["	"],
      Status: ["	", Validators.required],
    });
  }

  ngOnInit(): void {
    this.getStatusLov();
    this.Company=this.CompanyData;
    this.commonhttp.getJSON().subscribe(data => {
   
      this.stateList=data;
  });
    this.valueschangesCompany();
  }

  //////////////////////////////////////////////view change ///////////////////////////////////////////////////////////////
  ngOnChanges(changes: SimpleChanges){
    this.isEditCompany = this.ViewEdit.isEditCompany;
    this.isView = this.ViewEdit.isView;
    this.isEdit = this.ViewEdit.isEdit;
    this.editCompanyId = this.ViewEdit.editCompanyId;
    this.CompanyData=this.ViewEdit.CompanyData;
    this.AgencyId = this.ViewEdit.AgencyId;
    // debugger;
    let f = changes;
    // this.valueschangesCompany();

  }
  ////////////  close Company Add and Update validation////////////////////////////////
  

 
  valueschangesCompany() {
    this.valuechangeCompany = {
      Provider_No: 0,
      Status: 0,
      Name: 0,
      Admin_LastName: 0,
      Admin_FirstName: 0,
      SubmissionType: 0,
      SubCom_MANo: 0,
      SubCom_MCNo: 0,
      TaxCode_MANo: 0,
      TaxCode_MCNo: 0,
      FEIN_MCNo: 0,
      BP_MANo: 0,
      BP_MCNo: 0,
      billto_Name: 0,
      billto_Street: 0,
      billto_City: 0,
      billto_State: 0,
      billto_zipcode: 0,
      payTo_Street: 0,
      PayTo_City: 0,
      PayTo_State: 0,
      PayTo_zipcode: 0,
      Phone: 0,
      Fax: 0,
    }
  }
  checkpopupCompany(value) {
    if (value == "Provider_No") {
      this.valuechangeCompany.Provider_No++;
    }
    if (value == "Status") {
      this.valuechangeCompany.Status++;
    }
    if (value == "Name") {
      this.valuechangeCompany.Name++;
    }
    if (value == "Admin_LastName") {
      this.valuechangeCompany.Admin_LastName++;
    }
    if (value == "Admin_FirstName") {
      this.valuechangeCompany.Admin_FirstName++;
    }
    if (value == "SubmissionType") {
      this.valuechangeCompany.SubmissionType++;
    }
    if (value == "Phone") {
      this.valuechangeCompany.Phone++;
    }
    if (value == "SubCom_MANo") {
      this.valuechangeCompany.SubCom_MANo++;
    }
    if (value == "SubCom_MCNo") {
      this.valuechangeCompany.SubCom_MCNo++;
    }
    if (value == "TaxCode_MANo") {
      this.valuechangeCompany.TaxCode_MANo++;
    }
    if (value == "TaxCode_MCNo") {
      this.valuechangeCompany.TaxCode_MCNo++;
    }
    if (value == "FEIN_MCNo") {
      this.valuechangeCompany.FEIN_MCNo++;
    }
    if (value == "BP_MANo") {
      this.valuechangeCompany.BP_MANo++;
    }
    if (value == "BP_MCNo") {
      this.valuechangeCompany.BP_MCNo++;
    }
    if (value == "billto_Name") {
      this.valuechangeCompany.billto_Name++;
    }
    if (value == "billto_Street") {
      this.valuechangeCompany.billto_Street++;
    } if (value == "billto_City") {
      this.valuechangeCompany.billto_City++;
    } if (value == "billto_State") {
      this.valuechangeCompany.billto_State++;
    } if (value == "billto_zipcode") {
      this.valuechangeCompany.billto_zipcode++;
    } if (value == "payTo_Street") {
      this.valuechangeCompany.payTo_Street++;
    }
    if (value == "PayTo_City") {
      this.valuechangeCompany.PayTo_City++;
    }
    if (value == "PayTo_State") {
      this.valuechangeCompany.PayTo_State++;
    }
    if (value == "PayTo_zipcode") {
      this.valuechangeCompany.PayTo_zipcode++;
    }
    if (value == "Fax") {
      this.valuechangeCompany.Fax++;
    }



  }

  openDialogCompany() {

    // if (this.valuechangeCompany.Provider_No > 1 || this.valuechangeCompany.Status > 1
    //   || this.valuechangeCompany.Name > 1 || this.valuechangeCompany.Admin_LastName > 1 || this.valuechangeCompany.Admin_FirstName > 1
    //   || this.valuechangeCompany.Phone > 0 || this.valuechangeCompany.SubmissionType > 1 || this.valuechangeCompany.SubCom_MANo > 1
    //   || this.valuechangeCompany.SubCom_MCNo > 1 || this.valuechangeCompany.TaxCode_MANo > 1 || this.valuechangeCompany.TaxCode_MCNo > 1
    //   || this.valuechangeCompany.FEIN_MCNo > 1 || this.valuechangeCompany.BP_MANo > 1 || this.valuechangeCompany.BP_MCNo > 1
    //   || this.valuechangeCompany.billto_Name > 1 || this.valuechangeCompany.billto_Street > 1 || this.valuechangeCompany.billto_City > 1
    //   || this.valuechangeCompany.billto_State > 1 || this.valuechangeCompany.billto_zipcode > 1 || this.valuechangeCompany.payTo_Street > 1
    //   || this.valuechangeCompany.PayTo_City > 1 || this.valuechangeCompany.PayTo_State > 1 || this.valuechangeCompany.PayTo_zipcode > 1
    //   || this.valuechangeCompany.Fax > 0) {
        if(this.CompanyGroup.touched && this.CompanyGroup.dirty)
        {
          document.getElementById('cancelmodalspan').click();
    }
    else {
      this.back();
        //  document.getElementById('modal').click();

    }

  }

  
  closeFun() {
    this.back();
      }
      closeNofun(){
        document.getElementById('cancelmodalspan').click();
        // document.getElementById('closemodalcompany').click();
        // $('#cancelmodalspan').modal('hide');
      }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();

    }

  }

  ///////////////////////////////////////back function //////////////////////////////////////////////////////////
back() {
  
  this.isEdit = false;
  if (this.isView) {
    this.isView = false;
   
  }
  this.isViewEdit.emit({ isView: false, isEdit: false, isEditCompany: false, editCompanyId:0,AgencyId:this.AgencyId , CompanyData :this.Company })
}


saveCompany() {
  let savelist:CompanyList= JSON.parse(JSON.stringify(this.Company));
  savelist.agencyId = this.ViewEdit.AgencyId;
  savelist.statusLid = +savelist.statusLid;

  if (savelist.phone != null) {
    savelist.phone = this.general.reconverPhoneGoogleLib(savelist.phone);
  }
  if (savelist.fax != null) {
    savelist.fax = this.general.reconverPhoneGoogleLib(savelist.fax);
  }

   // saveList.agencyId = parseInt(this.global.globalAgencyId);
  this.httpService.saveupdateCompany(savelist).subscribe((data: CompanyReturnBO) => {
    //("====save update=========", data);
    if (data.errorList.length == 0) {
      //====================== sucess message =============
      if (savelist.id == 0 || savelist.id == null) {
        savelist.id = data.companyId;
        
        this.toastrService.success('Company created successfully', 'Company created');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        // this.companylist.push(savelist);
        this.back();
        // document.getElementById('modal').click();
      }
      else {
        this.toastrService.success('Company updated successfully', 'Company updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.back();
        //  document.getElementById('modal').click();
      }


    }
    else
    {
      
      this.saveErr=data.errorList[0];
      if (this.saveErr != "") {
        setTimeout(function () {
          this.saveErr = "";
        }.bind(this), 8000);
      }
    }
  //   else {
  //     this.loading1 = false;

  //     this.CompanyErrList = [];
  //     this.CompanyErrList = data.errorList;
  //     if (list.phone != null) {
  //       list.phone = this.phoneNoFormat.getPhoneNumber(list.phone);
  //       list.phone = this.phoneNoFormat.phoneNoToFormat(list.phone);
  //     }
  //     if (list.fax != null) {
  //       list.fax = this.phoneNoFormat.getPhoneNumber(list.fax);
  //       list.fax = this.phoneNoFormat.phoneNoToFormat(list.fax);
  //     }
  //     if (this.CompanyErrList.length != 0) {
  //       setTimeout(function () {
  //         this.CompanyErrList = [];
  //       }.bind(this), 8000)
  //     }
  //   }

  },
    (err: HttpErrorResponse) => {
      this.saveErr=err.error;
      if (this.saveErr != "") {
        setTimeout(function () {
          this.saveErr = "";
        }.bind(this), 8000);
      }
      if (savelist.phone != null) {
        savelist.phone = this.general.converPhoneGoogleLib(savelist.phone);
      }
      if (savelist.fax != null) {
        savelist.fax = this.general.converPhoneGoogleLib(savelist.fax);
      }
    });

}
  //////////////////////////////////////Status lov///////////////////////
  getStatusLov() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatus(params).subscribe((data: StatusList[]) => {
      this.statusList = data;
      this.Company.statusLid = this.statusList.filter(sd=>sd.Value == "Active")[0].Key;

    }, err => {
    })
  }

   /////////////////////Phone format//////////////
  
  CompanyPhoneFormat() {
    this.Company.phone = this.general.converPhoneGoogleLib(this.Company.phone);
  }
  CompanyFaxFormat() {
    this.Company.fax = this.general.converPhoneGoogleLib(this.Company.fax);
  }


}
