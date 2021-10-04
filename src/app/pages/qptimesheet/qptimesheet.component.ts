import { Component, OnInit, ViewContainerRef, ViewChild, ViewEncapsulation, Inject, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DateService } from '../../date.service';
import { IMyDpOptions } from 'mydatepicker';
import { GlobalComponent } from '../../global/global.component';
import { ToastrService } from 'ngx-toastr';
import { DetailRowService, GridModel, parentsUntil, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { EditDetailsAuthorization } from '../client-parent/client-parent.model';
//import { element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { filters, sortingObj, SaveTimeSheet, returnTimesheet, deletepermission, gettimesheet, WhereCondition, TimesheetreturnBO,functionpermission, employeeFilter, QptimesheetBO } from './qptimesheet.model';
import { QPTimesheetService } from './qptimesheet.service';
import { QPtimesheetdataservice } from './qptimesheet-table.service';
import { ColumnChangeBO, columnWidth } from '../list/list.model';

@Component({
  selector: 'app-qptimesheet',
  templateUrl: './qptimesheet.component.html',
  styleUrls: ['./qptimesheet.component.scss'],
  providers: [DetailRowService],
  encapsulation: ViewEncapsulation.None,
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class QptimesheetComponent implements OnInit {

  filters: filters = new filters();
  @ViewChild('childtemplate') public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  authinput: EditDetailsAuthorization = new EditDetailsAuthorization();
  timehssetgrid: boolean = false;
  saveErr: string = "";
  fp:functionpermission=new functionpermission()

  // ================================

  EmployeeDropDown: any
  ClinetDropDown: any;
  PayorDropDown: any
  timesheetclose: boolean = false;
  public serviceList: any = [];
  loading: boolean = false;
  public dropdatas: string[] = ['Yes', 'No']
  public dropdata1: string[] = ['', "EXPORTED"]
  public height = '220px';
  QPTImeshet: QptimesheetBO = new QptimesheetBO();

  //========================================Table Intialize variable===========================================//
  filterOptions: FilterSettingsModel;
  initialPage: object;
  // grid: GridComponent;
  filter: IFilter;
  sorting = new sortingObj();
  deleteList: deletepermission = new deletepermission();
  empumpi: any = [];
  // public state: DataStateChangeEventArgs;
  gettimesheet: gettimesheet = new gettimesheet();
  conditionlist: WhereCondition[] = [];
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  public formatOptions: object;

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  //=====================================Timesheet variables=========================================//
  TimesheetLst: returnTimesheet[];
  parentData: any = [];
  childData: any = [];
  childGrid: GridModel;
  public editSettings: Object;
  timesheetuploaddata: any;
  EditAuthorization: boolean = false;
  //==========================================Manual Entry variable==================================//
  start: string;
  end: string;
  Employee: number;
  Client: number;
  authorizationdetails: any = [];
  griddata: boolean = false;
  //======================================Dropdown Enable variable==================================//
  eanbleclient: boolean = true;
  enablestart: boolean = true;
  eanbleend: boolean = true;
  eanbleservice: boolean = true;
  //===================================Enable Client and Employee Info variable===================//
  isEmp: boolean = false;
  isCliInfo: boolean = false;
  umpi: string;
  payorreqID: string;
  serviceName: any = [];
  clientdob: string;
  memberma: string;
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  manualEntry: boolean = false;
  orderList: any = [];
  passerror: boolean = false;
  isIns: boolean = false;
  dontshowAuth: boolean = false;
  createSchList: any = []
  hoursCal: any = false;
  result2: any = []
  Allhours: string = "";
  ////////////////////////////////show hour variable//////////////////////////////////////////////////////////////////
  enterdhr: number = 0;
  entermin: number = 0;
  ////////////////////////////////////////file variables////////////////////////////////////////////////////////
  selected: boolean = false;
  pdfSrc: string = "";
  filearray: any = [];
  resetPass: FormGroup;
  ////////////////////////////////Edit Varriable///////////////////////////////////////////////////////////////////////
  editemp: string;
  editcli: string;
  editserialnumber: number;
  EmployeeId: string;
  editClient: string;
  editEmployee: string;
  editid: number;
  editDate: string;
  editservice: string;
  edittime: string;
  editNotes: string;
  EmployeeTypeList: [{ Key: number, Value: string }];
  employeeFilter = new employeeFilter();
  // =================================================================

  ///////////////////////////////Date Piker intialization////////////////////////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  public Keystatusoption: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };

  /////////////////// Var fot Qp ////////////////////////////////////////////////////
  QPService:any;
  public QPEmployeeDropDown: any = [];
  public QPserviceList: any = [];
  QPForm:FormGroup;
  qpadd: any = [];
  QPList: any = {};
  AddedQP:boolean=false;
  loadingQpadd:boolean=false;
  saveQPErr:string="";
  isQpP:boolean=false;
  isSer:boolean=false;
  isDate:boolean=false;
  isHours:boolean=false;

  public pData: object[];
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  EmployeeListData: any;

  constructor(public dateservice: DateService, public global: GlobalComponent, @Inject(QPtimesheetdataservice) public timeservice: QPtimesheetdataservice, private ngxService: NgxUiLoaderService, public timesheetservice: QPTimesheetService,
  private ref: ChangeDetectorRef, public httpService: QPTimesheetService,public toastrService: ToastrService, private router:Router, public datePipe: DatePipe, @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef ) { 
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
   
    this.data = timeservice;
    this.resetPass = new FormGroup({
      Password: new FormControl('', [Validators.required])
    });
  }

  public dataStateChange(state): void {
    let type: String = (state.action.requestType).toString();
    console.log(state);
    console.log(type);
    this.sorting.currentPgNo = this.grid.pagerModule.pagerObj.currentPage;
    this.sorting.itemperpage = this.grid.pagerModule.pagerObj.pageSize;
    console.log(this.sorting)
    if (state.action.requestType != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.sorting.shortcolumn = state.sorted[0].name;
        this.sorting.shortType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
        console.log(this.gettimesheet);
      }
    }
    if (type == "filtering" && state.action.action != "clearFilter") {
      this.sorting.currentPgNo = 1;
      this.sorting.itemperpage = 10;
      if (this.gettimesheet.type == "date") {
        this.gettimesheet.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        console.log(this.gettimesheet.value)
      }
      else {
        this.gettimesheet.value = state.action.currentFilterObject.value
      }
      this.gettimesheet.field = state.action.currentFilterObject.field
      console.log(this.gettimesheet)
      if (state.action.currentFilterObject.field == "isCliSignature") {
        this.gettimesheet.value = this.gettimesheet.value == 'Yes' ? 'true' : 'false';
        this.gettimesheet.type = "boolean"
      }
      if (state.action.currentFilterObject.field == "isEmpSignature") {
        this.gettimesheet.value = this.gettimesheet.value == 'Yes' ? 'true' : 'false';
        this.gettimesheet.type = "boolean"
      }
      if (state.action.currentFilterObject.field == "eTimesheet") {
        this.gettimesheet.value = this.gettimesheet.value == 'Yes' ? 'true' : 'false';
        this.gettimesheet.type = "boolean"
      }
      if (state.action.currentFilterObject.field == "timesheetStatusLid") {
        this.gettimesheet.field = "timesheetStatus"
        this.gettimesheet.type = "string"
      }
    }
    if (state.action.requestType == "filtering" && state.action.action == "clearFilter") {
      this.sorting.currentPgNo = 1;
      this.sorting.itemperpage = 10;
      this.gettimesheet.value = ""
      this.gettimesheet.field = "clientName"
      this.sorting.shortcolumn = "TimesheetDate"
      this.sorting.shortType = 'ASC';
      console.log(this.gettimesheet)
    }
    if (state.action.requestType != "refresh") {
      this.timesheetfilter();
    }
    if (state.action.requestType== "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Qp_Timesheet.Pagesize!=state.take)
        {
          this.arraycol[0].Qp_Timesheet.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }
  }

  ngOnInit(): void {
    this.getEmployeeDropDown();
    this.filepermissionget();
    this.getClient();
    this.filters.filterStartDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.filters.filterEndDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.filterOptions = { type: 'Menu' };
    this.filter = {
      type: 'menu'
    };
    setTimeout(() => {
      this.timehssetgrid = true;
    }, 400);
    this.timesheetfilter();
  }

 //=================================Service dropdown==========================================//
  getService() {
    let params = new URLSearchParams();
    console.log("agencyId", this.global.globalAgencyId);
    params.append("agencyId", this.global.globalAgencyId)
    this.timesheetservice.getservice(params).subscribe((data: any) => {
      data.forEach(element => {
        element.Key = element.Key.toString()
      });
      this.QPserviceList = data;
      console.log(this.QPserviceList)
    });
  }

  //================================ Add QP =====================================================//
  addService() {
    this.QPList = {
      id: 0,
      employeeId: 0,
      clientId:0,
      masterServiceId:0,
      timesheetDate: new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString(),
      totalHours:0,
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
      clientId:0,
      masterServiceId:0,
      timesheetDate: new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString(),
      totalHours:0,
      employeeId: 0,
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

  //=================================Close QP schedule Page ===================================//
closeQp(){
  this.manualEntry = false;
}

// ================================
  index: number = 0;
  setindex(i){
    this.index = i;
  }

  ///////////////////////////////////validate button//////////////////////////////////////////////////////////////

  validatebutton(args: QueryCellInfoEventArgs) {
    console.log(args)
    if (args.column.field == "timesheet") {
      if (args.data['timesheetStatus'] == 'EXPORTED') {
       
        args.cell.children[0].classList.add('disableedit');
        args.cell.children[1].classList.add('disableedit');
      }
    }
  }
  //////////////////////////////////////////get timesheet ///////////////////////////////////////////////////////////////

  timesheetfilter() {
    if ((this.filters.filterStartDate == undefined || this.filters.filterStartDate == "") &&
      (this.filters.filterEndDate != undefined && this.filters.filterEndDate != "") ||
      ((this.filters.filterEndDate == undefined || this.filters.filterEndDate == "") && (this.filters.filterStartDate != undefined && this.filters.filterStartDate != ""))) {


      this.toastrService.error('select start and end date', 'Warning');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      return;
    }

    if (new Date(this.filters.filterStartDate).getTime() > new Date(this.filters.filterEndDate).getTime()) {
      this.toastrService.error('End date should be grater than Start date', 'Warning');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      return;
    }
    if (this.filters.filterEmployee == null || this.filters.filterEmployee == undefined) {
      this.filters.filterEmployee = 0
    }
    if (this.filters.filterClient == null || this.filters.filterClient == undefined) {
      this.filters.filterClient = 0
    }
    if (this.filters.filterPayor == null || this.filters.filterPayor == undefined) {
      this.filters.filterPayor = 0
    }
    this.getFilterTotalItem();
  }

  getFilterTotalItem() {
    this.gettimesheet.agencyId = parseInt(this.global.globalAgencyId);
    this.gettimesheet.client = parseInt(this.filters.filterClient.toString());
    this.gettimesheet.payor = parseInt(this.filters.filterPayor.toString());
    this.gettimesheet.pageitems = parseInt(this.sorting.itemperpage.toString());
    this.gettimesheet.employee = parseInt(this.filters.filterEmployee.toString());
    this.gettimesheet.start = new Date(new Date(this.filters.filterStartDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.gettimesheet.end = new Date(new Date(this.filters.filterEndDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.gettimesheet.currentpage = this.sorting.currentPgNo;
    this.gettimesheet.orderColumn = this.sorting.shortcolumn;
    this.gettimesheet.orderType = this.sorting.shortType;
    this.timeservice.execute(this.gettimesheet)
    let count=0;
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
    })
  }

  // ================================Refresh=================================

  Refresh() {
    this.filters.filterStartDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.filters.filterEndDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.sorting.currentPgNo = 1;
    this.sorting.itemperpage = 10;
    this.gettimesheet.value = "";
    this.filters.filterEmployee = 0;
    this.filters.filterClient = 0;
    this.filters.filterPayor = 0;
    this.gettimesheet.field = "clientName"
    this.sorting.shortcolumn = "TimesheetDate"
    this.sorting.shortType = 'ASC';
    this.employeeFilter.employeeType = null;
    this.timesheetfilter();
  }

  //////////////////////////////view child //////////////////////////////////////////////////////////////////

  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }

  /////////////////////////////////////Action Complete///////////////////////////////

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
  
    console.log(hidearr, "hidearr")
    console.log(showarr, "showarr");
    console.log(this.arraycol, "arraycol");
  
    var count = 0;
    var count1 = 0;
    if (args.columns.length > 0) {
  if(this.arraycol.length > 0)
  {
    this.arraycol[0].Qp_Timesheet.ShowColumns.forEach(old => {
      showarr.forEach(element => {
        if (old == element) {
          count1 = count1 + 1;
        }
      });
  
    });
  
    this.arraycol[0].Qp_Timesheet.HideColumns.forEach(old => {
      hidearr.forEach(element => {
        if (old == element) {
          count = count + 1;
        }
      });
  
    });
    console.log(count, count1, "count");
  
  
    if (this.arraycol[0].Qp_Timesheet.ShowColumns.length != count1 || this.arraycol[0].Qp_Timesheet.HideColumns.length != count) {
      this.arraycol[0].Qp_Timesheet.ShowColumns = showarr;
      this.arraycol[0].Qp_Timesheet.HideColumns = hidearr;
      this.SaveColumnwidth();
    }
  }
    
    }
  }
    this.conditionlist = [];
    console.log("args", args);
    console.log("args", args.columns);
    if (args.requestType == "filterafteropen") {
      this.gettimesheet.type = args.columnType;
    }
  }

  // =============================================================================================

  getEmployeeDropDown() {
    let params = new URLSearchParams();
    // console.log(empType);
    let emptype = 106;
    params.append("AgencyId", this.global.globalAgencyId);
    params.append("employeeId",emptype.toString());
    this.timesheetservice.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeDropDown = data;
      this.EmployeeDropDown.forEach(element => {
        element.Key = element.Key.toString();
      })
    });
  }
  // ==============================================================================================

  getClient() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.timesheetservice.getClient(params).subscribe((data: any) => {
      this.ClinetDropDown = data;
      this.ClinetDropDown.forEach(element => {
        element.id = element.id.toString();
      })
    });
  }

  /////////////////////////////////////////get timesheet Upload//////////////////////////////////////////////////

  getTimesheetUpload(id) {

    let myParams = new URLSearchParams();
    myParams.append("serialnumber", id);
    this.timesheetservice.gettimesheetUpload(myParams).subscribe((data: any) => {

      this.timesheetuploaddata = data;
      this.timesheetuploaddata.forEach((element,index) => {
        element.serialnumber=index+1;
      });

    })
  }

  //////////////////////////////edit parent table data//////////////////////////////////////////////////////////

  edittimesheet(data) {
    // this.qpadd = data;
    console.log(data);
    this.QPTImeshet.id = data.id;
    this.QPTImeshet.employeeId = data.employeeId;
    this.QPTImeshet.employeeName = data.employeeName;
    this.QPTImeshet.clientId = data.clientId;
    this.QPTImeshet.clientName = data.clientName;
    this.QPTImeshet.timesheetDate = new Date(data.timesheetDate).toLocaleDateString();
    this.QPTImeshet.masterServiceId = data.masterServiceId;
    this.QPTImeshet.masterCode = data.masterCode;
    this.QPTImeshet.totalHours = data.totalHours;
    this.QPTImeshet.timesheetNotes = data.timesheetNotes;
  }

  //======================================Get QP Employee Dropdown=========================//  
  getQPEmployeeDropDown() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.timesheetservice.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) =>
    {
    this.QPEmployeeDropDown = data;
    console.log(this.QPEmployeeDropDown);
    this.QPEmployeeDropDown.forEach(element => {
    element.Key = element.Key.toString();
    })
    }); 
  }

  /////////////////////////////delete child table data//////////////////////////////////////////////////////
  // deletetimesheetpopup(data) {
  //   document.getElementById("delete").click()
  //   this.deleteList.timesheet_id = data.timeSheetId;
  // }

  //////////////////////////////////////////update function////////////////////////////////////////////////////////
  update(val) {
    val.id = Math.floor(Number(val.id));
    val.clientId = Math.floor(Number(val.clientId));
    val.employeeId = Math.floor(Number(val.employeeId));
    val.masterServiceId = Math.floor(Number(val.masterServiceId));
    val.totalHours = Math.floor(Number(val.totalHours));
    val.timesheetDate = new Date(new Date(val.timesheetDate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString(),
    console.log("val",val);
    this.timesheetservice.updateTimesheetdata(val).subscribe((data: any) => {
      // if(data){
        document.getElementById('update').click();
        this.toastrService.success('QP-Timesheet Updated successfully','QP-Timesheeet Updated'),8000;
        this.getFilterTotalItem();
      // }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }

  ////////////////////////passWord Validation///////////////////////////////////////////////////
  passvalid(event) {

    let str = event.target.value;
    let res;

    if (str.match(/[a-z]/g) && str.match(
      /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
          /[^a-zA-Z\d]/g) && str.length >= 8) {
      this.passerror = false;
    }
    else {
      this.passerror = true;
    }

  }
  /////////////////////////delete total timesheet//////////////////////////////////////////////
  deleteTimesheet(val) {
    val.timesheet_id = Math.floor(Number(val.timesheet_id));
    console.log(val);
    this.timesheetservice.deleteTimesheetdata(val).subscribe((data: any) => {
      // if(data){
        document.getElementById('delete').click();
        this.toastrService.success('QP-Timesheet deleted successfully','QP-Timesheet deleted'),8000;
        this.getFilterTotalItem();
      // }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    })
  }

  //=============================================== validation ====================================//
  checkValidation(authList) {
      this.loadingQpadd=true;
      console.log(authList);
      this.saveQPErr == ""
      authList.forEach(element => {
        if (this.saveQPErr == "") {
          if (element.clientId == null || element.clientId == '') {
             this.loadingQpadd=false; 
             this.isQpP=true 
            this.saveQPErr = "Please Enter All details to proceed";
          }
          else if (element.masterServiceId == null  || element.masterServiceId == '') {
            this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
            this.isSer=true
          }
          else if (element.timesheetDate == null  || element.timesheetDate == "") {
            this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
            this.isDate=true
          }
          else if (element.totalHours == null  || element.totalHours == '') {
           this.loadingQpadd=false;  
            this.saveQPErr = "Please Enter All details to proceed";
          this.isHours=true
          }
          else if (authList.employeeId == null  || authList.employeeId == '') {
            this.loadingQpadd=false;  
             this.saveQPErr = "Please Enter All details to proceed";
         
           }

       console.log(this.saveQPErr);
        }  
      });
      if (this.saveQPErr == "") {
        this.saveClientAuth(authList);
      }
    }

  // =============================Save function==================
  saveClientAuth(save) {
    let savelist=JSON.parse(JSON.stringify(save));
    savelist.forEach(element => {
      console.log(element.timesheetDate)
      element.id = Math.floor(Number(element.id)),
      element.clientId = Math.floor(Number(element.clientId)),
      element.employeeId = Math.floor(Number(save.employeeId)),
      element.totalHours = Math.floor(Number(element.totalHours)),
      element.masterServiceId = Math.floor(Number(element.masterServiceId)),
      element.timesheetDate = new Date(new Date(element.timesheetDate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString(),
      element.isCliSignature = true,
      element.isEmpSignature = true,
      element.etimesheet = false
    });
    console.log("savelist",savelist);
    this.timesheetservice.saveTimesheet(savelist).subscribe((data: any)=> {
      // if(data) {
        this.manualEntry = false;
        this.toastrService.success('QP-TImesheet saved successfully','QP-TImesheet saved'),8000;
        this.qpadd = [];
        this.getFilterTotalItem();
      // }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }


  //////////////////////cacel Delete///////////////////////////////////////////////////////////////
  CancelDelete() {
    this.deleteList = new deletepermission();
    this.editserialnumber = 0;
    this.passerror = false;
    this.resetPass.reset()
  }

  // ==============================================================================================

  openQP()
  {
    this.QPTImeshet = new QptimesheetBO();
    this.manualEntry = true;
    this.qpadd = [];
    this.getQPEmployeeDropDown();
    this.getClient();
    this.getService();
    this.addService();
  }
  // ===========================
  filepermissionget() {
    let params = new URLSearchParams();
  
    params.append("pagecode", "Timesheets");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.timesheetservice.getpermission(params).subscribe((data: any) => {

      if (data != null) {
        this.fp = data;
      }
      else {
        this.fp = new functionpermission();
      }
    },
      (err: HttpErrorResponse) => {
        this.fp = new functionpermission();
      })
  }

  //============================================== Restrict Hours ==========================================================//
  numberonly(event: any,type) {
    if (((event.which < 48 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 57) && ((event.which < 96 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 105)) {
          event.preventDefault();
    }
    let txt = "";
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

  //////////////////////////Date Piker Date Change///////////////////////////////////////////////////////////////////////

  newdates(event, type, name,i) {
    if (type == "inputchage") {
      if (name == 'filterstart') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.filterStartDate = val1;
        }
      }
      if (name == 'filterend') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.filterEndDate = val1;
        }
      }
      if (name == 'start') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.start = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.end = val1;
        }
      }
      if (name == 'editdate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.QPTImeshet.timesheetDate = val1;
        }
      }
      if (name == 'Create') {
        let val = this.dateservice.inputFeildchange(event);
        console.log(val)
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          console.log(val1)
          this.qpadd[i].timesheetDate = val1;
          console.log(this.qpadd.timesheetDate)
        }
      }
    }
    if (type == "datechagned") {
      if (name == 'filterstart') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.filterStartDate = val1;

        }
      }
      if (name == 'filterend') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.filterEndDate = val1;
        }
      }
      if (name == 'start') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.start = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.end = val1;
        }
      }
      if (name == 'editdate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.QPTImeshet.timesheetDate = val1;
        }
      }
      if (name == 'Create') {
        let val = this.dateservice.Datechange(event);
        console.log(val)
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.qpadd[i].timesheetDate = val1;
          console.log(val1)
        }
      }
    }
  }

  //=================================== Tooltip ====================================//
  headerCellInfo(args) { 

    const toolcontent = args.cell.column.headerText; 
    const tooltip: Tooltip = new Tooltip({ 
      content: toolcontent 
  }); 
  tooltip.appendTo(args.node); 
  
  }
  tooltip(args: QueryCellInfoEventArgs) {
  if(args.column.field!=null)
  {
    if(args.data[args.column.field]!=null)
    {
    const tooltip: Tooltip = new Tooltip({
      content: args.data[args.column.field].toString()
  }, args.cell as HTMLTableCellElement);
  }
}
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

  getColumnwidth() {
   
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);
  
  
      this.ColumnArray = JSON.parse(data.column)[0].Qp_Timesheet.Columns;
  
  
    
      //  this.grid.refreshColumns();
  
      let showcol = JSON.parse(data.column)[0].Qp_Timesheet.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Qp_Timesheet.HideColumns
    
  
   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
  
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Qp_Timesheet.Pagesize
  
      this.ColumnArray.forEach(element => {
  
  
  
        if (element.column == 'Client') {
  
          const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;
  
          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Employee') {
  
          const column1 = this.grid.getColumnByField('employeeName'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Service') {
  
          const column2 = this.grid.getColumnByField('masterCode'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Total Hours') {
  
          const column3 = this.grid.getColumnByField('totalHours'); // get the JSON object of the column corresponding to the field name
          column3.headerText = element.column;
          column3.width = element.width;
  
          this.grid.refreshHeader();
        }
        
        else if (element.column == 'Actions') {
  
          const column4 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column4.headerText = element.column;
          column4.width = element.width;
          this.grid.refreshHeader();
  
        }
      });
  
  
    });
  
  }
  SaveColumnwidth() {
   
    this.arraycol[0].Qp_Timesheet.Columns = this.ColumnArray;
    this.arraycol[0].Qp_Timesheet.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {
  
      this.getColumnwidth();
  
    });
  }

}
