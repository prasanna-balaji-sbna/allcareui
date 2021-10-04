import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ToolbarService, EditService, PageService, DetailRowService, GridComponent, GridModel, QueryCellInfoEventArgs, parentsUntil, DataStateChangeEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { IMyDpOptions, IMyInputFieldChanged, IMyDateModel } from 'mydatepicker';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { GlobalComponent } from 'src/app/global/global.component';
import { DateService } from 'src/app/date.service';
import { DatePipe } from '@angular/common';
import { sortingObj, StatusList, PayrollexcelBO, GetPayrollBO, timesheetClientAuthBO, ClientBO1, PayrollId, ReportBO, PayrollLineBO, UpdatepaydateBO, payrollReportBO } from '../timesheetnew/timesheetnew.model';
// import { IOption } from 'ng-select';
// import * as moment from 'moment';
import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { TimesheetnewService } from './timesheetnew.service';
import { GetAgencyBO } from '../agency/agency.model';
import { ColumnChangeBO, columnWidth, WhereCondition } from '../icd10/icd10.model';
import { Observable } from 'rxjs';
import { payrollservice } from './timesheetnewListdata.service';
import { EmployeeList, PayorList } from '../batch/batch.model';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Tooltip } from '@syncfusion/ej2-angular-popups';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-timesheetnew',
  templateUrl: './timesheetnew.component.html',
  styleUrls: ['./timesheetnew.component.scss'],
  providers: [ToolbarService, EditService, PageService, DetailRowService],
