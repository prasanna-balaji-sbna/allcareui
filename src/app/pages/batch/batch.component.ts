import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { generalservice } from 'src/app/services/general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BatchService } from './batch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from 'src/app/global/global.component';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { groupList, PayorList, getBatchFilter, batchList, StatusList, EmployeeList, ClientList, ClaimDetailChild, sortingObj, ClearinghouseList, CompanyList, Proclaim, ResubmissionList, ClaimServiceLine, GenderList, BillingClaimWithDetailBO, ClaimDetailBO, BatchFileBO, SaveBatchFileNewReturnBO, SaveBatchFileNewBO, Invoice837P, BatchFileIdList, AmountInfo, Getbatchfile, claimDetailsBO, PaymentInfo } from './batch.model';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter, GridModel, DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { GridComponent, DetailRowService, SelectionService, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DataUtil } from '@syncfusion/ej2-data';
import { IMyDpOptions, IMyInputFieldChanged, IMyDateModel } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { ZipcodeDetail } from '../agency/agency.model';
import { ColumnChangeBO, columnWidth, WhereCondition } from '../icd10/icd10.model';
import { Observable } from 'rxjs';
import { GetHTTPServiceBatch } from './batchListData.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GetHTTPServiceBatchActive } from './batchactiveData.service';
import { GetHTTPServiceViewbatch } from './batchdataviewbatch.service';


@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DetailRowService, SelectionService],
  styles: [`.e-detailcell .e-grid .e-headercontent .e-headercell,.e-detailcell .e-grid .e-detailheadercell {
    background-color: green;
}
.e-grid .e-headercell,.e-grid .e-detailheadercell  {
    background-color: rgba(0,66,144,1.00);
}

.e-detailcell  .e-detailcell .e-grid .e-headercontent .e-headercell,.e-detailcell  .e-detailcell .e-grid .e-detailheadercell { 
  background-color:  yellow; 
}
.btnclass 
{
  background-color: rgba(0,66,144,1.00);
  text-transform: none;
  font-size:13px;
}
.e-grid .e-rowcell
{
  padding: 4px 6px;
}
.below-30
{
  color:  red;
}
.disablecheckbox { 
  pointer-events: none; 
  opacity: 0.5; 
}
kendo-pdf-export {
  font-family: "Exo", sans-serif;
  font-size: 10px;
}
`],
  encapsulation: ViewEncapsulation.None

})
export class BatchComponent implements OnInit {
  ////////////============================ dropdown initialization================//////////
  groupList: groupList[];
  payorList: PayorList[];
  batchList: batchList = new batchList();
  claimWithoutBatch: any = [];
  claimWithActiveBatch: any = [];
  BatchchildData: claimDetailsBO[] = [];
  batchData: BatchFileBO[] = [];
  employeelists: EmployeeList[];
  companyList: CompanyList[];
  clientlist: ClientList[];
  getBatchFilterList: getBatchFilter = new getBatchFilter();
  genderList: GenderList[];
  claimmasterId: number = null;
  BatchNumber: number = null;
  BatchFileIdList: any = [];
  BatchFileActiveIdList:any=[];
  SelectAllIdList: any = [];
  SelectAllActiveIdList: any = [];
  statusList: StatusList[];
  ResubmissionList: ResubmissionList[];
  showEditorView: boolean = false;
  update: boolean = false;
  selectAll: boolean;
  selectAllActive:boolean;
  ClaimMasterId: number = 0;

  ProfessionClaimList: Proclaim;


  isViewBatchDetails: boolean = false;
  isCreateBatchDetails: boolean = false;
  view837: boolean = false;
  today = new Date().toLocaleDateString();
  ClaimServiceLineList: ClaimServiceLine = new ClaimServiceLine();
  deleteError: any = "";
  deleteAlert: boolean = false;
  selectAllValue: boolean = false;
  selectAllActiveValue :boolean = false;
  //////////===============Create batch initializations===========================//////
  CreatedBatchList: SaveBatchFileNewReturnBO = new SaveBatchFileNewReturnBO();
  invoicelist: Invoice837P = new Invoice837P();
  ///////////////================Column chooser initializations=================////////
  @ViewChild('childtemplatedataws') public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('gridactive') public gridactive: GridComponent;
  @ViewChild('gridarchive') public gridarchive: GridComponent;
  @ViewChild('gridviewbatch') public gridviewbatch: GridComponent;

  @ViewChild('pdflist') pdflist;

  public childGrid: GridModel;
  public BatchchildGrid: GridModel;
  claimWithBatch: BillingClaimWithDetailBO[];
  parentData: BillingClaimWithDetailBO[];
  childData: ClaimDetailChild[];
  amountDetail: AmountInfo = new AmountInfo();
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  initialPage: object;
  filterOptions: FilterSettingsModel;
  filter: IFilter;
  TotalCount: number;
  pagshort: sortingObj = new sortingObj();
  ServicedatechangeDate: number = 0;
  Profession: boolean = false;
  TemppClientList: any = []
  loadingview: boolean = false;
  public selectOptions: Object;
  public checkparams;
  deletionId: number = 0;
  Markaspaidlist:PaymentInfo=new PaymentInfo();

  ///=======================resize===============///
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray_ready: columnWidth[]
  ColumnArray_active: columnWidth[]
  ColumnArray_archive: columnWidth[]
  ColumnArray_bachview:columnWidth[]
  ///////////////////////////////////////////FormatOptions/////////////////////////////////////
  public formatOptions: object;
  public formatPhoneNumber: object;
  ////////////////date picker ////////////////////////////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true,
    // height:'30px',
    //width:'200px',
    //selectorHeight:'30px',
    //selectorWidth:'200px',

  };
  //////////////=================Filter =================================///////////////////
  //////////==================Filter===============================================////////////////////

  ListSendBO: getBatchFilter = new getBatchFilter();
  batchfileview: Getbatchfile = new Getbatchfile();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  type: string = "";


  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  public filterSettings: object;
  public data: Observable<DataStateChangeEventArgs>;
  public dataactive: Observable<DataStateChangeEventArgs>;
  public batchfile: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  UserConfirmDOBDate: number = 0;
  gender: string;

  ActiveTab: boolean = false;
  selecctedTab = "Ready to bill";
  ActiveStatus: any = []
  loading: boolean = false;
  /*Status drop down */
  public dropdata: string[];
  public exportdatadata:string[]=['Yes','No'];
  public resumissiondropdata:string[]
  public height = '220px';
  markAsPaidForm:FormGroup;
  // @ViewChild('main') main: ElementRef;
  constructor(
    private datePipe: DatePipe, public http: HttpClient, private formBuilder: FormBuilder, @Inject(GetHTTPServiceBatch) public gethttp: GetHTTPServiceBatch,
    @Inject(GetHTTPServiceBatchActive) public gethttpactive: GetHTTPServiceBatchActive, private ref: ChangeDetectorRef,
    public global: GlobalComponent, public httpService: BatchService, private ngxService: NgxUiLoaderService,
    public toastrService: ToastrService, private modalService: NgbModal,
    public general: generalservice, @Inject(GetHTTPServiceViewbatch) public gethttpviewbatch: GetHTTPServiceViewbatch, @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef) {
   this.markAsPaidForm=this.formBuilder.group({
    mapaiddate:["", Validators.required],
    mapaidAmount:[""]
   })

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);



    // debugger;

    this.data = gethttp;
    this.dataactive = gethttpactive;
    this.dataactive = gethttpactive;
    this.batchfile = gethttpviewbatch;


  }

  ngOnInit(): void {
    // this.CreatedBatchList = new SaveBatchFileNewReturnBO();
    this.CreatedBatchList.invoice837P = this.invoicelist;
    this.getGroupList();
    // this.getClaimWithoutBatch();
    this.getStatus();
    this.batchcreate();
    this.getemployee();
    this.getClient();
    this.getGender();
    this.getResubmissionCode();
this.getColumnwidth();
    // this.filterOptions = { type: 'Excel' };
    // this.filter = {
    //   type: 'Excel'
    // };
    // if(this.global.globalAgencyId!=0){
    this.getStatusClaim();
    // }
    this.filterSettings = { type: 'Menu' };
    //  //console.log(this.CreatedBatchList);

    this.checkparams =
    {
      checked: false
    }

    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[2], pageSizes: this.pageSizes };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };

    this.selectOptions = { persistSelection: true };

    this.childGrid = {
      dataSource: this.childData,
      queryString: 'id',
      //allowSorting: true,
      //allowPaging: false,     
      editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

      columns: [
        //{ field: 'lineStatus', headerText: 'Line Status', width: 75, },
        { field: 'serviceDate', headerText: 'Service Date', width: 100 },
        //{ field: 'dailyHours', headerText: 'Daily Hours', width: 80 },
        { field: 'procedureCode', headerText: 'Procedure Code', width: 100 },
        { field: 'moD1', headerText: 'Mod 1', width: 50 },
        { field: 'moD2', headerText: 'Mod 2', width: 50 },
        { field: 'moD3', headerText: 'Mod 3', width: 50 },
        { field: 'service_Item_Charge_Amount', headerText: 'Rate', width: 100 },
        { field: 'service_Unit_Quantity', headerText: 'Quantity', width: 135 },
        { field: 'service_Unit_Type', headerText: 'Billing Unit', width: 110 }
      ]
    };
    this.BatchchildGrid = {
      dataSource: this.BatchchildData,
      queryString: 'id',

      load() {
        this.registeredTemplate = {};   // set registertemplate value as empty in load event
      },
      editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

      columns: [
        { field: 'claimMasterId', headerText: 'claim Master Id', width: 100 },
        { field: 'claimId', headerText: 'Claim Id', width: 110 },
        { headerText: 'Edit', width: 50, template: this.childtemplate }
      ]
    };
  }

  //////////////////////////////view child //////////////////////////////////////////////////////////////////

  ngAfterViewInit() {
    ////console.log(this.childtemplate)
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }
  // =================================== data change event=====================///////
  selectedId: any = [1, 2]
  selecteActivedId: any = [1, 2]
  public dataStateChange(state): void {
    console.log("state.action.rows", state);
    this.type = (state.action.requestType).toString();


    //  console.log(" this.grid.selectRow(0);", this.grid.selectRowsByRange(0,this.pagshort.itemperpage));

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
      //       if (state.action.currentFilterObject.field == "status_Name") {
      // ////console.log("Status",state.action.currentFilterObject.field);

      //         this.ListSendBO.value = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
      //         this.ListSendBO.field = "statusLid";
      //         this.ListSendBO.statusLid = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
      //         this.ListSendBO.type = "number";
      //       }
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "ClientName";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }
    if (this.selecctedTab == "Active") {
      console.log(this.ListSendBO,"list");

      this.getActiveClaimWithoutBatch();
    }
    else { this.getClaimWithoutBatch(); }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        console.log("paging");
        
        if(this.selecctedTab == "Active")
        {
          if(this.arraycol[0].Claims_active.Pagesize!=state.take)
          {
            this.arraycol[0].Claims_active.Pagesize = state.take
            this.SaveColumnwidth();
          
          }
        }
        else
        if(this.selecctedTab == "Ready to bill")
        {
          if(this.arraycol[0].Claims_readytobill.Pagesize!=state.take)
          {
            this.arraycol[0].Claims_readytobill.Pagesize = state.take
            this.SaveColumnwidth();
          }
        }
        else   if(this.selecctedTab == "Archive")
        {
          if(this.arraycol[0].Claims_archive.Pagesize!=state.take)
          {
            this.arraycol[0].Claims_archive.Pagesize = state.take
            this.SaveColumnwidth();
          }
        }
        // else{
        //   if(this.arraycol[0].BatchDetail.Pagesize!=state.take)
        //   {
        //     this.arraycol[0].BatchDetail.Pagesize = state.take
        //     this.SaveColumnwidthViewbatch();
        //   }
        // }
       
      
         
        // }

      }
    
    }
    
  }
  public dataStateChangeActive(state): void {
    console.log("state.action.rows", state);
    this.type = (state.action.requestType).toString();


    //  console.log(" this.grid.selectRow(0);", this.grid.selectRowsByRange(0,this.pagshort.itemperpage));

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
      //       if (state.action.currentFilterObject.field == "status_Name") {
      // //console.log("Status",state.action.currentFilterObject.field);

      //         this.ListSendBO.value = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
      //         this.ListSendBO.field = "statusLid";
      //         this.ListSendBO.statusLid = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
      //         this.ListSendBO.type = "number";
      //       }
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "ClientName";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }
    if (this.selecctedTab == "Active") {
      ////console.log(this.selecctedTab);

      this.getActiveClaimWithoutBatch();
    }
    else { this.getClaimWithoutBatch(); }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        console.log("paging");
        
       
          if(this.arraycol[0].Claims_active.Pagesize!=state.take)
          {
            this.arraycol[0].Claims_active.Pagesize = state.take
            this.SaveColumnwidth();
          }
        
       
        
        // else   if(this.selecctedTab == "Archive")
        // {
        //   if(this.arraycol[0].Claims_archive.Pagesize!=state.take)
        //   {
        //     this.arraycol[0].Claims_archive.Pagesize = state.take
        //     this.SaveColumnwidth();
        //   }
        // }
        // else{
        //   if(this.arraycol[0].BatchDetail.Pagesize!=state.take)
        //   {
        //     this.arraycol[0].BatchDetail.Pagesize = state.take
        //     this.SaveColumnwidthViewbatch();
        //   }
        // }
       
      
         
        // }

      }
    
    }
    
  }
  // =================================== data change  Viewbatch event=====================///////
  public dataStateChangeViewbatch(state): void {
    ////console.log("Stats chage", state);
    this.type = (state.action.requestType).toString();
    //console.log(this.batchfileview,"type");

    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.batchfileview.orderColumn = state.sorted[0].name;
        this.batchfileview.orderType = state.sorted[0].direction === 'descending' ? 'desc' : 'asc';
      }
    }
    if (this.type == "filtering" && state.action.action != "clearFilter") {
      this.batchfileview.field = state.action.currentFilterObject.field;
      this.batchfileview.matchCase = state.action.currentFilterObject.matchCase;
      this.batchfileview.operator = state.action.currentFilterObject.operator;
      this.batchfileview.value = state.action.currentFilterObject.value;
      if (this.batchfileview.type == "number") {


        this.batchfileview.value = state.action.currentFilterObject.value.toString();
        this.batchfileview.field = state.action.currentFilterObject.field;


      }
      else {
        this.batchfileview.value = state.action.currentFilterObject.value;
        this.batchfileview.field = state.action.currentFilterObject.field;
      }
      if (this.batchfileview.type == "date") {
        ////console.log(state.action.currentFilterObject.value)
        this.batchfileview.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.batchfileview.field = state.action.currentFilterObject.field;
      }
      else {
        this.batchfileview.value = state.action.currentFilterObject.value;
        this.batchfileview.field = state.action.currentFilterObject.field;
      }
      //       if (state.action.currentFilterObject.field == "status_Name") {
      // //console.log("Status",state.action.currentFilterObject.field);

      //         this.ListSendBO.value = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
      //         this.ListSendBO.field = "statusLid";
      //         this.ListSendBO.statusLid = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
      //         this.ListSendBO.type = "number";
      //       }
      this.batchfileview.matchCase = state.action.currentFilterObject.matchCase;
      this.batchfileview.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.batchfileview.field = "Batchno";
        this.batchfileview.matchCase = false;
        this.batchfileview.operator = "startswith";
        this.batchfileview.value = "";
      }
    }
