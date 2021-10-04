import { Component, OnInit, ViewChild, Output, Inject, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems, DataStateChangeEventArgs, EditEventArgs, Column } from '@syncfusion/ej2-grids';

import { AgencyList, sortingObj, functionpermission, agencyStatusList, StatusList, IsViewEdit, StatusListCompany, CompanyList, ZipcodeDetail, GetAgencyBO, WhereCondition, AgencyInfoBO, SaveReturnBO } from './agency.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';


// import { AgentService } from '../icd10/icd10.service';

// import { AgentService } from '../agency/agency.service';


import { AgencyService } from './agency.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from 'protractor';
import { GetHTTPServiceAgency } from '../agency/agencylistData.service';
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
import { CommonHttpService } from 'src/app/common.service';
@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgencyComponent implements OnInit {
  /////===============Main functionality initialisation=====================///
  Agencylist: AgencyList[];
  Agency: AgencyList = new AgencyList();
  agencyStatusList: agencyStatusList[];
  statusList: StatusList[];
  ///////////////=============Form initialization==========//
  AgencyGroup: FormGroup;


  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
  /////////////===================Filters ==========//

  SearchText: string = '';
  SearchColumn: { [key: string]: string } = { 'AgencyName': 'Name' };

  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  initialPage: object;
  filterOptions: FilterSettingsModel;
  public filterSettings: object;
  filter: IFilter;
  TotalCount: number;
  pagshort: sortingObj = new sortingObj();
  ///////////////==================image ///////////////////////////////
  url: any = {};
  agencyLogoShow: Boolean = false;
  imgType: any = '';
  imgSize: number = 0;
  imageErr: any = "";

  ////////////////========Functionlity initializations==========//    
  ModelType: string = 'edit';
  fp: functionpermission;
  agencyFilter: any;
  valuechange: any = [];
  companycreate: boolean = false;
  // @Output() Edit = new EventEmitter<IsViewEdit>();
  ViewEdit: IsViewEdit = { isView: true, isEdit: true, isEditCompany: false, editCompanyId: 0, AgencyId: this.Agency.id, CompanyData: new CompanyList };
  agencyId: number;
  isEdit: boolean = false;
  alphaErr: boolean = false;
  saveErr: string = "";

  //////////==================Filter===============================================////////////////////

  ListSendBO: GetAgencyBO = new GetAgencyBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  type: string = "";

  public dropdata: string[];
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  public height = '220px';
  //////////////////////======================Close modal initializations=====================//////////////
  // closemodal:boolean= false;
  $: any;
  stateList:any=[]
  constructor(public http: HttpClient,public commonhttp: CommonHttpService, private formBuilder: FormBuilder, @Inject(GetHTTPServiceAgency) public gethttp: GetHTTPServiceAgency,
    private ref: ChangeDetectorRef, public global: GlobalComponent, private ngxService: NgxUiLoaderService, public httpService: AgencyService, public toastrService: ToastrService, private modalService: NgbModal, public general: generalservice) {
    this.data = gethttp;
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data = gethttp;
    this.AgencyGroup = this.formBuilder.group({
      AgencyCode: ["", [Validators.required, Validators.minLength(4)]],
      AgencyName: ["", Validators.required],
      AgencyShortName: [""],
      AgencyLogo: [""],
      Email: ["", [Validators.required, Validators.email]],
      Phone: ["", [Validators.minLength(14), Validators.maxLength(14)]],
      Street: [""],
      City: [""],
      State: [""],
      ZipCode: [""],
      Alt_Street: [""],
      Alt_City: [""],
      Alt_State: [""],
      Alt_Zipcode: [""],
      Status: ["", Validators.required]
    });

  }

  // //////////////////////////////////////////////
  ngOnInit() {
    this.commonhttp.getJSON().subscribe(data => {
      
      this.stateList=data;
  });
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.SearchColumn.key = 'AgencyName';
    this.SearchColumn.value = 'Name';
    // this.getSample();
    this.getStatusLov();
    this.getStatusAgency();
    // this.getAgencyList();
    // this.getTotalCount();   
    this.fp = new functionpermission();
    this.filepermissionget();
    // this.filterOptions = { type: 'Excel' };
   // window.addEventListener('scroll', this.scroll, true);
    this.filterSettings = { type: 'Menu' };
    this.filter = {
      type: 'Excel'
    };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
  }
  
  actionHandler(args) {
    if (args.requestType == "sorting") {
    }
    else if (args.requestType == "filtering") {
    }
  }

  actionBegin(args: EditEventArgs) {

    // if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    for (const cols of this.grid.columns) {
      if ((cols as Column).field === 'Status') {
        (cols as Column).visible = true;
      } else if ((cols as Column).field === 'ShipCountry') {
        (cols as Column).visible = false;
      }
    }
    // }
  }
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  // // ===================================
  // changeColumns() {

  //   this.columnsList.forEach(element => {
  //     if (this.columnsSelected.includes(element)) {
  //       this.grid.showColumns(element);
  //     }
  //     else {
  //       this.grid.hideColumns(element);
  //     }
  //   });
  // }
  ngOnChanges(changes: SimpleChanges) {
    //debugger;
    let f = changes;
  }
  // =================================== data change event=====================///////
  public dataStateChange(state): void {
    this.type = (state.action.requestType).toString();

    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.ListSendBO.orderColumn = state.sorted[0].name;
        this.ListSendBO.orderType = state.sorted[0].direction === 'descending' ? 'desc' : 'asc';
      }
    }
    if (this.type == "filtering" && state.action.action != "clearFilter") {
      this.ListSendBO.field = state.action.currentFilterObject.field;
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
      this.ListSendBO.value = state.action.currentFilterObject.value;
      if (this.ListSendBO.type == "number") {


        this.ListSendBO.value = state.action.currentFilterObject.value.toString();
        this.ListSendBO.field = state.action.currentFilterObject.field;


      }
      else {
        this.ListSendBO.value = state.action.currentFilterObject.value;
        this.ListSendBO.field = state.action.currentFilterObject.field;
      }
      if (state.action.currentFilterObject.field == "status_Name") {

        this.ListSendBO.value = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
        this.ListSendBO.field = "statusLid";
        this.ListSendBO.statusLid = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
        this.ListSendBO.type = "number";
      }
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "AgencyName";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }
    this.ListSendBO.userId = this.global.userID;
    this.getAgencyList();

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Agency.Pagesize!=state.take)
        {
          this.arraycol[0].Agency.Pagesize = state.take
          this.SaveColumnwidth();
        // }

      }
    
    }
    }
  }
  AgencyCreateupdate(type: string) {

    if (type == 'new') {
      this.AgencyGroup.reset();
      this.Agency = new AgencyList();
      this.ModelType = 'new';
      this.AgencyGroup.controls.Status.setValue(this.statusList.filter(st => st.Value == "Active")[0].Key);
      this.Agency.statusLid = this.statusList.filter(st => st.Value == "Active")[0].Key;

    }
    else {
      this.ModelType = 'edit';
      this.agencyId = this.Agency.id;
    }

    this.valueschanges();
    this.ViewEdit.CompanyData.agencyId = this.Agency.id;
    this.ViewEdit.AgencyId = 0;

  }
  ////////////////////////////////////////////////////
  selectAgencydetails(agencyDetails: AgencyList) {

    this.Agency = JSON.parse(JSON.stringify(agencyDetails));

  }
  ////////////////////////////////////////////////////////////
  DemographicPhoneFormat() {

    this.Agency.phone = this.general.converPhoneGoogleLib(this.Agency.phone);
  }

  ///////////////////////////////////////////Refresh function ////////////////////////////////////////////////////

  Refresh() {
    this.SearchText = "";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = this.SearchText;
    this.ListSendBO.type = "string"
    this.ListSendBO.field = "AgencyName"
    this.ListSendBO.statusLid = this.statusList.filter(st => st.Value == "Active")[0].Key;
    this.ListSendBO.AgencyFilter = this.statusList.filter(st => st.Value == "Active")[0].Key;
    this.agencyFilter = this.statusList.filter(st => st.Value == "Active")[0].Key;
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.pagshort = new sortingObj();
    this.grid.pageSettings.currentPage= 1;

    this.getAgencyList();
  }

  // ============================================================================

  getAgencyList() {
    this.ngxService.start()
    for (const cols of this.grid.columns) {

      if ((cols as Column).field === 'Status') {
        if (this.agencyFilter == '0') {
          (cols as Column).visible = true;
        }
        else {
          (cols as Column).visible = false;
        }
      }


    }
    this.ListSendBO.SearchColumn = this.SearchColumn.key;
    this.ListSendBO.SearchText = this.SearchText;
    // this.ListSendBO.pageitem=this.pagshort.itemperpage;
    // this.ListSendBO.currentpageno=this.pagshort.currentPgNo;
    // this.ListSendBO.orderColumn=this.pagshort.shortcolumn;
    // this.ListSendBO.orderType=this.pagshort.shortType;
    this.ListSendBO.AgencyFilter = parseInt(this.agencyFilter);
    // this.ListSendBO.userId=this.global.userID;
    this.gethttp.execute(this.ListSendBO);
    let count=0;
    this.data.subscribe((data) => {
      count = count+1;
     
      if(data!=null&&data!=undefined && count ==1)
      {
        this.getColumnwidth();
      }
    })

  }
  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getAgencyList();

  }

  // /////////////////////////////////////////////////////////////
  pageItemsChage(pageitems) {
    this.pagshort.itemperpage = pageitems;
    this.getAgencyList();
    // this.getTotalCount();

  }
  // // //////////////////////////////////////////////////////////////
  Search() {
    this.pagshort.currentPgNo = 1;
    // this.getTotalCount();
    this.getAgencyList();



  }
  // // ///////////////////////////////////////////////////////////
  onKeydown(event) {
    if (event.key === "Enter") {
      this.Search();
    }
  }
  //////////////////////////////Set default value for searchcolumn////////////////////
  setDefaultValue() {
    this.SearchText = "";
    if (this.SearchColumn == undefined)
      this.SearchColumn = {
        'AgencyName': 'Name'
      };
  }
  //   // //////////////////////////////////////////////////////////
  SaveOrUpdateAgency() {

    var saveList: AgencyList = JSON.parse(JSON.stringify(this.Agency));
    saveList.serviceProviderId = 1;
    saveList.statusLid = +saveList.statusLid;
    if (saveList.phone != null) {
      saveList.phone = this.general.reconverPhoneGoogleLib(saveList.phone);
    }
    this.ngxService.start()
    this.httpService.saveupdate(saveList).subscribe((data: SaveReturnBO) => {
     
      this.ngxService.stop()

      if (data.errorList.length == 0) {
        //====================== sucess message =============
        if (saveList.id == 0) {
          saveList.id = data.agencyId;
          this.agencyId = data.agencyId;

          this.Agency = saveList;
          this.saveAgencySetting(this.agencyId)
          this.saveServiceAndDCCodes(this.agencyId);
          this.toastrService.success('Agency created successfully', 'Agency created');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          // this.Agencylist.push(saveList);

          this.getAgencyList();
          this.valueschanges();
          this.ModelType = 'edit';
          this.getOverallAgencyDropDown();
          // this.Agencylist = JSON.stringify(this.Agencylist);
          // document.getElementById('modal').click();
        }
        else {
          this.getAgencyList();
          this.getOverallAgencyDropDown();
          if (this.Agency.id == this.global.globalAgencyId) {
            let myparams = new URLSearchParams();
            myparams.append("agencyId", this.global.globalAgencyId);
            this.httpService.getOverAllAgencyInfo(myparams).subscribe((data: AgencyInfoBO) => {
              
              if (data != null) {
                this.global.agencyLogo = data.agencyLogo;
                this.global.agencyName = data.agencyName;
                if (data.phone != null) {
                  data.phone = this.general.reconverPhoneGoogleLib(data.phone);
                  this.global.agencyPhone = this.general.converPhoneGoogleLib(data.phone);
                }
                data.agencyId = this.global.globalAgencyId;
                localStorage.setItem("globalAgencyData", JSON.stringify(data));
              }
            })
          }
          this.toastrService.success('Agency updated successfully', 'Agency updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);

          this.valueschanges();
          document.getElementById('openModal').click();
        }


      }
      else {
        this.saveErr = data.errorList[0];
        if (this.saveErr != "") {
          setTimeout(function () {
            this.saveErr = "";
          }.bind(this), 8000);
        }
        // this.toastrService.error(data.errorList[0]);
        // setTimeout(() => {
        //   this.toastrService.clear();
        // }, 8000);
      }

    },
      (err: HttpErrorResponse) => {
        this.saveErr = err.error;
        if (this.saveErr != "") {
          setTimeout(function () {
            this.saveErr = "";
          }.bind(this), 8000);
        }
        // this.toastrService.error(err.error);
        // setTimeout(() => {
        //   this.toastrService.clear();
        // }, 8000);
      })
  }


  onActionBegin(args) {

  }
  argschooser = [];
  public onActionComplete(args) {

    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.grid.columns.forEach(element => {
        if (element.visible == false && element.headerText != "Actions" && element.headerText != "") {
          hidearr.push(element.headerText);
        }
        if (element.visible == true && element.headerText != "Actions" && element.headerText != "") {
          showarr.push(element.headerText);
        }
      })

    
      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {
if(this.arraycol.length >0){
  this.arraycol[0].Agency.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Agency.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });

  if (this.arraycol[0].Agency.ShowColumns.length != count1 || this.arraycol[0].Agency.HideColumns.length != count) {
    this.arraycol[0].Agency.ShowColumns = showarr;
    this.arraycol[0].Agency.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
     
       
      }
    }


    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      this.ListSendBO.type = args.columnType
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
      });
    }

  }
  // =========================================== Agency Get fun================================/
  // getAgencyList() {
  //   let params = new URLSearchParams();
  //   this.agencyFilter = (this.agencyFilter != undefined && this.agencyFilter != null ) ? parseInt(this.agencyFilter) : parseInt('0');

  //   this.ListSendBO.SearchColumn=this.SearchColumn.key;
  //   this.ListSendBO.SearchText=this.SearchText;
  //   this.ListSendBO.pageitem=this.pagshort.itemperpage;
  //   this.ListSendBO.currentpageno=this.pagshort.currentPgNo;
  //   this.ListSendBO.orderColumn=this.pagshort.shortcolumn;
  //   this.ListSendBO.orderType=this.pagshort.shortType;
  //   this.ListSendBO.AgencyFilter= this.agencyFilter;

  //   if(this.conditionlist.length!=0){
  //     // this.ListSendBO.conitionBO=this.conditionlist;
  //   }
  //   else{
  //     this.conditionlist.push(new WhereCondition());
  //     // this.ListSendBO.conitionBO=this.conditionlist;
  //   }

  //   this.httpService.getAgencyList(this.ListSendBO).subscribe((data: AgencyList[]) => {


  //     this.Agencylist = data;

  //     this.getTotalCount();
  //     this.Agencylist.forEach(element => {
  //       element.phone = this.general.reconverPhoneGoogleLibhttpsave(element.phone);
  //     });
  //   })
  // }

  getTotalCount() {

    let myParams = new URLSearchParams();


    myParams.append("AgencyFilter", this.agencyFilter);
    myParams.append("SearchColumn", this.SearchColumn.key);
    myParams.append("SearchText", this.SearchText);

    this.httpService.getAgencyCount(myParams).subscribe((data: number) => {
      this.TotalCount = data;

    });
  }
  //////////////////////////////////////Status lov///////////////////////
  getStatusLov() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatus(params).subscribe((data: StatusList[]) => {
      this.statusList = JSON.parse(JSON.stringify(data));



    }, err => {
    })
  }

  getStatusAgency() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatusForAgency(params).subscribe((data: agencyStatusList[]) => {

      this.agencyStatusList = JSON.parse(JSON.stringify(data));

      this.dropdata = data.map(e => e.Value);
      this.agencyStatusList.push({ Key: '0', Value: "All" });
      this.agencyFilter = this.agencyStatusList.filter(st => st.Value == "Active")[0].Key;

      if (this.agencyFilter != undefined) {
        this.getAgencyList();
      }
      else {
        this.agencyFilter = '0'
        this.getAgencyList();
      }
    });
  }


  test(value) {
  }
  ////////////////////////////////////////////////////////////////////
  filepermissionget() {
    let params = new URLSearchParams();

    params.append("pagecode", "CaseManager");
    params.append("roleId", this.global.roleId);


    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;

    });
  }



  valueschanges() {
    this.valuechange = {
      Img: 0,
      Status: 0,
      AgencyName: 0,
      Code: 0,
      ShortName: 0,
      Email: 0,
      Phone: 0,
      Street: 0,
      City: 0,
      State: 0,
      Zip: 0,
      Alt_Street: 0,
      Alt_City: 0,
      Alt_State: 0,
      Alt_Zipcode: 0,
    }
  }
  checkpopup(value) {
    if (value == "Img") {
      this.valuechange.Img++;
    }
    if (value == "Status") {
      this.valuechange.Status++;
    }
    if (value == "AgencyName") {
      this.valuechange.AgencyName++;
    }
    if (value == "Code") {
      this.valuechange.Code++;
    }
    if (value == "ShortName") {
      this.valuechange.ShortName++;
    }
    if (value == "Email") {
      this.valuechange.Email++;
    }
    if (value == "Phone") {
      this.valuechange.Phone++;
    }
    if (value == "Street") {
      this.valuechange.Street++;
    }
    if (value == "City") {
      this.valuechange.City++;
    }
    if (value == "State") {
      this.valuechange.State++;
    }
    if (value == "Zip") {
      this.valuechange.Zip++;
    }
    if (value == "Alt_Street") {
      this.valuechange.Alt_Street++;
    }
    if (value == "Alt_City") {
      this.valuechange.Alt_City++;
    }
    if (value == "Alt_State") {
      this.valuechange.Alt_State++;
    }
    if (value == "Alt_Zipcode") {
      this.valuechange.Alt_Zipcode++;
    }



  }

  ///////////================GET ZIP===============================================//////////////
  getzipcodeClient(list) {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", list.street)
    myParams1.append("City", list.city)
    myParams1.append("State", list.state)
    this.httpService.getZipcode(myParams1).subscribe((data: ZipcodeDetail) => {
      this.Agency.zipCode = data.zipcode;

      // data.forEach(element => {
      //   this.Agency.zipCode= element.zipcode;
      // });
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(err.error);
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      }
    );
  }

  getzipcodeClient1(list) {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", list.alt_Street)
    myParams1.append("City", list.alt_City)
    myParams1.append("State", list.alt_State)
    this.httpService.getZipcode(myParams1).subscribe((data: ZipcodeDetail) => {
      this.Agency.alt_Zipcode = data.zipcode;
      // data.forEach(element => {
      //   this.Agency.alt_Zipcode= element.zipcode;
      // });

    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(err.error);
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      }
    );
  }

  ////---- ADD/VIEW/EDIT EVENTS FROM COMPANY TABLE VIEW HANDLER
  dataEmitfromChild(event: IsViewEdit) {

    this.isEdit = event.isEdit;
    this.ViewEdit.AgencyId = this.Agency.id;
    this.ViewEdit = event;
    // this.AgencyId = event.CompanyData.agencyId;
    // this.isViewEdit.emit({ isView: false, isEdit: true, isEditCompany: false, editCompanyId: 0,AgencyId:this.ViewEdit.AgencyId, CompanyData: list })



  }

  companyConfig(value) {
    this.companycreate = true;
    this.ViewEdit.AgencyId = value.id;
    document.getElementById('companyspan').click();
    // this.ViewEdit.emit

  }
  closeFun() {
    document.getElementById('modal').click();
    document.getElementById('closemodal').click();

  }
  // closeRef: any;
  openDialog() {

    // this.closeRef = ref;
    if (this.valuechange.Code > 1 || this.valuechange.Img > 0 || this.valuechange.Status > 1
      || this.valuechange.AgencyName > 1 || this.valuechange.ShortName > 1 || this.valuechange.Email > 1
      || this.valuechange.Phone > 2 || this.valuechange.Street > 1 || this.valuechange.City > 1
      || this.valuechange.State > 1 || this.valuechange.Zip > 1 || this.valuechange.Alt_State > 1
      || this.valuechange.Alt_City > 1 || this.valuechange.Alt_Street > 1 || this.valuechange.Alt_Zipcode > 1) {
    
      document.getElementById("cancelmodal").click();
      
    }
    else {
    

      document.getElementById('openModal').click();


    }

  }
  //=================================== Upload image & preview image function ===================================

  onSelectFile(event) {
    this.imgSize = 0;
    this.imgType = event.target.files[0].type;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      if (event.target.files[0].size < 51200) {
        reader.onload = this.handleReaderLoaded.bind(this);
      } else {
        this.imageErr = "";
        this.imageErr = "File size should be less than 50kb";
        this.imgSize = event.target.files[0].size;
        setTimeout(() => {
          if (this.imageErr != "") {
            this.imageErr = "";
          }
        }, 5000);

      }
    }
  }

  base64textString: any = "";
  handleReaderLoaded(readerEvt) {
    this.agencyLogoShow = true;
    this.Agency.agencyLogo = readerEvt.target.result;
    var binaryString = readerEvt.target.result;
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();

    }

  }

  //============================================get agency overall drop down============//
  getOverallAgencyDropDown() {

    this.httpService.getOverAllAgency().subscribe((data: AgencyList[]) => {
      this.global.globalAgencyDropDown = [];
      this.global.globalAgencyDropDown = data;
    })
  }

  filterchange() {

    this.ListSendBO.field = "AgencyName";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = this.SearchText;
    this.ListSendBO.type = "string"
    this.ListSendBO.statusLid = parseInt(this.agencyFilter.toString());
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.getAgencyList();
  }
  ////////////////////////////////saveServiceAndDCCodes/////////////////////////////////

  saveServiceAndDCCodes(agencyId) {
    let myparams = new URLSearchParams();
    myparams.append("AgencyId", agencyId);
    this.httpService.saveServiceAndDCCodesAgency(myparams).subscribe((data: void) => {
      let result = data;
    })
  }

  ////////////=======================saveAgencySetting========================////////////////
  saveAgencySetting(agencyId) {
    let url = "api/AgencySetting/SaveAgencySettingOnAgencyCreation?";
    let myparams = new URLSearchParams();
    myparams.append("AgencyId", agencyId);
   // myparams.append("AgencyCode", this.Agency.agencyCode.toString());
    myparams.append("AgencyCode", 'ANHC');
    myparams.append("OverallFixedHrs", '270');
    this.httpService.saveAgencySettingUser(myparams).subscribe((data: void) => {
      let result = data;
    })
  }
  //============================== Tooltip =========================================================//
  headerCellInfo(args) {

    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({
      content: toolcontent
    });
    tooltip.appendTo(args.node);

  }
  tooltip(args: QueryCellInfoEventArgs) {
    if (args.column.field != null) {
      if (args.data[args.column.field] != null) {
        const tooltip: Tooltip = new Tooltip({
          content: args.data[args.column.field].toString(),
          position: 'RightCenter',
        }, args.cell as HTMLTableCellElement);
      }
    }
  }

  omit_special_char(event) {
    var k;

    k = event.charCode;  //         k = event.keyCode;  (Both can be used)



    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  checkfirstLetter(event, agencycode) {
    if (agencycode != undefined) {
      let char = agencycode.toLowerCase();

      if (char.charAt(0) && !(char >= 'a' && char <= 'z')) {
        //  this.Agency.agencyCode ="";
        this.alphaErr = true;

      }

    }
    else {
      this.alphaErr = false;
    }
    //   var k;  
    //   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
  }

  getSample() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    params.append("Expired", '30');
    this.httpService.getsample(params).subscribe((data: agencyStatusList[]) => {


    });
  }


  // ==============================================================================

  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      this.ColumnArray = JSON.parse(data.column)[0].Agency.Columns;
     
      let showcol = JSON.parse(data.column)[0].Agency.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Agency.HideColumns
    

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Agency.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Name') {

          const column = this.grid.getColumnByField('agencyName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Code') {

          const column1 = this.grid.getColumnByField('agencyCode'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Email') {

          const column = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Phone') {

          const column = this.grid.getColumnByField('phone'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Street') {

          const column = this.grid.getColumnByField('street'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'City') {

          const column = this.grid.getColumnByField('city'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'State') {

          const column = this.grid.getColumnByField('state'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Zip Code') {

          const column = this.grid.getColumnByField('zipCode'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Status') {

          const column = this.grid.getColumnByField('status_Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Action') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });
  }
  SaveColumnwidth() {
    console.log(this.arraycol,"arraycol===");
    
    this.arraycol[0].Agency.Columns = this.ColumnArray;
    this.arraycol[0].Agency.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }


  onResize(args) {
    const column = this.grid.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }
}