//  changeDetection: ChangeDetectionStrategy.OnPush
 
  // encapsulation: ViewEncapsulation.None

})
export class TimesheetnewComponent implements OnInit {
  /////////Initialization///////////////////////////////////
  @ViewChild('childtemplate') public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('pdflist') pdflist;
  @ViewChild('pdflist1') pdflist1;
  ///////////Date picker///////////////////////////////////////


  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  filterStartDate: any = '';
  filterEndDate: any = '';
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };
  public myDatePickerOptions2: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    editableDateField: true
  };

  Allhours: any = "";
  pdfenable:boolean=false;
  selectedpayrollid: any = [];
  statusList: StatusList[];
  agencyId: string = this.global.globalAgencyId;
  employee: any = '';
  client: any = '';
  payer: any = '';
  childGrid: GridModel;
  payrollReport: payrollReportBO[];
  isManualEntry: boolean = false;
  eanbleclient: boolean = true;
  enablestart: boolean = true;
  eanbleend: boolean = true;
  eanbleservice: boolean = true;
  isEmp: boolean = false;
  isIns: boolean = false;
  cliName: string = "";
  serviceName: string = '';
  startDate: string = ""
  endDate: string = ""
  empName: string = ""
  isCliInfo: boolean = false;
  payorreqID: string = '';
  umpi: string = ''
  isTouched: boolean = false;

  dontshowAuth: boolean = false;
  editClient: string;
  editEmployee: string;
  editDate: string;
  editNotes: string;
  editservice: string;
  edittime: string;
  editid: any;
  editPayrollId: string;
  edittimesheetId: string;
  // result2: string = []

  uploadTimeSheetLoading: boolean = false;
  timesheetUpload: any = [];
  payrollPayDate: string = null;
  payrollPayDateId: number = 0;
  PayrateRequired: boolean = false;
  updatevalchange: boolean = false;
  showerr: any = ""
  saveErr: string = "";
  @ViewChild('ddsample')
  // public dropDown: DropDownListComponent;
  public editSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public customeridrules: Object;
  public freightrules: Object;
  public editparams: Object;
  public pageSettings: Object;
  public formatoptions: Object;
  public orderList: any = [];
  public finalList: any;
  public createSchList: any = {};
  currDate: any = new Date();
  fileToUpload: File = null;
  viewshedulepopup: any;

  serial: any = 0;
  updateerror: boolean = false;
  updateerrormsg: any;
  pageitems: number = 20;
  p: number = 1;
  today = new Date
  /////////////////////// parent data////////////////

  TimesheetLst: any = [];
  parentData: any = [];
  authorizationdetails = []

  public childData: any = [];
  public createSchView = {};
  public activityList: any = [];
  public empList: any = []
  // public weekList: Array<IOption> = []
  public weekList = []
  public serviceList: any = [];
  min: any = new Date();
  max: Date;
  // clientlist: Array<IOption> = []
  clientlist = []
  employeelists: EmployeeList[];
  clientFilter: ClientBO1[];
  payerLst: PayorList[];
  clientid: any = '';
  result2: any = []

  excelformatarlst: any = [];
  Printdata: any;
  public checkparams;
  ////////=========================ReportBO======================================////////

  reportList: Array<ReportBO> = [];
  xclsheet: any;
  ws: XLSX.WorkSheet;

  jssheet: any;
  //////////==================Filter===============================================////////////////////

  ListSendBO: GetPayrollBO = new GetPayrollBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  type: string = "";


  public dropdata: string[];
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  public height = '220px';

  initialPage: object;
  public filterSettings: object;
  TotalCount: number;
  pagshort: sortingObj = new sortingObj();
  public pageSizes: number[] = [10, 15, 20,50,100,250];

  public formatOptions: object;

  //////================= lock payroll functionalities========//////////////////////
  ispayrolllocked: boolean = false;
  payrollLockId: number = 0;
  payrollISLocked: boolean = false;
  payrollUnLockId: number = 0;
  public selectionOptions: SelectionSettingsModel
  constructor(private ref: ChangeDetectorRef,
    public dateservice: DateService, private datePipe: DatePipe, @Inject(payrollservice) public gethttp: payrollservice, public httpService: TimesheetnewService, public global: GlobalComponent, public toastrService: ToastrService, public http: HttpClient, @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef) {
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
    
      this.data = gethttp;
  }

  ngOnInit(): void {
 //   console.log(this.selectedpayrollid.length, "selectedpayrollid ================");

    if (this.global.globalAgencyId != 0) {
      this.filterStartDate = "";
      this.filterEndDate = "";
      this.getemployee()
      this.getclients();
      this.getStatus()
      this.filter();
      this.checkparams =
      {
        checked: false
      }
      this.getpayer();

      this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
      this.currDate = { year: 2017, month: 1, day: 1 };
      this.filterSettings = { type: 'Menu' };

      this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
      this.childGrid = {
        // dataSource: this.childData,
        rowDataBound: this.rowDataBound1,
        queryCellInfo: this.customiseCell,
        queryString: 'payrollId',
        allowSorting: false,
        allowPaging: false,
        load() {
          this.registeredTemplate = {};
        },
        editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

        columns: [

          { field: 'clientName', headerText: 'Client', width: 75, },
          { field: 'timesheetDate', headerText: 'Timesheet Date', width: 100 },
          { field: 'serviceCode', headerText: 'Code', width: 80 },
          { field: 'totalHours', headerText: 'Total Hours', width: 100 },
          { field: 'payablehrs', headerText: 'Payable Hours', width: 100 },
          { field: 'notes', headerText: 'Notes', width: 50 },
          { headerText: 'Edit', width: 50, template: this.childtemplate }
        ]

        
      };
      this.selectionOptions = {
        checkboxOnly: true
      }
      // this.getColumnwidth().then(s=>
      //   {
      //     this.filter();
      //   })
    }
  }
  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  // =================================== data change event=====================///////
  public dataStateChange(state): void {
 //  console.log("Stats chage", state);
    this.type = (state.action.requestType).toString();
  //  console.log(this.type);

    this.pagshort.currentPgNo = this.grid.pagerModule.pagerObj.currentPage;
    this.pagshort.itemperpage = this.grid.pagerModule.pagerObj.pageSize;

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
      // console.log("Status",state.action.currentFilterObject.field);

      //         this.ListSendBO.value = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
      //         this.ListSendBO.field = "statusLid";
      //         this.ListSendBO.statusLid = this.statusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
      //         this.ListSendBO.type = "number";
      //       }
      //       this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      //       this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "EmployeeName";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }
    if (state.action.requestType != "refresh") {
      this.getFilterTotalItemNew();
    }

    
    if ( state.action.requestType == "paging" && state.action.name == "actionBegin") {
     // console.log( this.arraycol[0].Payroll)
    
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
        if( this.arraycol.length!=0)
        {
          if(this.arraycol[0].Payroll.Pagesize!=state.take)
          {
            this.arraycol[0].Payroll.Pagesize = state.take
             console.log( this.arraycol[0].Payroll.Pagesize,"paging")
            this.SaveColumnwidth();
          // }
  
        }}
      }
    // this.ListSendBO.userId = this.global.userID;

  }
  //////////Date change event////////////////////////////////////
  editdate(event: IMyInputFieldChanged) {
    // console.log(event);
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      // console.log(value.substring(2, 3))
      this.editDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    //this.startDate =
  }
  payrollPayDateChanged = false;
  editPayrollPaydate(event: IMyInputFieldChanged) {
    this.payrollPayDateChanged = true;
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.payrollPayDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    //this.startDate =
 //   console.log(this.payrollPayDate, " this.payrollPayDate");

  }
  editdatechage(event: IMyDateModel) {
    // console.log(event);
    this.editDate = event.formatted;
    this.updatevalchange = true;
    // console.log("StartDate ",this.startDate)

  }
  editPayrollPaydatechage(event: IMyDateModel) {
    this.payrollPayDateChanged = true;
    this.payrollPayDate = event.formatted;

  }
  Certificationstartdatechange(event: IMyInputFieldChanged) {
    // console.log(event);
    this.isTouched = true;
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      // console.log(value.substring(2, 3))
      this.startDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    //this.startDate =
  }

  onDateChangedCertificationStart(event: IMyDateModel, startDate, endDate, cliName) {
    // console.log(event);
    this.startDate = event.formatted;
  //  console.log("StartDate ", this.startDate)
    // console.log(endDate==undefined||endDate==null||endDate=="")
    // console.log(endDate)
    if (endDate == undefined || endDate == null || endDate == "") {
      this.startdates(event.formatted, this.endDate, cliName);
    }
    else {
      if (new Date(event.formatted).getTime() > new Date(endDate).getTime()) {
        this.dateerror = true;
        this.dateerrormsg = "End Date should be greater than start Date";
        setTimeout(() => {
          this.dateerror = false;
          this.dateerrormsg = "";
        }, 3000);
      }
      else {
        this.startdates(event.formatted, this.endDate, cliName);


      }
    }
    //this.startdates(this.startDate,endDate,cliName);
  }

  Certificationstartdatechange2(event: IMyInputFieldChanged) {
    // console.log(event);
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      // console.log(value.substring(2, 3))
      this.filterStartDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    //this.startDate =
  }

  onDateChangedCertificationStart2(event: IMyDateModel) {
    // console.log(event);
    this.filterStartDate = event.formatted;
    //  console.log("StartDate ",this.startDate)
    //this.startdates(this.startDate,endDate,cliName);
  }
  Certificationstartdatechange3(event: IMyInputFieldChanged) {
    // console.log(event);
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      // console.log(value.substring(2, 3))
      this.filterEndDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    //this.startDate =
  }

  onDateChangedCertificationStart3(event: IMyDateModel) {
    // console.log(event);
    this.filterEndDate = event.formatted;
    // console.log("StartDate ",this.startDate)
    // this.startdates(this.startDate,endDate,cliName);
  }
  Certificationstartdatechange1(event: IMyInputFieldChanged) {
    // console.log(event);
    this.isTouched = true;
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      // console.log(value.substring(2, 3))
      this.endDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }
  dateerrormsg: any;
  dateerror: boolean = false;
  onDateChangedCertificationStart1(event: IMyDateModel, startDate, endDate, cliName) {

    //   console.log(event);
    //  console.log(startDate);
    //  console.log(endDate);
    //  console.log(startDate>event.formatted);
    //   console.log(cliName);
    this.endDate = event.formatted;
    if (new Date(startDate).getTime() > new Date(event.formatted).getTime()) {
      this.dateerror = true;
      this.dateerrormsg = "End Date should be greater than start Date";
      setTimeout(() => {
        this.dateerror = false;
        this.dateerrormsg = "";
      }, 3000);
    }
    else {
      this.startdates(startDate, this.endDate, cliName);


    }

    // console.log("StartDate ",this.endDate)
  }
  updatevaluechange() {
    this.updatevalchange = true;
  }



  viewpopup(args: any) {
    var grid = (parentsUntil(args.target, 'e-grid') as any);
  //  console.log(grid.ej2_instances[0].getRowInfo(args.target).rowData);
    this.result2 = grid.ej2_instances[0].getRowInfo(args.target).rowData;
  //  console.log(this.result2, "data")
    let payrollId = this.result2.payrollId;
    let payrolllineId = this.result2.id;
    let timesheetsId = this.result2.timesheetId;
    let val1;
   // console.log(this.TimesheetLst);
    val1 = this.TimesheetLst.filter(s => s.employeeId == this.result2.employeeID);
   // console.log(val1);
    // let val=val1[0].payrollLineDetails.filter(t=>t.id==payrolllineId);
  //  console.log(val1);
    // console.log(val); 
    document.getElementById('viewpop').click();
    this.editid = payrolllineId;
    this.editPayrollId = payrollId;
    this.edittimesheetId = timesheetsId;
    this.editClient = this.result2.clientName;
    this.editDate = new Date(this.result2.timesheetDate).toLocaleDateString();
    this.editNotes = this.result2.notes;
    this.editservice = this.result2.serviceCode;
    this.edittime = this.result2.totalHours;
  //  console.log(this.editDate);
    this.updatevalchange = false;
  }
  ///////////////time validation///////////////////////////////
  numberonly(event: any, type) {

   // console.log(event);
    if (((event.which < 48 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 57) && ((event.which < 96 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 105)) {
      event.preventDefault();
    }
    let txt = "";
    if (type == "create") {
      txt = event.target.innerHTML;
    }
    if (type == "update") {
      txt = this.edittime;
    }
    if (type == "All") {
      txt = this.Allhours;
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

      //if(event.which==46)
      //{
      //event.preventDefault();
      //event.target.innerHTML=txt+event.key;
      //   event.stopPropagation();
      //   event.target.focus();
      // // console.log( event.target.innerHTML.length);
      //  var range = document.createRange();
      //  var sel = window.getSelection();
      //  range.setStart(event.target.firstChild,event.target.innerHTML.length);
      //  range.setEnd(event.target.firstChild,event.target.innerHTML.length);
      //  range.collapse(true);
      //  sel.removeAllRanges();
      //  sel.addRange(range);
      //   }
      // if(txt>2)
      // {
      //   if(event.which!=46)
      //   {
      //     event.preventDefault();
      //   }
      // }
    }

    if (txt.length == 2) {
      // console.log(txt[1])
      let tempdata = txt.split("");
      if (!(tempdata[1] == ".")) {
        if (tempdata[0] == ".") {
      //    console.log(tempdata[1])
          if (tempdata[1] == "5" || tempdata[1] == "0") {

            if (!(event.which == 48)) {


              event.preventDefault();
            }
          }
          if (tempdata[1] == "2" || tempdata[1] == "7") {

            if (!(event.which == 53)) {
              //  console.log(tempdata[1])

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
      //console.log(txt)
      let tempdata = txt.split("");
      // console.log(tempdata);
      if (tempdata[0] == ".") {
        event.preventDefault();
      }
      if (tempdata[2] == ".") {
        //  console.log(tempdata[1])
        if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
          //   console.log(tempdata[1])

          event.preventDefault();
        }

      }
      if (tempdata[1] == ".") {
        //    console.log(tempdata[1])
        let tempdata1 = txt.split(".");
        // console.log(tempdata);
        if (tempdata1[1] == "5" || tempdata1[1] == "0") {
          //  console.log(tempdata[1])
          if (!(event.which == 48)) {
            //  console.log(tempdata[1])

            event.preventDefault();
          }
        }
        if (tempdata1[1] == "2" || tempdata1[1] == "7") {
          // console.log(tempdata[1])
          if (!(event.which == 53)) {
            //  console.log(tempdata[1])

            event.preventDefault();
          }
        }
      }
    }
    if (txt.length == 4) {
      let tempdata = txt.split(".");
      // console.log(tempdata[1].length)
      if (tempdata[1].length == 2) {
        event.preventDefault();
      }
      // console.log(tempdata);
      if (tempdata[1] == "5" || tempdata[1] == "0") {
        //   console.log(tempdata[1])
        if (!(event.which == 48)) {
          // console.log(tempdata[1])

          event.preventDefault();
        }
      }
      if (tempdata[1] == "2" || tempdata[1] == "7") {
        //    console.log(tempdata[1])
        if (!(event.which == 53)) {
          //    console.log(tempdata[1])

          event.preventDefault();
        }
      }
    }





    let val = txt.split('.');
    //  console.log(val);
    // if((val[1])>6)
    // {
    //   event.preventDefault();
    // }
    if (txt.length > 4) {
      event.preventDefault();
    }
    //event.preventDefault();



  }
  //////////////////////Data bound fun///////////////////////////////////////
  rowDataBound(args) {
    // const claimStatus = 'claimStatus';
    //console.log(args);
    if (args.data['totalAmount'] == 0 || args.data['totalAmount'] == null || args.data['totalAmount'] == '') {
      // args.row.style.background= 'red';
      args.row.style.color = 'white';
      args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
      args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
    }
  }

  public actionComplete(args) {

  // console.log(args) 
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
  
    // console.log(hidearr, "hidearr")
    // console.log(showarr, "showarr");
    // console.log(this.arraycol, "arraycol");
  
    var count = 0;
    var count1 = 0;
    if (args.columns.length > 0) {
  if(this.arraycol.length > 0)
  {
    this.arraycol[0].Payroll.ShowColumns.forEach(old => {
      showarr.forEach(element => {
        if (old == element) {
          count1 = count1 + 1;
        }
      });
  
    });
  
    this.arraycol[0].Payroll.HideColumns.forEach(old => {
      hidearr.forEach(element => {
        if (old == element) {
          count = count + 1;
        }
      });
  
    });
  //  console.log(count, count1, "count");
  
  
    if (this.arraycol[0].Payroll.ShowColumns.length != count1 || this.arraycol[0].Payroll.HideColumns.length != count) {
      this.arraycol[0].Payroll.ShowColumns = showarr;
      this.arraycol[0].Payroll.HideColumns = hidearr;
      this.SaveColumnwidth();
    }
  }
    
    }
  }
    var grid = (parentsUntil(args.target, 'e-grid') as any);
 //   console.log(grid, "griddata");
    if (args.requestType === 'save') {
      var grid = (parentsUntil(args.target, 'e-grid') as any);
  //    console.log(grid, "griddata");

    }
    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      this.ListSendBO.type = args.columnType
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
    //    console.log("args type", this.conditionlist);
      });
    }
  }

  rowDataBound1(args) {
    // const claimStatus = 'claimStatus';
    if (args.data['bit'] > 0) {
      args.row.style.color = 'White';
      // args.row.style.background = '#EC7063';
    }
  }
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === 'over275Hrs') {
      if (args.data[args.column.field] > 275) {
        args.cell.classList.add('below-30');
      }
    }
    if (args.column.field === 'overDaily16Hours') {
      if (args.data[args.column.field] > 16) {
        args.cell.classList.add('below-30');
      }
    }
  }

  ////====================Lock payroll=============================/////////////
  lockPayroll(args) {
    var grid = (parentsUntil(args.target, 'e-grid') as any);
  //  console.log(grid.ej2_instances[0].getRowInfo(args.target).rowData);
    let val = grid.ej2_instances[0].getRowInfo(args.target).rowData;
  //  console.log(val, "val==============");

    if (val.islocked == false) {
      this.ispayrolllocked = false;
      this.payrollLockId = val.id;
      // this.confirmLockStatus();
    }
    else {
      this.ispayrolllocked = true;
      this.payrollUnLockId = val.id;
      // this.UnLockStatus()
    }
  }
  /////////////////////////////get Authorization//////////////////////
  startdates(startdate, enddate, clientsid) {
    //console.log(startdate);
    if (startdate == undefined || startdate == "undefined" || startdate == 'undefined') {
      this.eanbleend = true;
      // this.eanbleservice=true;
    } else {
      this.eanbleend = false;
    }
    if (enddate == undefined || enddate == "undefined" || enddate == 'undefined') {
      this.eanbleservice = true;
    } else {
      this.eanbleservice = false;
    }

    // console.log(clientsid);
    //console.log(startdate);
    // console.log(enddate);
    // if(this.cliName!=""){
    //   this.isIns=true;
    // }
    // console.log("1");
    startdate = this.datePipe.transform(startdate, 'MM-dd-yyyy');
    enddate = this.datePipe.transform(enddate, 'MM-dd-yyyy');
    // console.log(startdate);
    // console.log(enddate);
    // console.log(startdate<enddate)
    if (clientsid == undefined || clientsid == '' || clientsid == "") {
      clientsid = null
    }
//    console.log((startdate < enddate) || (startdate == enddate))
    if (startdate != null && enddate != null && clientsid != null) {
      if ((new Date(startdate).getTime() < new Date(enddate).getTime()) || (startdate == enddate)) {
        // console.log("True");

        let parameter = new URLSearchParams();
        parameter.append("startdate", startdate)
        parameter.append("enddate", enddate)
        parameter.append("clientid", clientsid)
        // console.log(parameter);
        this.httpService.getAuthoizationDetails(parameter).subscribe((data: timesheetClientAuthBO[]) => {
          let temporarysvcode = [];
          // console.log(data);
          let i;
          this.serviceName = "";
          this.orderList = [];
          let service = [];
          if (data.length != 0) {
            for (i = 0; i < data.length; i++) {
              service[i] = { value: data[i].masterServiceCode, label: data[i].masterServiceCode, key: data[i].masterServiceId };
              // this.serviceList.push(data1);
              if (data[i].billingunit != '0') {
                let diffDays = Math.round(Math.abs(new Date(data[i].endDate).getTime() - new Date(data[i].startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
                let units = data[i].totalUnits / diffDays;
                data[i].totalunitperday = units / data[i].billingunit;
                data[i].totalunitperday = data[i].totalunitperday.toString();
                let vals = data[i].totalunitperday.split('.');
                let vals2 = 0 + "." + vals[vals.length - 1];
                //data[i].totalunitperday=vals[0];
                // console.log(vals);
                // console.log(vals2);
                if (parseFloat(vals2) < 0.25) {

                  data[i].unithr = vals[0];
                  data[i].unitmin = "0";

                }
                else if (parseFloat(vals2) < 0.50) {
                  data[i].unithr = vals[0];

                  data[i].unitmin = "15";

                }
                else if (parseFloat(vals2) < 0.75) {
                  data[i].unithr = vals[0];

                  data[i].unitmin = "30";
                }
                else if (parseFloat(vals2) < 1) {
                  data[i].unithr = vals[0];
                  data[i].unitmin = "45";
                }

              }
              else {
                data[i].unithr = "0";
                data[i].unitmin = "0";
              }
            }
            // this.serviceList=service;
          }

          this.authorizationdetails = data;
          //console.log(this.authorizationdetails);
          if (this.authorizationdetails.length == 0) {
            this.dontshowAuth = true;
            this.isIns = false;
          }
          else {
            this.dontshowAuth = false;
            this.isIns = true;
          }
          // console.log(temporarysvcode);
          // this.serviceName=temporarysvcode;
          // console.log(this.serviceName);
          // console.log("1");

        },
          err => {
            // console.log(err);
            this.dontshowAuth = false;
            this.serviceName = "";
            this.orderList = [];
          })
      }
    }
  }


  async filter() {
    if ((this.filterStartDate == undefined || this.filterStartDate == "") &&
      (this.filterEndDate != undefined && this.filterEndDate != "") ||
      ((this.filterEndDate == undefined || this.filterEndDate == "") && (this.filterStartDate != undefined && this.filterStartDate != ""))) {
      this.toastrService.error('select start and end date', 'Warning');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);

      return;
    }
    if (new Date(this.filterStartDate).getTime() > new Date(this.filterEndDate).getTime()) {
      this.toastrService.error('End date should be grater than Start date ', 'Warning');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);

      return;
    }
    if (this.filterStartDate == undefined) {
      this.filterStartDate = "";
    }
    if (this.filterEndDate == undefined) {
      this.filterEndDate = "";
    }
    if (this.employee == undefined) {
      this.employee = 0;
    }
    if (this.client == undefined) {
      this.client = 0;
    }
    if (this.payer == undefined || this.payer == null) {
      this.payer = 0;
    }
    //await this.getFilterTotal();
    await this.getFilterTotalItemNew();

  }



  async getFilterTotalItem() {
    //this.payer = 0;
    //this.employee = 0;
    //this.client = 0;
    // this.filterStartDate=null;
    // this.filterEndDate=null;
    //console.log(this.filters);
    let url = "api/Payroll/getPayrollunlocked?";
    let param = new URLSearchParams();
    this.ListSendBO.fromDate = this.filterStartDate;
    this.ListSendBO.toDate = this.filterEndDate;
    this.ListSendBO.employeeId = this.employee;
    this.ListSendBO.clientId = this.client;
    this.ListSendBO.paydateLid = this.payer == null ? 0 : this.payer;
    this.ListSendBO.agency = this.global.globalAgencyId;
    // param.append("FromDate", this.filterStartDate)
    // param.append("ToDate", this.filterEndDate)
    // param.append("EmployeeId", this.employee)
    // param.append("ClientId", this.client)
    // param.append("PaydateLid", this.payer)  
    // param.append("agency",this.agencyId)
    //agencyId
    //  console.log(this.p);
    //  console.log(param);
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //   })
    // }
    await this.http.get(url + param).subscribe((data: any) => {
   //   console.log("TimesheetLst", data);
      this.TimesheetLst = data;
      let parentArray = [];
      let childArray = [];


      if (data.length != 0) {
        data.forEach(element => {
          let obj =
          {
            'id': element.id,
            'employeeID': element.employeeID,
            'employeeName': element.employeeName,
            'islocked': element.islocked,
            'lockStatus': element.islocked == false ? "No" : "Yes",
            'payDate': element.payDate != null ? this.datePipe.transform(element.payDate, "MM/dd/yyyy") : null,
            'payrollId': element.id,
            'totalAmount': element.totalAmount,
            'bit': 0,
            'totalWorkedHrs': element.totalWorkedHrs
          }
      //    console.log(element.payrollLineDetails);

          element.payrollLineDetails.forEach(element1 => {
            let obj1 =
            {
              'id': element1.id,
              'payrollId': element1.payrollId,
              'clientId': element1.clientId,
              'paydate': element.payDate,
              'islocked': element.islocked,
              //'employeeID': element.payroll[0].employeeID,
              'clientName': element1.clientName,
              'masterServiceId': element1.masterServiceId,
              'timesheetDate': this.datePipe.transform(element1.timesheetDate, "MM/dd/yyyy"),
              'serviceCode': element1.serviceCode,
              "payablehrs": element1.payablehrs,
              'totalHours': element1.totalhrs,
              'notes': element1.notes,
              'employeeServicePayrate': element1.employeeServicePayrate,
              'timesheetId': element1.timesheetId,
              'payRateLid': element1.payRateLid

            }
            childArray.push(obj1);
          });

        //  console.log(childArray);
          parentArray.push(obj);
        });
     //   console.log(parentArray);
        this.parentData = parentArray;
        this.childData = childArray;
        this.childGrid = {
          dataSource: this.childData,
          rowDataBound: this.rowDataBound1,
          queryCellInfo: this.customiseCell,
          queryString: 'payrollId',
          allowSorting: false,
          allowPaging: false,
          load() {
            this.registeredTemplate = {};
          },
          editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

          columns: [

            { field: 'clientName', headerText: 'Client', width: 75, },
            { field: 'timesheetDate', headerText: 'Timesheet Date', width: 100 },
            { field: 'serviceCode', headerText: 'Code', width: 80 },
            { field: 'totalHours', headerText: 'Total Hours', width: 100 },
            { field: 'payablehrs', headerText: 'Payable Hours', width: 100 },
            { field: 'notes', headerText: 'Notes', width: 50 },
            { headerText: 'Edit', width: 50, template: this.childtemplate }
          ]
        };
        // console.log("child", this.childGrid)
        // console.log("parent", this.parentData)
      }
      else {
        this.parentData = [];
        this.childData = [];
      }



    });
  }

  async getFilterTotalItemNew() {
    // this.payer = 0;
    // this.employee = 0;
    // this.client = 0;
    // this.filterStartDate=null;
    // this.filterEndDate=null;
    //console.log(this.filters);
    let url = "api/Payroll/getPayrollunlocked?";
    let param = new URLSearchParams();
//console.log(this.filterStartDate,"this.filterStartDate====");

    this.ListSendBO.fromDate =(this.filterStartDate != ''?new Date(new Date(this.filterStartDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString():"");
    this.ListSendBO.toDate =(this.filterEndDate != ''? new Date(new Date(this.filterEndDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString():"");
    this.ListSendBO.employeeId = parseInt(this.employee);
    this.ListSendBO.clientId = parseInt(this.client);
    this.ListSendBO.paydateLid = this.payer == null ? 0 : parseInt(this.payer);
    this.ListSendBO.agency = parseInt(this.global.globalAgencyId);
    this.ListSendBO.currentpageno = this.pagshort.currentPgNo;
    this.ListSendBO.orderColumn = this.pagshort.shortcolumn;
    this.ListSendBO.orderType = this.pagshort.shortType;
    this.ListSendBO.pageitem = parseInt(this.pagshort.itemperpage.toString());
  //  console.log(this.selectedpayrollid, "selectedpayrollid ================");
    this.gethttp.execute(this.ListSendBO);
    let count=0
    this.data.subscribe((datas: any) => {
    //  console.log(datas)
      count++;
      // console.log(this.selectedpayrollid, "selectedpayrollid ================");
      // console.log(data, "selectedpayrollid ================");
      this.TimesheetLst = this.gethttp.getwholeData();
      this.parentData = datas.result;
      this.childData = this.gethttp.getChildData();

      this.grid.childGrid.dataSource = this.childData;
      this.grid.childGrid.columns = [

        { field: 'clientName', headerText: 'Client', width: 75, },
        { field: 'timesheetDate', headerText: 'Timesheet Date', width: 100 },
        { field: 'serviceCode', headerText: 'Code', width: 80 },
        { field: 'totalHours', headerText: 'Total Hours', width: 100 },
        { field: 'payablehrs', headerText: 'Payable Hours', width: 100 },
        { field: 'notes', headerText: 'Notes', width: 50 },
        { headerText: 'Edit', width: 50, template: this.childtemplate }
      ]
      if(datas!=null&&datas!=undefined&&count==1)
      {
       // console.log("get data call")
        this.getColumnwidth();
      }
//this.getColumnwidth();
    });
  }

  /////////////Status fun/////////////////////
  getStatus() {
    let params = new URLSearchParams();
    params.append("Code", "PAYDATESTATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/LovDropDownBatch?"
    this.httpService.getstatus(params).subscribe((data: StatusList[]) => {
      this.statusList = data;
      // this.statusList.forEach(element => {
      //   element.label = element.Value;
      //   element.value = element.Key.toString();
      // })
      this.statusList.push({ Key: 0, Value: "All" });
      this.payer = 0;
    }, (err: HttpErrorResponse) => {
      //alert("err");
    })
  }
  ///////////Employee get fun//////////////////////////////////
  getemployee() {
    // console.log("checkkkkkkkkkkkkkkkkkkkkkkk"); 
    let param = new URLSearchParams();
    param.append("AgencyId", this.agencyId);
    let url = "api/Client/GetEmpListbyId?"
    this.httpService.getEmployeeList(param).subscribe((data: EmployeeList[]) => {
      this.employeelists = data;
      this.employeelists.forEach(element => {
        element.label = element.Value,
          element.value = element.Key
      })

    },
      err => {
        // console.log(err);

      })
  }
  /////////////////////////////get client//////////////////
  getclients() {
    let param = new URLSearchParams();
    param.append("AgencyId", this.agencyId);
    //let url="api/Client/GetEmpListbyId?"
    let url = "api/Client/GetClientListbyTd?"
    this.httpService.getClientList(param).subscribe((data: ClientBO1[]) => {
      this.clientFilter = data;
      data.forEach(element => {
        element.value = element.id.toString()
        this.clientid = element.value
        element.label = element.names
      });
      this.clientlist = data;
      // this.dontshowAuth=false;
      // console.log('clien', this.clientlist);
      // console.log("ki", this.clientFilter);
    },
      err => {
        // console.log(err);
        // this.dontshowAuth=true;
      })
  }

  getpayer() {
    let url = "api/GroupPayor/CommonGetGPList?";
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getPayorList(params).subscribe((data: PayorList[]) => {
      // console.log(data);
      let temp: any = [];
      let tempdata = {};
      let i;
      for (i = 0; i < data.length; i++) {
        temp[i] = { value: String(data[i].Key.toString()), label: data[i].Value };
      }
      // data.forEach(s=>tempdata={value:s.id.toString(), label:s.payorFullName},
      // temp.push(tempdata) );
      // console.log(temp);
      this.payerLst = temp;
    })
  }
  showdata() {
  //  console.log("payer", this.payer);
  }


  excelErr: any = "";
  employeelist1: any = [];
  currentDate: any;
  downloadexcel() {

    this.currentDate = new Date().toLocaleDateString();

  //  console.log(this.currentDate);
    this.employeelist1.fromdate = this.currentDate;
    this.employeelist1.todate = this.currentDate;
    //  this.dialogService.open(download)


  }


  ////////////print fun //////////////////////////
  print() {

    let url = "api/Payroll/getExceldata?"
    if ((this.employeelist1.fromdate == null || this.employeelist1.fromdate == '') &&
      (this.employeelist1.todate == null || this.employeelist1.todate == '')) {
      this.excelErr = "Select from date and to date to proceed";
    }
    else {
      // console.log(this.employeelist1.fromdate);
      // console.log(this.employeelist1.todate);

      let myParams = new URLSearchParams();
      myParams.append("AgencyId",this.global.globalAgencyId)
      myParams.append("FromDate", this.employeelist1.fromdate == undefined ? null : this.employeelist1.fromdate);
      myParams.append("ToDate", this.employeelist1.todate == undefined ? null : this.employeelist1.todate);
      myParams.append("EmployeeId", this.employeelist1.employeeId == undefined || this.employeelist1.employeeId == '' ? 0 : this.employeelist1.employeeId);
      this.httpService.getExcelData(myParams).subscribe((data: PayrollexcelBO[]) => {
     //   console.log(data);
        this.Printdata = data;
        //  console.log(this.Printdata);
        if(this.Printdata.length != 0)
        {
          this.excelformatarlst = [];
          //  window.print();
          //  var printContents = document.getElementById('table_print').innerHTML;
          //  var originalContents = document.body.innerHTML;
          var a = window.open('', '', 'height=500, width=500');
          a.document.write('<html>');
          a.document.write('<body ><table class="table table-hover table-bordered table-responsive" style="margin-top: 5px;margin-left: 10px;border:solid #000 !important; border-width:1px 0 0 1px !important;">');
          a.document.write('<tbody>');
          this.Printdata.forEach(element => {
            a.document.write('<tr style="border:solid #000 !important; border-width:1px 0 0 1px !important;">');
            if (element.id != null) {
              a.document.write(' <td style="text-align: right;font-weight: 600;border:solid #000 !important;border-width:0 1px 1px 0 !important;">' + element.id + '</td>');
  
            }
            a.document.write(' <td style="text-align: left;font-weight: 600;border:solid #000 !important;border-width:0 1px 1px 0 !important;">' + element.employeeName + '</td>');
            a.document.write(' <td style="text-align: left;font-weight: 600;border:solid #000 !important;border-width:0 1px 1px 0 !important;">' + element.payDate + '</td>');
            a.document.write(' <td style="text-align: left;font-weight: 600;border:solid #000 !important;border-width:0 1px 1px 0 !important;">' + element.totalWorkedHrs + '</td>');
            a.document.write(' <td style="text-align: left;font-weight: 600;border:solid #000 !important;border-width:0 1px 1px 0 !important;">' + element.totalAmount + '</td>');
            a.document.write('</tr>');
          });
  
          a.document.write(' </tbody>  </table>');
  
          //  a.document.write(printContents); 
          a.document.write('</body></html>');
          a.document.close();
         
          a.print();
        }
        else{
          this.toastrService.error("Data Not Found")
          setTimeout(() => {
            this.toastrService.clear()
          }, 3000);
        }

       
        //  document.body.innerHTML = printContents;

        //  window.print();
        //  document.body.innerHTML = originalContents;

        //   this.excelformatarlst= data;
        // this.filterxcllist(data);


        // this.exportAsExcelFormatFile('Employee_Import_Excel_Format')

        this.employeelist1 = {
          fromdate: this.currentDate,
          todate: this.currentDate,
          employeeId: 0,
        }
        //this.uploadTimeSheetLoading=false;
      })
    }


  }







  //==========================downold report function==========================================================//
  downloadreport() {

    let url = "api/Payroll/getExceldata?"
    if ((this.employeelist1.fromdate == null || this.employeelist1.fromdate == '') &&
      (this.employeelist1.todate == null || this.employeelist1.todate == '')) {
      this.excelErr = "Select from date and to date to proceed";
    }
    else {
      // console.log(this.employeelist1.fromdate);
      // console.log(this.employeelist1.todate);

      let myParams = new URLSearchParams();
      myParams.append("AgencyId",this.global.globalAgencyId)
      myParams.append("FromDate", this.employeelist1.fromdate == undefined ? null : this.employeelist1.fromdate);
      myParams.append("ToDate", this.employeelist1.todate == undefined ? null : this.employeelist1.todate);
      myParams.append("EmployeeId", this.employeelist1.employeeId == undefined || this.employeelist1.employeeId == '' ? 0 : this.employeelist1.employeeId);
      this.httpService.getExcelData(myParams).subscribe((data: PayrollexcelBO[]) => {
   //     console.log(data);
        this.Printdata = data;
        //  console.log(this.Printdata);
        if(this.Printdata.length != 0)
        {
          this.excelformatarlst = [];
          
          ///document.getElementById("openpdfdata").click();
           this.pdflist1.portrait = true,
           this.pdflist1.scale = 0.8,
            setTimeout(() => {
             
             this.pdflist1.saveAs("PayRollReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
         //    document.getElementById("openpdfdata").click();
            },400);
    
        }
        else{
          this.toastrService.error("Data Not Found")
          setTimeout(() => {
            this.toastrService.clear()
          }, 3000);
        }

       
       

        this.employeelist1 = {
          fromdate: this.currentDate,
          todate: this.currentDate,
          employeeId: 0,
        }
        //this.uploadTimeSheetLoading=false;
      })
    }


  }
  /////////=======================Export Excel Sheet=========================////////////////
  exportAsExcelFile(excelFileName: string): void {


    this.jssheet = JSON.parse(JSON.stringify(this.reportList));
    //Console.log("JS",this.jssheet);      
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.jssheet)
    //Console.log('worksheet',ws);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  // exportToExcel(ref) {
  //   const ws: XLSX.WorkSheet =   
  //   XLSX.utils.table_to_sheet(this.table.nativeElement);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'excelreport.xlsx');
  //   ref.close();
  //  }


  filterxcllist(clilist) {
    //Console.log("clilist",clilist);  
    this.reportList = [];
    //Console.log("clientlist",this.clientlist);  
    clilist.forEach(element => {
      let obj = new ReportBO();
      obj.Employee_Name = element.employeeName;
      obj.Total_Amount = element.totalAmount;
      obj.Total_WorkedHrs = element.totalWorkedHrs;
      this.reportList.push(obj);

    });
    this.exportAsExcelFile('Payroll_Report');
  }
  /////////======================Refresh Fun===================================////////////
  Refresh() {
    this.filterStartDate = "";
    this.filterEndDate = "";
    // this.sorting.currentPgNo = 1;
    // this.filterStartDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    // this.filterEndDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.employee = 0;
    this.client = 0;
    this.payer = 0;
    this.parentData = [];
    this.childData = [];
    this.grid.dataSource = "";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = "";
    this.ListSendBO.type = "string"
    this.ListSendBO.field = "EmployeeName"
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;

    this.pagshort = new sortingObj();
    this.pagshort.shortcolumn = "EmployeeName"
    this.pagshort.shortType = 'ASC';
    // this.data = this.gethttp;
    // this.filter();
    // this.ngOnInit();
  }
  ////////////////////////////// update Manual Entry/////////////////

  updatetimesheet() {
    this.isTouched = false;
    let temp = {
      id: this.editid,
      payrollId: +this.editPayrollId,
      timesheetId: +this.edittimesheetId,
      totalhrs: parseFloat(this.edittime),
      timesheetDate: new Date(new Date(this.editDate).toDateString() + " "
        + "00:00:000" + " " + "GMT").toISOString(),
      notes: this.editNotes
    }
  //  console.log(temp);
    let url = "api/Payroll/UpdatePayroll"
    // this.savetimesheet=
    // {
    //   CLientID:this.clientsid,
    //   EmployeeID:this.employeeid,
    //   MasterserviceID:this.MasterservID
    // }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }
    this.httpService.UpdateTimesheet(temp).subscribe((data: number) => {

      // console.log(data);
      this.orderList = "";
      this.closeEntry();
      this.filter();
      this.toastrService.success('Payroll has been updated successfully!', 'Payroll updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      // this.toastrService.show(
      //   'Payroll has been updated successfully!',
      //   'Payroll updated',
      //   { status }), 3000;
      document.getElementById('OpenModal5').click();
    },
      err => {
        status = 'danger';
        // console.log(err);
        this.updateerror = true;
        this.updateerrormsg = err.error;
        setTimeout(() => {
          this.updateerror = false;
          this.updateerrormsg = " ";
        }, 3000);
        //  this.toastrService.show(
        //    'Timesheets Error',
        //    err.error,
        //    {status}),3000;
        // console.log(err);

      })
    // console.log(temp);
  }
  closeEntry() {

    this.isManualEntry = false;
    this.isEmp = false;
    this.dontshowAuth = false;
    this.isIns = false;
    this.cliName = "";
    this.isCliInfo = false;


    // this.serviceName=""
  }
  /////======================check box change fun=======================/////////
  show1(args: any): void {
    var customselect = [];
    // this.grid
    //console.log(args,args);

  //  console.log(args, "args")
    var grid = (parentsUntil(args.target, 'e-grid') as any);
    // this.mulitpledata = []

    let val = args.selectedRowIndexes;
    // console.log(args.selectedRowIndexes)
    // console.log(val.length)

    if (val.length > 0) {
      var row1: any = this.grid.getSelectedRecords();
     // console.log("row1", row1)
      this.selectedpayrollid = row1.filter(t => t.totalAmount != 0 && t.totalAmount != null && t.totalAmount != '').map(r => r.id);

     // console.log(this.selectedpayrollid, 'selectedpayroll')

    }
    else {
      this.selectedpayrollid = []

    }
    if (this.selectedpayrollid.length == 0) {

    }
    for (var i = 0; i < args.selectedRowIndexes.length; i++) {
      var row = this.grid.getRowByIndex(args.selectedRowIndexes[i]);



      if (!row.querySelector('.disablecheckbox')) {
      //  console.log(row1, "Row")

        customselect.push(args.selectedRowIndexes[i])

      }
    }
    //console.log(this.mulitpledata, "multipledata")
    this.grid.selectRows(customselect)
   // console.log(customselect, "customselectcustomselect")


    //console.log(this.Type, "TUPE")

  }
  validatebutton(args: QueryCellInfoEventArgs) {

 //   console.log(args.column.field);
    if (args.column.field == "Actions") {
  //    console.log(args)
      if (args.data['totalAmount'] == "" || args.data['totalAmount'] == null || args.data['totalAmount'] == 0) {

       // console.log("args.data====", args.data['totalAmount']);

        args.cell.firstElementChild.firstElementChild.classList.add('disableedit')
      }

    }

  }

  unlockPayroll(args) {
    var grid = (parentsUntil(args.target, 'e-grid') as any);
   // console.log(grid.ej2_instances[0].getRowInfo(args.target).rowData);
    let val = grid.ej2_instances[0].getRowInfo(args.target).rowData;
    this.payrollUnLockId = val.id;
    // this.dialogService.open(showerror);
  }

  UnLockStatus() {
    let payrollId: PayrollId = new PayrollId();
    payrollId.PayrollId = this.payrollUnLockId;
    let myParams = new URLSearchParams();
    myParams.append("PayrollId", this.payrollUnLockId.toString());
    let url = "api/Payroll/UnLockPayroll?PayrollId=" + this.payrollUnLockId;
    this.httpService.UnLockStatus(payrollId).subscribe((data: number) => {
      document.getElementById('OpenModal4').click();
      this.toastrService.success('Payroll has been unlocked successfully', 'Payroll Unlockded');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      this.getFilterTotalItemNew();
      this.ispayrolllocked = false;

      // ref.close();


    })
  }
  confirmLockStatus() {
    let payrollId: PayrollId = new PayrollId();
 //   console.log(payrollId, "payrollId==========");
    payrollId.PayrollId = this.payrollLockId;
  //  console.log(payrollId, "payrollId==========");
    let myParams = new URLSearchParams();
    myParams.append("PayrollId", this.payrollUnLockId.toString());
    let url = "api/Payroll/LockPayroll?PayrollId=" + this.payrollLockId;
    this.httpService.confirmLockStatus(payrollId).subscribe((data: number) => {
      document.getElementById('OpenModal4').click();
      this.toastrService.success('Payroll has been locked successfully', 'Payroll locked');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      this.getFilterTotalItemNew();
      // ref.close();

      this.ispayrolllocked = false;

      // this.toastrService.show(
      //   'Payroll has been locked successfully',
      //   'Payroll locked', { status }), 8000
    })
  }

  /////////////=========================Toolbar click event==================================////////

  getdata(args) {
   // console.log(args)
    if (args.data['totalAmount'] == 0 || args.data['totalAmount'] == null || args.data['totalAmount'] == '') {
      args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
      args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
    }

  }
  ///////////////Date Change Fun////////////////////////
  newdates(event, name, date) {
    let val = this.dateservice.Datechange(event);
    if (name == 'inputchage') {


    }
    else if (name == 'datechagned') {
      let val = this.dateservice.Datechange(event);
      if (date == 'employeelist1.fromdate') {
        this.employeelist1.fromdate = val;
        // console.log(val);
        // console.log(event);
      }
      else if (date == 'employeelist1.todate') {

        this.employeelist1.todate = val;
      }
    }
  }
  UpdatePaydate() {

    var paydate = this.payrollPayDate != null && this.payrollPayDate != undefined && this.payrollPayDate != "" ? new Date(new Date(this.payrollPayDate).toDateString() + " "
      + "00:00:000" + " " + "GMT").toISOString() : "";
  //  console.log("date======", paydate);

    let myParams: UpdatepaydateBO = {
      payrollId: this.selectedpayrollid.toString(),
      payDate: paydate
    }
    // let myParams = new URLSearchParams();
    // myParams.append("PayrollId", this.selectedpayrollid);
    // myParams.append("Paydate", paydate);
    this.httpService.UpdatePaydate(myParams).subscribe((data: number) => {
      // ref.close();
      this.getFilterTotalItemNew();
      this.PayrateRequired = false;
      this.payrollPayDateChanged = false;
      document.getElementById('OpenModal3').click();
      this.toastrService.success('Pay date has been updated successfully', 'Pay date updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      //   this.toastrService.show(
      //     'Pay date has been updated successfully',
      //     'Pay date updated',{status}),8000
    },
      (err: HttpErrorResponse) => {
        this.saveErr = err.error
      });
  }

  excelformatfunction() {

    let url = "api/Payroll/getExceldata?"
    if ((this.employeelist1.fromdate == null || this.employeelist1.fromdate == '') &&
      (this.employeelist1.todate == null || this.employeelist1.todate == '')) {
      this.excelErr = "Select from date and to date to proceed";
    }
    else {
      // console.log(this.employeelist1.fromdate);
      // console.log(this.employeelist1.todate);

      let myParams = new URLSearchParams();
      myParams.append("AgencyId",this.global.globalAgencyId)
      myParams.append("FromDate", this.employeelist1.fromdate == undefined ? null : this.employeelist1.fromdate);
      myParams.append("ToDate", this.employeelist1.todate == undefined ? null : this.employeelist1.todate);
      myParams.append("EmployeeId", this.employeelist1.employeeId == undefined || this.employeelist1.employeeId == '' ? 0 : this.employeelist1.employeeId);
      this.httpService.getExcelData(myParams).subscribe((data: PayrollexcelBO[]) => {
      //  console.log(data);

        this.excelformatarlst = [];


        //   this.excelformatarlst= data;
        if(data.length!=0)
        {
          this.filterxcllist(data);
        }
        else{
          this.toastrService.error("Data Not Found")
          setTimeout(() => {
            this.toastrService.clear()
          }, 3000);
        }
        


        // this.exportAsExcelFormatFile('Employee_Import_Excel_Format')

        this.employeelist1 = {
          fromdate: this.currentDate,
          todate: this.currentDate,
          employeeId: 0,
        }
        //this.uploadTimeSheetLoading=false;
      })
    }


  }

  ////////===================================pay date edit====================================////////////
  editPaydate(args, type) {
    if (type == 'button') {

      var grid = (parentsUntil(args.target, 'e-grid') as any);
    //  console.log(grid.ej2_instances[0].getRowInfo(args.target).rowData);
      let val = grid.ej2_instances[0].getRowInfo(args.target).rowData;
      if (val.totalAmount == null) {
        this.PayrateRequired = true;
        this.showerr = "";
        this.showerr = "Please add pay rate for this employee to proceed";
      }
      else {
        this.showerr = "";
        this.PayrateRequired = false;
      }
      this.selectedpayrollid = val.id;
      this.payrollPayDate = val.payDate == null ? null : new Date(val.payDate).toLocaleDateString();

    //  console.log(this.selectedpayrollid)
    }
    if (type == 'checkbox') {
      this.payrollPayDate = "";
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
    if (args.column.field != null) {
      if(args.data[args.column.field]!=null)
      {
      const tooltip: Tooltip = new Tooltip({
        content: args.data[args.column.field].toString()
      }, args.cell as HTMLTableCellElement);
    }
  }
  }

  public get keepTogether(): string {
    return '';
  }
  getpayrollReport() {
    if ((this.employeelist1.fromdate == null || this.employeelist1.fromdate == '') &&
      (this.employeelist1.todate == null || this.employeelist1.todate == '')) {
      this.excelErr = "Select from date and to date to proceed";
    }
    else {
      // console.log(this.employeelist1.fromdate);
      // console.log(this.employeelist1.todate);

      let myParams = new URLSearchParams();
      myParams.append("FromDate", this.employeelist1.fromdate == undefined ? null : this.employeelist1.fromdate);
      myParams.append("ToDate", this.employeelist1.todate == undefined ? "" : this.employeelist1.todate);
      myParams.append("EmployeeId", this.employeelist1.employeeId == undefined || this.employeelist1.employeeId == '' ? 0 : this.employeelist1.employeeId);
      myParams.append("Agency", this.global.globalAgencyId );
      this.httpService.getpdfData(myParams).subscribe((data:any)=>{
     //   console.log(data,"DATA PDF=======");
        
        if(data.length>0)
        {
       //   document.getElementById("openReport").click();
      //  this.pdfenable=true;
           this.payrollReport=data;
         ///document.getElementById("openpdfdata").click();
          this.pdflist.portrait = true,
          this.pdflist.scale = 0.8,
           setTimeout(() => {
            
            this.pdflist.saveAs("PayRollReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        //    document.getElementById("openpdfdata").click();
           },400);
         
        //   document.getElementById("openReport").click();
        //   this.excelErr=""
        //   this.employeelist1 = []
        }
        else{
          this.excelErr="Data Not Available"
          setTimeout(() => {
            this.excelErr=""
          }, 800);
        }
      
        
        // this.closeReport();
      
      },(error:HttpErrorResponse)=>{
        this.excelErr=error.error
        setTimeout(() => {
          this.excelErr=""
        }, 800);
      })
    }
  }
  closeReport() {
    this.employeelist1 = []
  }
  exportpdf()
  {
   
    this.pdflist.portrait = true,
    this.pdflist.scale = 0.8,
    this.pdflist.saveAs("PayRollReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
   // document.getElementById("openpdfdata").click();
    document.getElementById("openReport").click();
    this.employeelist1 = []
  }


  ////////////////////////////////////////////////////////

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

getColumnwidth():any {
  
 return  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Payroll.Columns;


   
    //  this.grid.refreshColumns();

    let showcol = JSON.parse(data.column)[0].Payroll.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Payroll.HideColumns
  

 //   this.grid.showColumns(showcol);
    this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Payroll.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == '') {

        const column = this.grid.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Client') {

        const column1 = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Employee') {

        const column2 = this.grid.getColumnByField('employeeName'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Paid On') {

        const column3 = this.grid.getColumnByField('payDate'); // get the JSON object of the column corresponding to the field name
        // column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Total Amt.') {

        const column4 = this.grid.getColumnByField('totalAmount'); // get the JSON object of the column corresponding to the field name
        // column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Total hrs.') {

        const column4 = this.grid.getColumnByField('totalWorkedHrs'); // get the JSON object of the column corresponding to the field name
        // column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Lock status') {

        const column4 = this.grid.getColumnByField('lockStatus'); // get the JSON object of the column corresponding to the field name
        // column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column5 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column5.headerText = element.column;
        column5.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });

}
SaveColumnwidth() {
//console.log(this.arraycol[0].Payroll.Pagesize)
  this.arraycol[0].Payroll.Columns = this.ColumnArray;
  //this.arraycol[0].Payroll.Pagesize = this.grid.pageSettings.pageSize;
 // console.log(this.arraycol[0].Payroll)
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  //console.log( this.arraycol[0].Payroll)
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();
  });
}
}