console.log("datastate");

    this.getBatchDetail()
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        console.log("paging");
        
      
        
          if(this.arraycol[0].BatchDetail.Pagesize!=state.take)
          {
            this.arraycol[0].BatchDetail.Pagesize = state.take
            this.SaveColumnwidthViewbatch();
          }
        }
       
      
         
        // }

      }
    
  
    
  }
  selectTab(event) {
    ////console.log(event);
    
this.getColumnwidth();
    if (event.target.innerText == "Ready to bill") {
      
      /* Filter value reset for sorting and filtering */

      // this.ListSendBO=new getBatchFilter();
      this.ListSendBO.orderColumn="ClientName";
      this.ListSendBO.orderType="asc";
      this.ListSendBO.field="ClientName";
      this.ListSendBO.value="";
      this.ListSendBO.operator="startswith";
      this.ListSendBO.type="";
      this.ListSendBO.pageitem=20;
      this.ListSendBO.currentpageno=1;
      this.selecctedTab = event.target.innerText
      ////console.log(this.statusList);
      ////console.log(this.selecctedTab);


      this.selectAll = false
      this.selectAllActive=false;
      if (this.statusList.length != 0) {
        this.getBatchFilterList.statusLid = this.statusList.filter(s => s.label == "READYTOBILL")[0].Key;
        this.setDefaultstatusval(this.statusList.filter(s => s.label == "READYTOBILL")[0].Key);
        //this.claimWithoutBatch=[];
        ////console.log(this.getBatchFilterList.statusLid)
        // this.getClaimWithoutBatch();
        if (this.claimWithoutBatch.length != 0) {
          if (this.claimWithoutBatch[0].claimStatusLid != this.getBatchFilterList.statusLid) {
            this.claimWithoutBatch = [];
          }
        }

      }
      if ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null &&
        this.getBatchFilterList.clientId != undefined) || (this.getBatchFilterList.employeeId != '' &&
          this.getBatchFilterList.employeeId != null && this.getBatchFilterList.employeeId != null) ||
        (this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null &&
          this.getBatchFilterList.groupId != null) || (this.getBatchFilterList.payorId != '' &&
            this.getBatchFilterList.payorId != null && this.getBatchFilterList.payorId != null)) {
        this.getClaimWithoutBatch()
      }
      else {

        this.grid.dataSource = "";
      }
    }
    if (event.target.innerHTML == "Active") {
      this.ListSendBO.orderColumn="ClientName";
      this.ListSendBO.orderType="asc";
      this.ListSendBO.field="ClientName";
      this.ListSendBO.value="";
      this.ListSendBO.operator="startswith";
      this.ListSendBO.type="";
      this.ListSendBO.pageitem=20;
      this.ListSendBO.currentpageno=1;
      this.selecctedTab = event.target.innerHTML
      this.selectAll = false
      this.selectAllActive=false;
      this.ActiveStatus = this.statusList.filter(s => s.label == "SENTTOBILL" || s.label == "RECEIVED").map(e => e.Key);
      //////console.log(this.ActiveStatus);
      this.ActiveTab = true;
      this.setDefaultstatusval(this.statusList.filter(s => s.label == "SENTTOBILL")[0].Key);
      if (this.claimWithoutBatch.length != 0) {
        if (this.claimWithoutBatch[0].claimStatusLid != this.statusList.filter(s => s.label == "SENTTOBILL")[0].Key &&
          this.claimWithoutBatch[0].claimStatusLid != this.statusList.filter(s => s.label == "RECEIVED")[0].Key) {
          this.claimWithoutBatch = [];
        }
      }

      //////console.log("fun Active====");
      if ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null &&
        this.getBatchFilterList.clientId != undefined) || (this.getBatchFilterList.employeeId != '' &&
          this.getBatchFilterList.employeeId != null && this.getBatchFilterList.employeeId != null) ||
        (this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null &&
          this.getBatchFilterList.groupId != null) || (this.getBatchFilterList.payorId != '' &&
            this.getBatchFilterList.payorId != null && this.getBatchFilterList.payorId != null)) {
        this.getActiveClaimWithoutBatch()
      } else {

        this.gridactive.dataSource = "";
      }
      // this.getActiveClaimWithoutBatch()
    }
    if (event.target.innerHTML == "Archive") {
      this.ListSendBO.orderColumn="ClientName";
      this.ListSendBO.orderType="asc";
      this.ListSendBO.field="ClientName";
      this.ListSendBO.value="";
      this.ListSendBO.operator="startswith";
      this.ListSendBO.type="";
      this.ListSendBO.pageitem=20;
      this.ListSendBO.currentpageno=1;
      this.selectAll = false
      this.selectAllActive=false;
      this.selecctedTab = event.target.innerHTML
      this.getBatchFilterList.statusLid = this.statusList.filter(s => s.label == "ARCHIVED")[0].Key;
      this.setDefaultstatusval(this.getBatchFilterList.statusLid);
      //////console.log(this.getBatchFilterList.statusLid)
      if (this.claimWithoutBatch.length != 0) {
        if (this.claimWithoutBatch[0].claimStatusLid != this.getBatchFilterList.statusLid) {
          this.claimWithoutBatch = [];
        }
      }
      if ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null &&
        this.getBatchFilterList.clientId != undefined) || (this.getBatchFilterList.employeeId != '' &&
          this.getBatchFilterList.employeeId != null && this.getBatchFilterList.employeeId != null) ||
        (this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null &&
          this.getBatchFilterList.groupId != null) || (this.getBatchFilterList.payorId != '' &&
            this.getBatchFilterList.payorId != null && this.getBatchFilterList.payorId != null)) {
        this.getClaimWithoutBatch();
      } else {

        this.gridarchive.dataSource = "";
      }

    }
    //////console.log(this.selecctedTab);



  }
  setDefaultgroupval(data) {
    if (data == undefined) {
      this.getBatchFilterList.groupId = "";
      this.getBatchFilterList.payorId = "";
      this.payorList = [];
    }
    else {
      this.getpayorList();
    }
  }
  setDefaultpayorval(data) {
    if (data == undefined) {
      this.getBatchFilterList.payorId = "";
    }
  }

  //================================view batch details===================//
  viewBatchDetails(data) {
    this.childData = [];
    this.getClaimWithBatch(data);
    this.isViewBatchDetails = true;

  }
  closeBatchDetails() {
    this.isViewBatchDetails = false;
  }
  ViewBatchData() {
    this.isViewBatchDetails = true;
    this.getBatchDetail();
  }
  goBack() {

    this.getBatchFilterList = new getBatchFilter();
    this.isViewBatchDetails = false;
    this.isCreateBatchDetails = false;
    this.Profession = false;
    this.view837 = false;
    this.UserConfirmDOBDate = 0;
    //////console.log(this.isViewBatchDetails);

  }

  public get keepTogether(): string {
    return '';
  }

  kendopdfdownloadList() {
    this.pdflist.A4 = true,
      this.pdflist.portrait = true,
      // this.pdflist.keepTogether = ".prevent-split",
      this.pdflist.scale = 0.8,
      // this.pdflist.forcePageBreak = ".page-break",
      this.pdflist.saveAs("837Report" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());

  }
  MovetoActive(status) {

    // let obj={          
    //   ClaimMaster:this.BatchFileIdList
    // }
    this.httpService.MovetoactiveFun(this.BatchFileIdList).subscribe((data: number) => {
      this.OnApplyGetBatchDetails();
      this.BatchFileIdList = []
      this.toastrService.success('Claim has been Activated successfully!', 'Activate claim');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);

    },
      (err: HttpErrorResponse) => {
        // this.getclaimWithoutBatchErr = "";
        // this.getclaimWithoutBatchErr = err.error;
        // if (this.getclaimWithoutBatchErr != "") {
        //   setTimeout(() => {
        //     this.getclaimWithoutBatchErr = "";
        //   }, 6000);
        // }
      })
  }
  getActiveClaimWithoutBatch() {
    this.claimWithoutBatch = [];    
      


    let obj = new getBatchFilter();
    // this.ngxService.start()
    this.loading = true
    this.ListSendBO.employeeId = ((this.getBatchFilterList.employeeId != '' && this.getBatchFilterList.employeeId != null) && this.getBatchFilterList.employeeId != undefined) ? parseInt(this.getBatchFilterList.employeeId) : 0;
    this.ListSendBO.clientId = ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null) && this.getBatchFilterList.clientId != undefined) ? parseInt(this.getBatchFilterList.clientId) : 0;
    this.ListSendBO.groupId = ((this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null) && this.getBatchFilterList.groupId != undefined) ? parseInt(this.getBatchFilterList.groupId) : 0;
    this.ListSendBO.payorId = ((this.getBatchFilterList.payorId != '' && this.getBatchFilterList.payorId != null) && this.getBatchFilterList.payorId != undefined) ? parseInt(this.getBatchFilterList.payorId) : 0;
    this.ListSendBO.companyId = ((this.getBatchFilterList.companyId != '' && this.getBatchFilterList.companyId != null) && this.getBatchFilterList.companyId != undefined) ? parseInt(this.getBatchFilterList.companyId) : 0;
    this.ListSendBO.statusLid = this.ActiveStatus,
      this.ListSendBO.agencyId = parseInt(this.global.globalAgencyId);
      this.ListSendBO.resubmissionLid= ((this.getBatchFilterList.resubmissionLid != '' && this.getBatchFilterList.resubmissionLid != null) && this.getBatchFilterList.resubmissionLid != undefined) ? parseInt(this.getBatchFilterList.resubmissionLid) : 0;
     setTimeout(() => {
       
      if(this.selecctedTab =='Active')
      {

        this.ListSendBO.pageitem =this.gridactive.pageSettings.pageSize;
      }
   
    console.log(this.ListSendBO,"list");
    this.gethttpactive.execute(this.ListSendBO);





     }, 300); 
    
    this.setDefaultstatusval(this.statusList.filter(s => s.label == "SENTTOBILL")[0].Key);
    ////console.log(" this.gethttp.", this.data);
    // this.setDefaultstatusval(this.getBatchFilterList.statusLid);
    this.dataactive.subscribe((data: any) => {
      //console.log(this.getBatchFilterList.statusLid);
      //console.log(data.result, "data=======");
      // let val = this.gethttpactive.getClaimdata();
      // //console.log(val);
      this.claimWithActiveBatch = data.result;
      this.SelectAllActiveIdList = data.idList;
      this.selecteActivedId = [];
      this.BatchFileIdList= [];
      if (this.selectAllActiveValue) {
        this.claimWithActiveBatch.forEach((element, index) => {
          this.selecteActivedId.push(index);
        });
        //console.log("this.selectedId", this.selecteActivedId);
        setTimeout(() => {
          this.gridactive.selectionModule.selectRows(this.selecteActivedId);
        }, 1000);
        this.BatchFileIdList = this.SelectAllActiveIdList;
      }
      else
      {
        // if(this.tempbatchdata.length!=0)
        // {
        //   this.claimWithActiveBatch.forEach((element, index) => {
            
        //     this.selecteActivedId.push(index);
        //   });
        // }
        this.BatchFileIdList = []
      }
      console.log(" this.claimWithoutBatch========", this.BatchFileIdList);


     
    },
      (err: HttpErrorResponse) => {
        // this.getclaimWithoutBatchErr = "";
        // this.getclaimWithoutBatchErr = err.error;
        // if (this.getclaimWithoutBatchErr != "") {
        //   setTimeout(() => {
        //     this.getclaimWithoutBatchErr = "";
        //   }, 8000);
        // }

      })
    ////console.log("claim===========", this.claimWithoutBatch);

    // this.httpService.getActiveClaimWithoutBatchFun(obj).subscribe((data: number) => {
    //   this.claimWithoutBatch = DataUtil.parse.parseJson(data);
    //   this.BatchFileIdList = []
    //   //  this.setDefaultstatusval(this.getBatchFilterList.statusLid);
    // },
    // (err: HttpError/Response) => {
    // this.getclaimWithoutBatchErr = "";
    // this.getclaimWithoutBatchErr = err.error;
    // if (this.getclaimWithoutBatchErr != "") {
    //   setTimeout(() => {
    //     this.getclaimWithoutBatchErr = "";
    //   }, 8000);
    // }

    // })
  }
  ///////////===================Move to archive =====================================////////////////////
  MovetoArchive(status) {
    // let obj={          
    //   ClaimMaster:this.BatchFileIdList
    // }
    ////console.log(this.BatchFileIdList);

    this.httpService.MovetoarchiveFun(this.BatchFileIdList).subscribe((data: number) => {
      this.getActiveClaimWithoutBatch();
      this.BatchFileIdList = [];
      this.toastrService.success('Claim has been archived successfully!', 'Archive claim');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);



    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(err.error, 'error');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      })
  }
  reexport(status) {
    // let obj={          
    //   ClaimMaster:this.BatchFileIdList
    // }
    ////console.log(this.BatchFileIdList);

    this.httpService.reexport(this.BatchFileIdList).subscribe((data: number) => {
      this.getActiveClaimWithoutBatch();
      this.BatchFileIdList = [];
      this.toastrService.success('Claim has been Re-Exported successfully!', 'Claim Exported');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);



    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(err.error, 'error');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      })
  }
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  showarchive() {

    this.gridarchive.columnChooserModule.openColumnChooser();
  }
  showactive() {

    this.gridactive.columnChooserModule.openColumnChooser();
  }

  checkOverallData() {
    if (this.getBatchFilterList.companyId == "" && this.getBatchFilterList.statusLid == ""
      && this.getBatchFilterList.groupId == "" && this.getBatchFilterList.payorId == ""
      && this.getBatchFilterList.clientId == "" && this.getBatchFilterList.employeeId == "") {
      // this.claimWithoutBatch = [];
    }
  }
  ///////////========================Get Group payor list==================================//////////////////
  getGroupList() {
    let param = new URLSearchParams();
    param.append("Code", "GROUP");
    param.append("agencyId", this.global.globalAgencyId);
    param.append("userId", this.global.userID);
    this.httpService.getgroupList(param).subscribe((data: groupList[]) => {
      this.groupList = data;
      this.groupList.forEach(element => {
        element.label = element.Value,
          element.value = element.Key.toString();
        // this.ngxService.stop()
      })

    })
  }

  ///////////========================Get payor list==================================//////////////////
  getpayorList() {
    let param = new URLSearchParams();
    let GroupId: number = ((this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null) && this.getBatchFilterList.groupId != undefined) ? +this.getBatchFilterList.groupId : 0
    ////console.log(GroupId);

    param.append("AgencyId", this.global.globalAgencyId);
    param.append("GroupId", GroupId.toString());
    this.httpService.getPayorList(param).subscribe((data: groupList[]) => {
      this.payorList = data;
      ////console.log(data);

      this.payorList.forEach(element => {
        element.label = element.Value,
          element.value = element.Key.toString();
      })

    })
  }

  /////======================================Gender Lov========================================////
  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getgroupList(params).subscribe((data: groupList[]) => {

      this.genderList = data;
    }, err => {
      //alert("err");
    })
  }

  OnApplyGetBatchDetails() {
    this.selectAll = false;
    this.selectAllActive=false;
    ////console.log(this.selecctedTab)
    if (this.selecctedTab == "Active") {
      this.showEditorView = false;
      this.getActiveClaimWithoutBatch();
    }

    else if (this.selecctedTab == "Archive") {
      this.update = true;
      this.getClaimWithoutBatch();
      //console.log( this.update)
    }
    else { this.getClaimWithoutBatch(); }

  }
  SendClaimtoES() {
    if (this.getBatchFilterList.statusLid == '' || this.getBatchFilterList.statusLid == null) {
      this.getBatchFilterList.statusLid = this.statusList[0].Key;
    }
    let url = "api/ClaimMaster/getClaimforES";
    // let obj = new getBatchFilter();
    // this.ListSendBO.employeeId = ((this.getBatchFilterList.employeeId != '' && this.getBatchFilterList.employeeId != null) && this.getBatchFilterList.employeeId != undefined) ? parseInt(this.getBatchFilterList.employeeId) : 0;
    // this.ListSendBO.clientId = ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null) && this.getBatchFilterList.clientId != undefined) ? parseInt(this.getBatchFilterList.clientId) : 0;
    // this.ListSendBO.groupId = ((this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null) && this.getBatchFilterList.groupId != undefined) ? parseInt(this.getBatchFilterList.groupId) : 0;
    // this.ListSendBO.payorId = ((this.getBatchFilterList.payorId != '' && this.getBatchFilterList.payorId != null) && this.getBatchFilterList.payorId != undefined) ? parseInt(this.getBatchFilterList.payorId) : 0;
    // this.ListSendBO.companyId = ((this.getBatchFilterList.companyId != '' && this.getBatchFilterList.companyId != null) && this.getBatchFilterList.companyId != undefined) ? parseInt(this.getBatchFilterList.companyId) : 0;
    // this.ListSendBO.statusLid = ((this.getBatchFilterList.statusLid != '' && this.getBatchFilterList.statusLid != null) && this.getBatchFilterList.statusLid != undefined) ? parseInt(this.getBatchFilterList.statusLid) : 0;
    // this.ListSendBO.agencyId = parseInt(this.global.globalAgencyId);
    this.http.get(url).subscribe(data => {

    })
  }
  getClaimWithoutBatch() {
    // this.ngxService.start()
    this.claimWithoutBatch = [];
    ////////console.log(this.statusList.length);
    if (this.getBatchFilterList.statusLid == '' || this.getBatchFilterList.statusLid == null) {
      this.getBatchFilterList.statusLid = this.statusList[0].Key;
    }
    this.loading = true
    let url = "api/ClaimMaster/getBillingClaimWithoutBatch";
    let obj = new getBatchFilter();
    this.ListSendBO.employeeId = ((this.getBatchFilterList.employeeId != '' && this.getBatchFilterList.employeeId != null) && this.getBatchFilterList.employeeId != undefined) ? parseInt(this.getBatchFilterList.employeeId) : 0;
    this.ListSendBO.clientId = ((this.getBatchFilterList.clientId != '' && this.getBatchFilterList.clientId != null) && this.getBatchFilterList.clientId != undefined) ? parseInt(this.getBatchFilterList.clientId) : 0;
    this.ListSendBO.groupId = ((this.getBatchFilterList.groupId != '' && this.getBatchFilterList.groupId != null) && this.getBatchFilterList.groupId != undefined) ? parseInt(this.getBatchFilterList.groupId) : 0;
    this.ListSendBO.payorId = ((this.getBatchFilterList.payorId != '' && this.getBatchFilterList.payorId != null) && this.getBatchFilterList.payorId != undefined) ? parseInt(this.getBatchFilterList.payorId) : 0;
    this.ListSendBO.companyId = ((this.getBatchFilterList.companyId != '' && this.getBatchFilterList.companyId != null) && this.getBatchFilterList.companyId != undefined) ? parseInt(this.getBatchFilterList.companyId) : 0;
    this.ListSendBO.statusLid = ((this.getBatchFilterList.statusLid != '' && this.getBatchFilterList.statusLid != null) && this.getBatchFilterList.statusLid != undefined) ? parseInt(this.getBatchFilterList.statusLid) : 0;
    this.ListSendBO.agencyId = parseInt(this.global.globalAgencyId);
    this.ListSendBO.resubmissionLid= ((this.getBatchFilterList.resubmissionLid != '' && this.getBatchFilterList.resubmissionLid != null) && this.getBatchFilterList.resubmissionLid != undefined) ? parseInt(this.getBatchFilterList.resubmissionLid) : 0;
    setTimeout(() => {
      if(this.selecctedTab=='Archive')
      {
        this.ListSendBO.pageitem= this.gridarchive.pageSettings.pageSize;
      }
      else if(this.selecctedTab=="Active")
      {
        this.ListSendBO.pageitem=this.gridactive.pageSettings.pageSize;
      }
      else{
        console.log(this.grid)
        this.ListSendBO.pageitem= this.grid.pageSettings.pageSize;
      }
      this.gethttp.execute(this.ListSendBO);
    }, 300);
   
    ////console.log(" this.gethttp.", this.data);
    this.setDefaultstatusval(this.getBatchFilterList.statusLid);
  
    this.data.subscribe((data: any) => {
      //console.log("data======", data);
     
      this.claimWithoutBatch = data.result;
      this.SelectAllIdList = data.idList;
      this.selectedId = [];
      this.BatchFileIdList = [];
      if (this.selectAllValue) {
        this.claimWithoutBatch.forEach((element, index) => {
          this.selectedId.push(index);
        });
        console.log("this.selectedId", this.selectedId);
        setTimeout(() => {
          this.grid.selectionModule.selectRows(this.selectedId);
        }, 1000);
        this.BatchFileIdList = this.SelectAllIdList;
      }
    })
  }

  getStatus() {
    let params = new URLSearchParams();
    params.append("Code", "BATCHCLAIMSTATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatusList(params).subscribe((data: StatusList[]) => {
      this.statusList = data;
      this.statusList.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      })
      this.getBatchFilterList.statusLid = this.statusList[0].Key;
    }, err => {
      //alert("err");
    })
  }



  getBatchDetail() {

    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId)
    // this.ngxService.start();
    this.loadingview = true;
    this.batchfileview.AgencyId = parseInt(this.global.globalAgencyId);
    // this.batchfileview.pageitem= this.gridviewbatch.pageSettings.pageSize;
    this.gethttpviewbatch.execute(this.batchfileview);
    let val=0
    this.batchfile.subscribe((data: any) => {
      val++;
      // this.claimWithoutBatch = this.gethttp.getClaimdata();
      this.batchData = data.result;
      if (data.result.length > 0) {
        this.BatchchildData = []
        data.result.forEach(element => {
          if (element.claimDetails.length > 0) {
            element.claimDetails.forEach(element1 => {
              this.BatchchildData.push(element1)
            });
          }

        });
        if(this.batchData != null && this.batchData != undefined&&val==1)
        {
          this.getColumnwidthViewbatch();
        }
     
        console.log(this.BatchchildData)
      //   this.gridviewbatch.childGrid.dataSource = this.BatchchildData
      //  this.gridviewbatch.childGrid.columns = [
      //     { field: 'claimMasterId', headerText: 'claim Master Id', width: 100 },
      //     { field: 'claimId', headerText: 'Claim Id', width: 110 },
      //     { headerText: 'Edit', width: 50, template: this.childtemplate }
      //   ]
      //   console.log(this.BatchchildGrid);
      }


      //  this.BatchchildGrid = {
      //   dataSource: this.BatchchildData,
      //   queryString: 'id',

      //   load() {
      //     this.registeredTemplate = {};   // set registertemplate value as empty in load event
      // },
      //   editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

      //   columns: [ 
      //     { field: 'claimMasterId', headerText: 'claim Master Id', width: 100 },
      //     { field: 'claimId', headerText: 'Claim Id', width: 110 },
      //     {  headerText: 'Edit', width: 50, template: this.childtemplate }
      //   ]
      // };
      //  console.log("data======", this.batchData);

      //console.log("data======", this.batchData);

      ////console.log(" this.claimWithoutBatch========", this.claimWithoutBatch);



    })
    // this.batchData = data;
    ////console.log(data.length);

    // this.ngxService.stop();
    // },
    //   (err: HttpErrorResponse) => {
    // // this.ngxService.stop();



    //     // this.getBatchDetailErr = "";
    //     // this.getBatchDetailErr = err.error;
    //     // if (this.getBatchDetailErr != "") {
    //     //   setTimeout(() => {
    //     //     this.getBatchDetailErr = "";
    //     //   }, 8000);
    //     // }

    //   })
  }
  downloadBatchFile(batch) {
    // let url="api/?"
    // let myparams=new URLSearchParams();
    // myparams.append("",batch.filePath);
    // this.http.get(url+myparams).subscribe((data:any)=>{
    if (batch.filePath != null) {
      window.open(batch.filePath);
    }
    else {
      // this.getBatchDetailErr = "";
      // this.getBatchDetailErr = "File not found";
      // if (this.getBatchDetailErr != "") {
      //   setTimeout(() => {
      //     this.getBatchDetailErr = "";
      //   }, 6000);
      // }
    }
  }
  poenpdf2(i) {
    ////console.log(i);

    // let url=""
    // let param=new URLSearchParams();
    // param.append("id",id)
    // this.http.get(url+param).subscribe((data:any)=>{
    //    this.CreatedBatchList=data;
    this.CreatedBatchList = this.batchData[i];
    // this.dialogService.open(val)
    //  });

  }
  //=============================================View batch details==========//

  viewListData: any = {}
  viewBatchFile(list) {
    this.viewListData = list;
    this.getClaimWithBatch(this.viewListData);
    //this.getClaimWithBatchCount(this.viewListData);
    //  this.dialogService.open(viewBatch);
  }

  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getClaimWithoutBatch();
  }

  paginationChangeWithBatch(event) {
    this.pagshort.currentPgNo = event;
    this.getClaimWithBatch(this.viewListData);
  }

  getClaimWithBatch(list) {
    this.claimWithBatch = [];
    let itemperpage = 20;
    let params = new URLSearchParams();
    params.append("BatchFileId", list.id);
    params.append("CurrentPageNo", this.pagshort.currentPgNo.toString());
    params.append("PageItem", itemperpage.toString());
    this.httpService.getClaimwithbatch(params).subscribe((data: BillingClaimWithDetailBO[]) => {
      this.claimWithBatch = data;
      ////console.log(data, "whole data");
      this.claimWithBatch = data;
      this.parentData = [];
      let objArray: any = [];
      let objArray1: any = [];
      data.forEach(element => {

        let fromDate = this.datePipe.transform(element.fromDate, "MM/dd/yyyy")
        let toDate = this.datePipe.transform(element.toDate, "MM/dd/yyyy")
        let obj =
        {
          'id': element.id,
          'clientName': element.clientName,
          'insuredId': element.client_Insurance,
          'payer': element.payer_Name,
          'fromDate': fromDate,
          "employeeID": element.employeeId,
          'toDate': toDate,
          'totalHours': element.totalHours,
          'employee': element.employeeName,
          'employeeUMPI': element.employeeUMPI,
          'payorID': element.payer_ID,
          'totalAmountBilled': element.totalAmountBilled,
          'claimStatus': element.claimStatus,
          'service': element.serviceName
        }
        objArray.push(obj);
        element.claimDetail.forEach(element => {
          let serviceDate = this.datePipe.transform(element.serviceDate, "MM/dd/yyyy")
          let obj1 = {
            'id': element.id,
            'serviceDate': serviceDate,
            'procedureCode': element.service_Code,
            'moD1': element.service_Modifier_1,
            'moD2': element.service_Modifier_2,
            'moD3': element.service_Modifier_3,
            'service_Item_Charge_Amount': element.service_Item_Charge_Amount,
            'service_Unit_Quantity': element.service_Unit_Quantity,
            'service_Unit_Type': element.service_Unit_Type
          }
          this.childData.push(obj1);
        });
        this.parentData = objArray;
        this.childGrid.dataSource = this.childData;

        ////console.log("this.parentData", this.parentData);
        ////console.log("this.childData", this.childData);
      });

    },
      (err: HttpErrorResponse) => {
        // this.getClaimWithBatchErr = "";
        // this.getClaimWithBatchErr = err.error;
        // if (this.getClaimWithBatchErr != "") {
        //   setTimeout(() => {
        //     this.getClaimWithBatchErr = "";
        //   }, 8000);
        // }

      })
  }
  ////////////////======================Create Batch File======================////////////////
  createBatchFile() {
    this.global.loading = true;
    this.CreatedBatchList = new SaveBatchFileNewReturnBO();
    ////console.log("BatchFileIdList", this.BatchFileIdList)

    let obj = new SaveBatchFileNewBO();
    obj = {
      groupLid: parseInt(this.getBatchFilterList.groupId),
      clearingHouseId: parseInt(this.batchList.clearingHouseId),
      claimMaterId: this.BatchFileIdList
    }
    this.httpService.CreateBatch(obj).subscribe((data: SaveBatchFileNewReturnBO) => {
      ////console.log("data", data);
      this.BatchFileIdList = [];
      this.selectAllValue = false;
      this.OnApplyGetBatchDetails();
      this.CreatedBatchList = data;

      this.global.loading = false;
      // this.dialogService.open(view);
      ////console.log(this.CreatedBatchList.invoice837P.claimDetail837PInvoice)
      this.toastrService.success('Batch has been generated successfully!', 'Batch generated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);

      document.getElementById('spancreatebatch').click();
      this.isCreateBatchDetails = false;
      // this.getBatchDetail();
    },
      (err: HttpErrorResponse) => {

        this.toastrService.error(err.error, 'error');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        // this.getclaimWithoutBatchErr = "";
        // this.getclaimWithoutBatchErr = err.error;

        // this.global.loading = false;
        // if (this.getclaimWithoutBatchErr != "") {
        //   setTimeout(() => {
        //     this.getclaimWithoutBatchErr = "";
        //   }, 6000);
        // }
      })
  }

  ActivecreateBatchFile() {
    let count = 0;
    console.log(this.claimWithoutBatch);
    
    this.BatchFileIdList.forEach(element => {
      let val = this.claimWithActiveBatch.filter(c => c.claimMasterId == element);
      if (val[0].isExported == true) {
        count++;

      }
    });
    ////console.log(count);
    if (count > 0) {
      this.toastrService.error('Claim Already Exported');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);

      // this.getclaimWithoutBatchErr = "Claim Already Exported"
      // setTimeout(() => {
      //   this.getclaimWithoutBatchErr = ""
      // }, 1500);
    }
    else { this.createBatchFile() }
    ////console.log(count);
  }



  downloadFile(data) {
    if (data != null) {
      window.open(data);
    }
    else {
      // this.getBatchDetailErr = "";
      // this.getBatchDetailErr = "File not found";
      // if (this.getBatchDetailErr != "") {
      //   setTimeout(() => {
      //     this.getBatchDetailErr = "";
      //   }, 6000);
      // }
    }
  }

  openfile() {
    //this.view837=true;
    // this.dialogService.open(val)
  }
  ///////////////////===================numbers only===========================/////////////

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();

    }

  }
  setDefaultstatusval(data) {
    //console.log("status======", data);

    if (data == undefined) {
      this.getBatchFilterList.statusLid = "";
      this.showEditorView = false;
    }
    else {
      var checkVal = this.statusList.filter(s => s.value == data)[0];
      //console.log(this.statusList)
      //console.log("checkVal", checkVal, checkVal.label);
      if (checkVal.label == "SENTTOBILL" || checkVal.label == "ARCHIVED" || checkVal.label == "RECIVEDBILL") {
        this.showEditorView = true;
      }
      else {
        this.showEditorView = false;
      }
      if (checkVal.label == "ARCHIVED") {
        this.update = true;
      }
      else {
        this.update = false;
      }
      ////console.log(this.update)
    }
    //console.log(this.showEditorView);
    ////console.log("showEditorView=======", this.showEditorView);

  }


  //====================EMployee and client and payor lists===================//
  getemployee() {
    ////////console.log("checkkkkkkkkkkkkkkkkkkkkkkk"); 
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getEMployee(param).subscribe((data: EmployeeList[]) => {
      this.employeelists = data;
      this.employeelists.forEach(element => {
        element.label = element.Value,
          element.value = element.Key
      })

    })
  }
  getClient() {
    ////////console.log("checkkkkkkkkkkkkkkkkkkkkkkk"); 
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);

    this.httpService.getClient(param).subscribe((data: ClientList[]) => {
      ////console.log(data);

      this.clientlist = data;
      this.clientlist.forEach(element => {
        element.label = element.Value,
          element.value = element.Key
      })

    })
  }

  clearingHouseList: ClearinghouseList[];
  getClearingHouseList() {

    let myparams = new URLSearchParams();
    myparams.append("AgencyId", this.global.globalAgencyId)
    this.httpService.getClearing(myparams).subscribe((data: ClearinghouseList[]) => {
      this.clearingHouseList = data;
      this.clearingHouseList.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      })
    },
      (err: HttpErrorResponse) => {


      })
  }

  getCompanyList() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.httpService.getClearing(params).subscribe((data: ClearinghouseList[]) => {
      this.companyList = data;
      this.companyList.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      })
    },
      (err: HttpErrorResponse) => {

      })
  }
  batchcreate() {
    this.getBatchFilterList = new getBatchFilter();
    // this.isCreateBatchDetails=true;    
    this.claimWithoutBatch = [];
    this.getClearingHouseList();
    this.getCompanyList();
    this.clearList();
    // this.dialogService.open(createBatch);
  }
  clearList() {
    this.batchList = new batchList();
    this.BatchFileIdList = [];

  }
  BatchIdListCreateOnChange(data) {
    //////console.log("data.isCreateBatch", data.isCreateBatch)

    ////console.log("batchsingle===", data);
    let count = 0;
    if (data.isCreateBatch) {

      this.BatchFileIdList.push(data.claimMasterId);
      ////console.log("BatchFileIdList", this.BatchFileIdList);
      this.claimWithoutBatch.forEach(element => {
        if (!element.isCreateBatch) {
          count++;
        }

      });
      this.selectAll = count > 0 ? false : true;
    }
    else {

      this.selectAll = false;
      const index: number = this.BatchFileIdList.indexOf(data.claimMasterId);
      if (index !== -1) {
        this.BatchFileIdList.splice(index, 1);
        ////console.log("BatchFileIdList splice", this.BatchFileIdList);
      }
    }
  }
  ////////////=========================event for assigning selected record to be sent to bill==========/////////////
  //////////////=======================Checkbox change for Ready to bill tab============================////////////
  BatchCreateOnChangeForAll(args) {
    console.log("args reference", args);

    if (args.checked && args.target.classList.contains('e-checkselectall')) {
      this.selectAllValue = true;
      this.BatchFileIdList = [];
      this.BatchFileIdList = this.SelectAllIdList;
    }
    else if (args.target.classList.contains('e-checkselect')) {
      this.selectAllValue = false;
      let result = this.grid.getRowInfo(args.target)
      let count = 0;
      let data: any = [];
      data = result.rowData;
      if (args.checked) {
        this.BatchFileIdList.push(data.claimMasterId);
        this.claimWithoutBatch.forEach(element => {
          if (!element.isCreateBatch) {
            count++;
          }
        });
        this.selectAll = count > 0 ? false : true;
      }
      else {
        this.selectAll = false;
       // this.selectAllValue=false;
        const index: number = this.BatchFileIdList.indexOf(data.claimMasterId);
        if (index !== -1) {
          this.BatchFileIdList.splice(index, 1);
        }
      }
    }
    else {
      this.BatchFileIdList = [];
       this.selectAllValue=false;
    }
    console.log("Select all value",this.selectAllValue);
    
  }

  //////////////=======================Checkbox change for Active tab============================////////////
  tempbatchdata:any=[]
  BatchCreateOnChangeForAllActive(args) {
    console.log(args);

    if (args.checked && args.target.classList.contains('e-checkselectall')) {
      this.selectAllActiveValue = true;
      this.BatchFileIdList = [];
      this.BatchFileIdList = this.SelectAllActiveIdList;
    }
    else if (args.target.classList.contains('e-checkselect')) {
      this.selectAllActiveValue = false;
      let result = this.gridactive.getRowInfo(args.target)
      let count = 0;
      let data: any = [];
      data = result.rowData;
      if (args.checked) {
        this.BatchFileIdList.push(data.claimMasterId);
       
        this.claimWithActiveBatch.forEach(element => {
          if (!element.isCreateBatch) {
            count++;
          }
        });
        this.selectAllActive = count > 0 ? false : true;
        this.tempbatchdata=this.BatchFileIdList;
      }
      else {
        this.selectAllActive = false;
        this.selectAllActiveValue=false;
        const index: number = this.BatchFileIdList.indexOf(data.claimMasterId);
        
        if (index !== -1) {
          this.BatchFileIdList.splice(index, 1);
        }
        this.tempbatchdata=this.BatchFileIdList;
      }
    }
    else {
      this.BatchFileIdList = [];
       this.selectAllActiveValue=false;
    }
   

    ////console.log(this.BatchFileIdList);

    var id = 0;
    // const index: number = this.BatchFileIdList.indexOf(id);


  }

  //////////////=======================Checkbox change for Archive tab============================////////////
  BatchCreateOnChangeForAllArchive(args) {
    ////console.log(args);
    if (args.checked && args.target.classList.contains('e-checkselectall')) {
      this.BatchFileIdList = [];
      var row1: any = this.gridarchive.getSelectedRecords();
      var selectedrow = this.gridarchive.getRowInfo(args.target)
      let resultantdata: any = selectedrow.rowData;
      ////console.log("resultantdata", resultantdata)
      row1.forEach(element => {
        if (args.checked) {
          element.isCreateBatch = true;
          this.BatchFileIdList.push(element.claimMasterId);
        }
        else {
          element.isCreateBatch = false;
          const index: number = this.BatchFileIdList.indexOf(element.claimMasterId);
          if (index !== -1) {
            this.BatchFileIdList.splice(index, 1);
          }
        }

      });

      for (var i = 0; i < args.selectedRowIndexes.length; i++) {
        var row = this.gridarchive.getRowByIndex(args.selectedRowIndexes[i])
        if (!row.querySelector('.disablecheckbox')) {
          ////console.log(row1, "Row")

        }
      }
    }
    else if (args.target.classList.contains('e-checkselect')) {
      ////console.log('Row checkbox is cliked');
      let result = this.gridarchive.getRowInfo(args.target)
      ////console.log('Result========', this.gridarchive.getRowInfo(args.target));
      ////console.log('claimWithoutBatch========', this.claimWithoutBatch);
      let count = 0;
      let data: any = [];
      data = result.rowData;
      if (args.checked) {

        this.BatchFileIdList.push(data.claimMasterId);
        ////console.log("BatchFileIdList", result.rowData);
        this.claimWithoutBatch.forEach(element => {
          if (!element.isCreateBatch) {
            count++;
          }

        });
        this.selectAllActive = count > 0 ? false : true;
      }
      else {

        this.selectAllActive = false;
        const index: number = this.BatchFileIdList.indexOf(data.claimMasterId);
        if (index !== -1) {
          this.BatchFileIdList.splice(index, 1);
          ////console.log("BatchFileIdList splice", this.BatchFileIdList);
        }
      }
    }
    else {
      this.BatchFileIdList = [];

    }

    ////console.log(this.BatchFileIdList);

    var id = 0;
    // const index: number = this.BatchFileIdList.indexOf(id);


  }

  EnableProfesionClaim(data) {
    this.getResubmissionCode();
    ////console.log("Data====", data);

    this.ClaimMasterId = data.claimMasterId != undefined && data.claimMasterId != null ? data.claimMasterId : 0;
    let params = new URLSearchParams();
    params.append("ClaimMasterId", this.ClaimMasterId.toString());
    this.httpService.GetClaimViewDetail(params).subscribe((data: Proclaim) => {
      this.TemppClientList = JSON.parse(JSON.stringify(data));
      this.ProfessionClaimList = data;
      ////console.log(data);

      if (this.selecctedTab == "Active") {
   //     if (!this.ProfessionClaimList.exported) {
          this.showEditorView = true;
       // }
      }
      ////console.log("showEditorView=======", this.showEditorView);

      this.Profession = true;

      //  var checkOriginal= this.ResubmissionList.filter(re=>re.Key== this.ProfessionClaimList.resubmissionLid)[0];
      //  if(checkOriginal!=null){
      //   if(checkOriginal.Value="ORIGINAL"){
      //     this.checkOriginalSubmission=true;
      //   }
      //   else{
      //     this.checkOriginalSubmission=false;
      //     const index: number = this.ResubmissionList.indexOf(this.ProfessionClaimList.resubmissionLid);
      //     if (index !== -1) {
      //       this.ResubmissionList.splice(index, 1);
      //      //////console.log("BatchFileIdList splice", this.ResubmissionList);
      //     }
      //   }
      //  }
      this.ProfessionClaimList.subscriberDOB = this.ProfessionClaimList.subscriberDOB != null ? new Date(new Date(this.ProfessionClaimList.subscriberDOB)).toLocaleDateString() : null;
      ////console.log("ProfessionClaimList", this.ProfessionClaimList, "temp", this.TemppClientList);
    },
      (err: HttpErrorResponse) => {
        ////console.log("professionclaimerr", err.error);
        //   this.getclaimWithoutBatchErr = "";
        //   this.getclaimWithoutBatchErr = err.error;
        //   if (this.getclaimWithoutBatchErr != "") {
        //     setTimeout(function () {
        //       this.getclaimWithoutBatchErr = "";
        //     }.bind(this), 8000);
        // }
      })

  }

  getResubmissionCode() {
    let params = new URLSearchParams();
    params.append("Code", "RESUBMISSION");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getresubmissionCode(params).subscribe((data: ResubmissionList[]) => {

      this.ResubmissionList = data;
      this.resumissiondropdata=data.map(r=>r.Value);
    }, err => {
      //alert("err");
    })
  }

  CloseProfesionClaim() {
    // this.selecctedTab= "Ready to bill"
    this.Profession = false;
    this.ClaimMasterId = 0;
    // if (this.selecctedTab == "Active") {
    //   this.setDefaultstatusval(this.statusList.filter(s => s.label == "SENTTOBILL")[0].Key);
    // }
    this.update = false;
    this.OnApplyGetBatchDetails();
    // this.ActiveTab=false;


  }
  ///////////=====================date picker fun===========================================///////////////////////
  DOBdatechange(event: IMyInputFieldChanged) {
    this.UserConfirmDOBDate = 1;
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.ProfessionClaimList.subscriberDOB = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }
  onDateChanged(event: IMyDateModel) {
    this.UserConfirmDOBDate = 1;
    this.ProfessionClaimList.subscriberDOB = event.formatted;
    //  var bdate = new Date(event.formatted);
    //   if (event.formatted != "") {
    //     var timeDiff = Math.abs(Date.now() - bdate.getTime());
    //     this.ProfessionClaimList.SubscriberDOB = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

    //   }
  }

  addClaimServiceLine: boolean = true;
  addServiceLine() {
    // this.dialogService.open(val);
    this.ClaimServiceLineList = new ClaimServiceLine();
    this.addClaimServiceLine = true;
  }
  updateServiceLine(data) {
    this.addClaimServiceLine = false;
    this.ClaimServiceLineList = JSON.parse(JSON.stringify(data));
    let fromDate = this.datePipe.transform(this.ClaimServiceLineList.fromDate, "MM/dd/yyyy")

    this.ClaimServiceLineList.fromDate = new Date(fromDate).toLocaleDateString();

    if (this.ClaimServiceLineList.paidDate != null) {
      let paidDate = this.datePipe.transform(this.ClaimServiceLineList.paidDate, "MM/dd/yyyy")

      this.ClaimServiceLineList.paidDate = new Date(paidDate).toLocaleDateString();
    }
    ////console.log("this.ClaimServiceLineList update", this.ClaimServiceLineList);

  }

  onServiceDateChanged(event: IMyDateModel) {
    ////console.log("ClaimServiceLineList.fromDate", this.ClaimServiceLineList.fromDate)
    this.ServicedatechangeDate = 1;
    this.ClaimServiceLineList.fromDate = event.formatted;
  }




  ////////////====================Checkbox change Fun======================//////
  checkboxFun() {
    ////console.log(value, "value====");
    // if (!value) {
      this.showEditorView = false
    // }
    // else {
    //   this.showEditorView = true
    // }

  }
  updateProfessionalClaim(status) {
    var tempDOBDate = this.TemppClientList.subscriberDOB + 'Z';
    // let url = "api/ClaimMaster/EditClaim";
    this.ProfessionClaimList.subscriberDOB = this.UserConfirmDOBDate == 1 ? new Date(new Date(this.ProfessionClaimList.subscriberDOB).toLocaleDateString() + " " + new Date().toLocaleTimeString()) :
      new Date(tempDOBDate);
      this.ProfessionClaimList.resubmissionLid=parseInt( this.ProfessionClaimList.resubmissionLid);
    var saveList: Proclaim = JSON.parse(JSON.stringify(this.ProfessionClaimList));

    this.httpService.updateProfessionalClaim(saveList).subscribe((data: number) => {
      this.toastrService.success('Claim details has been updated successfully!', 'Claim updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      // this.selecctedTab = "Ready to bill"
      this.Profession = false;
      ////console.log(this.selecctedTab);

      this.OnApplyGetBatchDetails()
      // if (!this.ProfessionClaimList.exported) {
      //   this.showEditorView = false
      // }
      // if (this.selecctedTab == "Active") {
      //   this.setDefaultstatusval(this.statusList.filter(s => s.label == "SENTTOBILL")[0].Key);
      // }
      ////console.log("showEditorView=======", this.showEditorView);

      this.UserConfirmDOBDate = 0;
    },
      (err: HttpErrorResponse) => {

      })
  }

  saveServiceLine() {

    let obj = new ClaimServiceLine();
    if (this.addClaimServiceLine) {
      var serviceDetail = new ClaimServiceLine();
      serviceDetail = this.ProfessionClaimList.serviceDetailsList[0];


      // var formatdate=new Date(this.ClaimServiceLineList.fromDate.formatted);
      var formatdate = new Date(this.ClaimServiceLineList.fromDate);
      ////console.log(formatdate);
      obj = {
        id: 0,
        groupPayorServiceId: serviceDetail.groupPayorServiceId,
        timeSheetId: serviceDetail.timeSheetId,
        claimMasterId: serviceDetail.claimMasterId,
        fromDate: new Date(Date.UTC(formatdate.getFullYear(), formatdate.getMonth(), formatdate.getDate())).toISOString().replace("Z", ""),
        code: serviceDetail.code,
        modifier1: serviceDetail.modifier1,
        modifier2: serviceDetail.modifier2,
        modifier3: serviceDetail.modifier3,
        modifier4: serviceDetail.modifier4,
        grossCharges: null,
        totalUnits: this.ClaimServiceLineList.totalUnits,
        netCharges: this.ClaimServiceLineList.netCharges,
        paidDate: null,
        paidAmount: 0,
        //postedDate: this.ClaimServiceLineList.postedDate
      }

    }

    else {

      var ServiceFromDate;
      var PaidServiceDate;
      if (this.ServicedatechangeDate == 1) {
        var formatdateupdate = new Date(this.ClaimServiceLineList.fromDate);

        ServiceFromDate = new Date(Date.UTC(formatdateupdate.getFullYear(), formatdateupdate.getMonth(), formatdateupdate.getDate())).toISOString().replace("Z", "");
      }
      else {
        ServiceFromDate = this.ProfessionClaimList.serviceDetailsList.filter(sd => sd.id == this.ClaimServiceLineList.id)[0].fromDate + 'Z';
        ServiceFromDate = new Date(ServiceFromDate);
      }
      if (this.PaiddatechangeDate == 1 && this.ClaimServiceLineList.paidDate != null && this.ClaimServiceLineList.paidDate != undefined && this.ClaimServiceLineList.paidDate != "") {
        var paiddateupdate = new Date(this.ClaimServiceLineList.paidDate);

        PaidServiceDate = new Date(Date.UTC(paiddateupdate.getFullYear(), paiddateupdate.getMonth(), paiddateupdate.getDate())).toISOString().replace("Z", "");
      }
      else {
        if (this.ClaimServiceLineList.paidDate != null && this.ClaimServiceLineList.paidDate != undefined && this.ClaimServiceLineList.paidDate != "") {
          PaidServiceDate = this.ProfessionClaimList.serviceDetailsList.filter(sd => sd.id == this.ClaimServiceLineList.id)[0].paidDate + 'Z';
          PaidServiceDate = new Date(ServiceFromDate);
        }
        else {
          PaidServiceDate = null;
        }
      }
      obj = {
        id: this.ClaimServiceLineList.id,
        fromDate: ServiceFromDate,
        groupPayorServiceId: this.ClaimServiceLineList.groupPayorServiceId,
        timeSheetId: this.ClaimServiceLineList.timeSheetId,
        claimMasterId: this.ClaimServiceLineList.claimMasterId,
        code: this.ClaimServiceLineList.code,
        grossCharges: null,
        modifier1: this.ClaimServiceLineList.modifier1,
        modifier2: this.ClaimServiceLineList.modifier2,
        modifier3: this.ClaimServiceLineList.modifier3,
        modifier4: this.ClaimServiceLineList.modifier4,
        totalUnits: this.ClaimServiceLineList.totalUnits,
        netCharges: this.ClaimServiceLineList.netCharges,
        paidDate: PaidServiceDate,
        paidAmount: this.ClaimServiceLineList.paidAmount,
        //postedDate: this.ClaimServiceLineList.postedDate
      }
    }
    obj = JSON.parse(JSON.stringify(obj));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    };
    this.httpService.SaveServiceLine(obj).subscribe((data: number) => {
      if (this.addClaimServiceLine) {
        this.toastrService.success('Service line has been added successfully', 'Service line added');
        // this.ProfessionClaimList.totalcharges=this.ProfessionClaimList.totalcharges+this.ClaimServiceLineList.netCharges;
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        let params = new URLSearchParams();
        params.append("ClaimMasterId", this.ClaimMasterId.toString());
        this.httpService.getServiceLLineDetails(params).subscribe((data: ClaimServiceLine[]) => {
          this.ProfessionClaimList.serviceDetailsList = data;
        })
        let param = new URLSearchParams();
        param.append("ClaimMasterId", this.ClaimMasterId.toString());
        this.httpService.getClaimAmtDetails(param).subscribe((data: AmountInfo) => {
          this.ProfessionClaimList.totalcharges = data.claimTotalcharges;
          this.ProfessionClaimList.amountPaid = data.claimPaidAmount;
          this.ProfessionClaimList.balanceDue = this.ProfessionClaimList.totalcharges - this.ProfessionClaimList.amountPaid;
        })

      }
      else {
        this.toastrService.success('Service has been updated successfully', 'Service updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        let params = new URLSearchParams();
        params.append("ClaimMasterId", this.ClaimMasterId.toString());
        this.httpService.getServiceLLineDetails(params).subscribe((data: ClaimServiceLine[]) => {
          this.ProfessionClaimList.serviceDetailsList = data;
        })
        let param = new URLSearchParams();
        param.append("ClaimMasterId", this.ClaimMasterId.toString());
        this.httpService.getClaimAmtDetails(param).subscribe((data: AmountInfo) => {
          this.ProfessionClaimList.totalcharges = data.claimTotalcharges;
          this.ProfessionClaimList.amountPaid = data.claimPaidAmount;
          this.ProfessionClaimList.balanceDue = this.ProfessionClaimList.totalcharges - this.ProfessionClaimList.amountPaid;
        })
        // this.ProfessionClaimList.serviceDetailsList.forEach(element => {
        //   if (element.id == obj.id) {
        //     element = obj;
        //   }
        // });

      }
      this.ServicedatechangeDate = 0;
      //  this.EnableProfesionClaim(this.ClaimMasterId);
      this.addClaimServiceLine = false;
      document.getElementById('openModal2').click();

    },
      (err: HttpErrorResponse) => {

        this.deleteError = "";
        this.deleteError = err;
        ////console.log("this.deleteError err", err);

        if (this.deleteError != "") {
          setTimeout(() => {
            this.deleteError = "";
          }, 8000);
        }

      })
  }




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
  this.arraycol[0].Claims_readytobill.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Claims_readytobill.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });

  if (this.arraycol[0].Claims_readytobill.ShowColumns.length != count1 || this.arraycol[0].Claims_readytobill.HideColumns.length != count) {
    this.arraycol[0].Claims_readytobill.ShowColumns = showarr;
    this.arraycol[0].Claims_readytobill.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
     
       
      }
    }

    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        ////console.log("args type", this.conditionlist);
      });
    }

  }
  public test(a) {
    //console.log(a);
    this.batchfileview.type = a.columnType;


  }
  public onActionCompleteviewBatch(args) {

    //console.log("args type", args);
    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.gridviewbatch.columns.forEach(element => {
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
  this.arraycol[0].BatchDetail.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].BatchDetail.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });

  if (this.arraycol[0].BatchDetail.ShowColumns.length != count1 || this.arraycol[0].BatchDetail.HideColumns.length != count) {
    this.arraycol[0].BatchDetail.ShowColumns = showarr;
    this.arraycol[0].BatchDetail.HideColumns = hidearr;
    this.SaveColumnwidthViewbatch();
  }
}
     
       
      }
    }

    this.batchfileview.currentpageno = this.gridviewbatch.pagerModule.pagerObj.currentPage;
    this.batchfileview.pageitem = this.gridviewbatch.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      // this.batchfileview.type=args.columnType;
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        ////console.log("args type", this.conditionlist);
      });
    }
console.log(this.batchfileview,"batchfile");

  }
  public onActionCompleteActive(args) {
    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.gridactive.columns.forEach(element => {
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
  this.arraycol[0].Claims_active.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Claims_active.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });

  if (this.arraycol[0].Claims_active.ShowColumns.length != count1 || this.arraycol[0].Claims_active.HideColumns.length != count) {
    this.arraycol[0].Claims_active.ShowColumns = showarr;
    this.arraycol[0].Claims_active.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
     
       
      }
    }

    this.ListSendBO.currentpageno = this.gridactive.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.gridactive.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        ////console.log("args type", this.conditionlist);
      });
    }

  }
  public onActionCompleteArchive(args) {
    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.gridarchive.columns.forEach(element => {
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
  this.arraycol[0].Claims_archive.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Claims_archive.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });

  if (this.arraycol[0].Claims_archive.ShowColumns.length != count1 || this.arraycol[0].Claims_archive.HideColumns.length != count) {
    this.arraycol[0].Claims_archive.ShowColumns = showarr;
    this.arraycol[0].Claims_archive.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
     
       
      }
    }

    this.ListSendBO.currentpageno = this.gridarchive.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.gridarchive.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        ////console.log("args type", this.conditionlist);
      });
    }

  }

  /////////////////////////////////tab change///////////////////////////////////////////////////////////////
  tabchange(val) {
    this.selecctedTab = val;
  }
  Servicedatechange(event: IMyInputFieldChanged) {
    ////console.log("ClaimServiceLineList.fromDate", this.ClaimServiceLineList.fromDate)
    this.ServicedatechangeDate = 1;
    let value = event.value;
    ////console.log(event);

    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.ClaimServiceLineList.fromDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }

  getzipcodeSUbscriber() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ProfessionClaimList.subscriberAddressLine1)
    myParams1.append("City", this.ProfessionClaimList.subscriberCity)
    myParams1.append("State", this.ProfessionClaimList.subscriberState)
    this.httpService.getZipcode(myParams1).subscribe((data: ZipcodeDetail) => {
      this.ProfessionClaimList.subscriberZIPCode = data.zipcode;
    },
      (err: HttpErrorResponse) => {
        //this.global.loading = false;
        // this.getZpcodeError = "";
        // this.getZpcodeError = err.error;
        // if (this.getZpcodeError != "") {
        //   setTimeout(function () {
        //     this.getZpcodeError = "";
        //   }.bind(this), 8000);

        // }
      }
    );

  }


  getzipcodeBilling() {

    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ProfessionClaimList.billingAddressLine1)
    myParams1.append("City", this.ProfessionClaimList.billingCity)
    myParams1.append("State", this.ProfessionClaimList.billingState)

    this.global.loading = true;
    this.httpService.getZipcode(myParams1).subscribe((data: ZipcodeDetail) => {

      this.global.loading = false;
      this.ProfessionClaimList.billingZIPCode = data.zipcode;

    },
      (err: HttpErrorResponse) => {
        // this.global.loading = false;
        // this.getZpcodeError = "";
        // this.getZpcodeError = err.error;
        // if (this.getZpcodeError != "") {
        //   setTimeout(function () {
        //     this.getZpcodeError = "";
        //   }.bind(this), 8000);

        // }
      }
    );

  }


  deleteServiceLine(data) {
    this.deletionId = data.id;
  }
  deleteServiceLineConfirm() {
    this.httpService.deleteservice(this.deletionId).subscribe((data: any) => {
      this.deletionId = 0;
      this.toastrService.success('Service line has been deleted', 'Service line deleted');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      document.getElementById('openModal4').click();
      let params = new URLSearchParams();
      params.append("ClaimMasterId", this.ClaimMasterId.toString());
      this.httpService.getServiceLLineDetails(params).subscribe((data: ClaimServiceLine[]) => {
        this.ProfessionClaimList.serviceDetailsList = data;
      })
      let param = new URLSearchParams();
      param.append("ClaimMasterId", this.ClaimMasterId.toString());
      this.httpService.getClaimAmtDetails(param).subscribe((data: AmountInfo) => {
        this.ProfessionClaimList.totalcharges = data.claimTotalcharges;
        this.ProfessionClaimList.amountPaid = data.claimPaidAmount;
        this.ProfessionClaimList.balanceDue = this.ProfessionClaimList.totalcharges - this.ProfessionClaimList.amountPaid;
      })
    },
      (err: HttpErrorResponse) => {
        // ////console.log("deletion err",err);
        // this.deleteServiceLineConfirmerr="";
        // this.deleteServiceLineConfirmerr=err.error;
        // if(this.deleteServiceLineConfirmerr!=""){
        //   setTimeout(()=>{
        //     this.deleteServiceLineConfirmerr=="";
        //   }),8000;
        // }
      })
  }
  //===================================== Clear =========================================================//
  ClearValues() {
    this.getBatchFilterList.groupId = 0;
    this.getBatchFilterList.payorId = 0;
    this.getBatchFilterList.employeeId = 0;
    this.getBatchFilterList.clientId = 0;
    this.batchList.clearingHouseId = 0;
    this.claimWithoutBatch = [];
    this.grid.dataSource=[];
    this.gridactive.dataSource=[];
    this.gridarchive.dataSource=[];
   // this.grid.refresh();
   // this.gridactive.refresh();
   // this.gridarchive.refresh();

  }
  //============================== Tooltip =========================================================//
  headerCellInfo(args) {

    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({
      content: toolcontent
    });
    // console.log(args.node)
    tooltip.appendTo(args.node);

  }
  tooltip(args: QueryCellInfoEventArgs) {
  
    if (args.data != null) {
     
        if (args.column.field != null) {
          if (args.data[args.column.field]) {
          const tooltip: Tooltip = new Tooltip({
            content: args.data[args.column.field].toString(),
            position: 'RightCenter',


          }, args.cell as HTMLTableCellElement);
        }
      }
    }
  }

  //==============================MarkServicePaid
  MarkServicePaid() {
    ////console.log("this.ClaimMasterId mark", this.ClaimMasterId);
    let params = new URLSearchParams();
    this.Markaspaidlist.paidAmount=0;
    params.append("ClaimMasterId", this.ClaimMasterId.toString());
    params.append("PaidAmount",this.Markaspaidlist.paidAmount.toString());
    params.append("PaidDate",this.Markaspaidlist.paidDate.toString());
    this.httpService.MarkAsPaidFunction(params).subscribe((data: any) => {
      this.toastrService.success('Payment details has been updated', 'Payment details');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      let params = new URLSearchParams();
      params.append("ClaimMasterId", this.ClaimMasterId.toString());
      this.httpService.getServiceLLineDetails(params).subscribe((data: ClaimServiceLine[]) => {
        this.ProfessionClaimList.serviceDetailsList = data;
      })
      let param = new URLSearchParams();
        param.append("ClaimMasterId", this.ClaimMasterId.toString());
        this.httpService.getClaimAmtDetails(param).subscribe((data: AmountInfo) => {
          this.ProfessionClaimList.totalcharges = data.claimTotalcharges;
          this.ProfessionClaimList.amountPaid = data.claimPaidAmount;
          this.ProfessionClaimList.balanceDue = this.ProfessionClaimList.totalcharges - this.ProfessionClaimList.amountPaid;
        })
      document.getElementById('openMarkPaidModal').click();
    },
    (err:HttpErrorResponse)=>{
      let val: any = err;
      this.toastrService.error(val, 'Error');
      document.getElementById('openMarkPaidModal').click();
    })
  }

  PaiddatechangeDate: number = 0;
  //============================Date Changes==//
  PaidDateChanged(event: IMyDateModel) {
    ////console.log("ClaimServiceLineList.paidDate", this.ClaimServiceLineList.paidDate)
    this.PaiddatechangeDate = 1;
    this.ClaimServiceLineList.paidDate = event.formatted;
  }
  Paiddatechange(event: IMyInputFieldChanged) {
    ////console.log("ClaimServiceLineList.paidDate", this.ClaimServiceLineList.paidDate)
    this.PaiddatechangeDate = 1;
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.ClaimServiceLineList.paidDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }
  deleteClaim() {

    let param = new URLSearchParams()
    param.append("id", this.claimmasterId.toString());
    this.httpService.deleteClaimData(param).subscribe((data): any => {
      this.toastrService.success("Claim deleted successfully", 'Success');
      this.OnApplyGetBatchDetails();
      document.getElementById("deleteclaimdata").click()
      this.getBatchDetail();
    }, (err: HttpErrorResponse) => {
      console.log(err)
      let val: any = err;
      console.log(val)
      this.toastrService.error(val, 'Error');
      document.getElementById("deleteclaimdata").click()
    });

  }
  deleteBatchClaim() {
    let param = new URLSearchParams()
    param.append("Batchid", this.BatchNumber.toString())
    param.append("claimmasterid", this.claimmasterId.toString());
    this.httpService.deleteBatchClaimservice(param).subscribe((data: any) => {
      this.toastrService.success("Claim deleted successfully", 'Claim Delete');
      document.getElementById("deleteBatchclaimdata").click()
      this.getBatchDetail();
    },
      (err: HttpErrorResponse) => {
        document.getElementById("deleteBatchclaimdata").click()
        //this.getBatchDetail();
      }
    );
  }

  // ==============================================================================

  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      console.log(this.arraycol,"arraycol");
      
      this.ColumnArray_ready = JSON.parse(data.column)[0].Claims_readytobill.Columns;
      this.ColumnArray_active = JSON.parse(data.column)[0].Claims_active.Columns;
      this.ColumnArray_archive = JSON.parse(data.column)[0].Claims_archive.Columns;
     
      // let showcol = JSON.parse(data.column)[0].ColumnArray_ready.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Claims_readytobill.HideColumns
      // let showcol_active = JSON.parse(data.column)[0].Claims_active.ShowColumns;
      let hidecol_active = JSON.parse(data.column)[0].Claims_active.HideColumns
      
      // let showcol_archive = JSON.parse(data.column)[0].Claims_archive.ShowColumns;
      let hidecol_archive = JSON.parse(data.column)[0].Claims_archive.HideColumns

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
      this.gridactive.hideColumns(hidecol_active);
      this.gridarchive.hideColumns(hidecol_archive);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Claims_readytobill.Pagesize
      this.gridactive.pageSettings.pageSize = JSON.parse(data.column)[0].Claims_active.Pagesize
      this.gridarchive.pageSettings.pageSize = JSON.parse(data.column)[0].Claims_archive.Pagesize

      this.ColumnArray_ready.forEach(element => {



        if (element.column == '') {

          const column = this.grid.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Client') {

          const column1 = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Prepared Date') {

          const column = this.grid.getColumnByField('preparedDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Payor') {

          const column = this.grid.getColumnByField('payer_Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'From Date') {

          const column = this.grid.getColumnByField('fromDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'To Date') {

          const column = this.grid.getColumnByField('toDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Total Amt.') {

          const column = this.grid.getColumnByField('totalAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Paid Amt.') {

          const column = this.grid.getColumnByField('paidAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Note') {

          const column = this.grid.getColumnByField('note'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Claim Id') {

          const column = this.grid.getColumnByField('claimId'); // get the JSON object of the column corresponding to the field name
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

      this.ColumnArray_active.forEach(element => {



        if (element.column == '') {

          const column = this.gridactive.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Client') {

          const column1 = this.gridactive.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.gridactive.refreshHeader();
        }
        if (element.column == 'Prepared Date') {

          const column = this.gridactive.getColumnByField('preparedDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Payor') {

          const column = this.gridactive.getColumnByField('payer_Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'From Date') {

          const column = this.gridactive.getColumnByField('fromDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'To Date') {

          const column = this.gridactive.getColumnByField('toDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Total Amt.') {

          const column = this.gridactive.getColumnByField('totalAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Resubmission') {

          const column = this.gridactive.getColumnByField('resubmission'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Exported') {

          const column = this.gridactive.getColumnByField('export'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }

        if (element.column == 'Paid Amt.') {

          const column = this.gridactive.getColumnByField('paidAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Note') {

          const column = this.gridactive.getColumnByField('note'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
        if (element.column == 'Claim Id') {

          const column = this.gridactive.getColumnByField('claimId'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
         if (element.column == 'Status') {

          const column = this.gridactive.getColumnByField('claimStatus'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridactive.refreshHeader();

        }
       
        if (element.column == 'Action') {

          const column2 = this.gridactive.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.gridactive.refreshHeader();

        }
      });

      this.ColumnArray_archive.forEach(element => {



        if (element.column == '') {

          const column = this.gridarchive.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'Client') {

          const column1 = this.gridarchive.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.gridarchive.refreshHeader();
        }
        if (element.column == 'Prepared Date') {

          const column = this.gridarchive.getColumnByField('preparedDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'Payor') {

          const column = this.gridarchive.getColumnByField('payer_Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'From Date') {

          const column = this.gridarchive.getColumnByField('fromDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'To Date') {

          const column = this.gridarchive.getColumnByField('toDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'Total Amt.') {

          const column = this.gridarchive.getColumnByField('totalAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }

        if (element.column == 'Paid Amt.') {

          const column = this.gridarchive.getColumnByField('paidAmount'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'Note') {

          const column = this.gridarchive.getColumnByField('note'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
        if (element.column == 'Claim Id') {

          const column = this.gridarchive.getColumnByField('claimId'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridarchive.refreshHeader();

        }
       
        if (element.column == 'Action') {

          const column2 = this.gridarchive.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.gridarchive.refreshHeader();

        }
      });

      

    });
  }
  SaveColumnwidth() {
    this.arraycol[0].Claims_active.Columns = this.ColumnArray_active;
    this.arraycol[0].Claims_archive.Columns = this.ColumnArray_archive;
    this.arraycol[0].Claims_readytobill.Columns = this.ColumnArray_ready;

    this.arraycol[0].Claims_active.Pagesize = this.gridactive.pageSettings.pageSize;
    this.arraycol[0].Claims_archive.Pagesize = this.gridarchive.pageSettings.pageSize;
    this.arraycol[0].Claims_readytobill.Pagesize = this.grid.pageSettings.pageSize;
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
    this.ColumnArray_ready.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  onResize_active(args) {
    const column = this.gridactive.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_active.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  onResize_archive(args) {
    const column = this.gridarchive.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_archive.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  onResizeBatchView(args) {
    const column = this.gridviewbatch.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_bachview.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidthViewbatch();
  }

  
  getColumnwidthViewbatch() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      console.log(this.arraycol,"arraycol");
   
      this.ColumnArray_bachview = JSON.parse(data.column)[0].BatchDetail.Columns;
     
     
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

    
      this.gridviewbatch.pageSettings.pageSize = JSON.parse(data.column)[0].BatchDetail.Pagesize

      this.ColumnArray_bachview.forEach(element => {



        if (element.column == 'Batch No.') {

          const column = this.gridviewbatch.getColumnByField('batchno'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridviewbatch.refreshHeader();

        }
        if (element.column == 'Claim Status') {

          const column1 = this.gridviewbatch.getColumnByField('claimStatus'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.gridviewbatch.refreshHeader();
        }
        if (element.column == 'Company') {

          const column = this.gridviewbatch.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridviewbatch.refreshHeader();

        }
        if (element.column == 'Clearing House') {

          const column = this.gridviewbatch.getColumnByField('clearingHouseName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridviewbatch.refreshHeader();

        }
        if (element.column == 'Generated Date') {

          const column = this.gridviewbatch.getColumnByField('createDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridviewbatch.refreshHeader();

        }
    
        if (element.column == 'Action') {

          const column2 = this.gridviewbatch.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.gridviewbatch.refreshHeader();

        }
      });



    });
  }

  SaveColumnwidthViewbatch() {
  
    this.arraycol[0].BatchDetail.Columns = this.ColumnArray_bachview;
    this.arraycol[0].BatchDetail.Pagesize = this.gridviewbatch.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidthViewbatch();

    });
  }

  /* get status for claim */
  getStatusClaim() {
    let params = new URLSearchParams();
    params.append("Code", "CLAIMFILTERSTATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatusForClaim(params).subscribe((data: any) => {
      this.dropdata = data.map(e => e.Value);
      console.log("dropdate", this.dropdata);

    });
  }

  /* date change event */

  MarkPaiddatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.Markaspaidlist.paidDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }
  onMarkPaidDateChanged(event: IMyDateModel) {
    this.Markaspaidlist.paidDate = event.formatted;
    }
    /* Mark as paid function */
    MakeMarkServicePaid(){      
      this.Markaspaidlist=new PaymentInfo();
      this.Markaspaidlist.paidDate=new Date().toLocaleDateString();
    }
    

}
