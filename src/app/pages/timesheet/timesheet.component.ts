import { Component, OnInit, ViewContainerRef, ViewChild, ViewEncapsulation, Inject, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { filters, sortingObj, SaveTimeSheet, returnTimesheet, deletepermission, gettimesheet, WhereCondition, TimesheetreturnBO,functionpermission, employeeFilter } from './timesheet.model';
import { DateService } from '../../date.service';
import { IMyDpOptions } from 'mydatepicker';
import { GlobalComponent } from '../../global/global.component';
import { TimesheetService } from './timesheet.service';
import { ToastrService } from 'ngx-toastr';
import { DetailRowService, GridModel, parentsUntil, DataStateChangeEventArgs,EditService, QueryCellInfoEventArgs,AddEventArgs, SearchSettingsModel, ToolbarItems, ToolbarService, IEditCell } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { EditDetailsAuthorization } from '../client-parent/client-parent.model';
//import { element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { timesheetdataservice } from './timesheetdata.service'
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';


//import * as $ from 'jquery';
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  providers: [DetailRowService,EditService, ToolbarService],
  encapsulation: ViewEncapsulation.None,
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetComponent implements OnInit {
  filters: filters = new filters();
  @ViewChild('childtemplate') public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('gridtimesheetupload') public gridtimesheetupload: GridComponent;
  authinput: EditDetailsAuthorization = new EditDetailsAuthorization();
  timehssetgrid: boolean = false;
  saveErr: string = "";
  fp:functionpermission=new functionpermission()
  //==============================================Dropdown=======================================================//
  EmployeeDropDown: any
  ClinetDropDown: any;
  PayorDropDown: any;
  timesheetclose: boolean = false;
  public serviceList: any = [];
  loading: boolean = false;
  public dropdatas: string[] = ['Yes', 'No']
  public dropdata1: string[] = ['', "EXPORTED"]
  public height = '220px';
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

  ColumnArray: columnWidth[]
  ColumnArray_timesheetupload: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  public toolbar: ToolbarItems[]; 
  
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public pData: object[];
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  EmployeeListData: any;
  public dpParams: IEditCell;
  constructor( private ref: ChangeDetectorRef, public dateservice: DateService,  public global: GlobalComponent, public timesheetservice: TimesheetService, @Inject(timesheetdataservice) public timeservice: timesheetdataservice,private ngxService: NgxUiLoaderService,
    public toastrService: ToastrService, private router:Router, public httpService: TimesheetService , public datePipe: DatePipe, @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef ) {
    this.data = timeservice;
    this.resetPass = new FormGroup({
      Password: new FormControl('', [Validators.required])
    });
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
  
  }
  public serviceParams : IEditCell;
  public serviceElem : HTMLElement;
  public serviceObj : DropDownList;
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    this.dpParams = { params: {format:'MM/dd/yyyy' } };
    this.getClient();
    this.getEmployeeDropDown();
    this.getPayorDropDown();
    this.filepermissionget();
    this.getEmployeeType()
    this.filters.filterStartDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.filters.filterEndDate = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.filterOptions = { type: 'Menu' };
    this.filter = {
      type: 'menu'
    };
    // setTimeout(() => {
    //   this.griddata = true;
    // }, 100);
    this.getService();
    //this.initialPage = { pageSizes: ['10', '20', '50'], pageSize: 10 }
    this.formatOptions = { type: 'date', format: 'MM-dd-yyyy' };
    let pag=JSON.parse(this.global.globalColumn.column)[0].Timesheet.Pagesize;
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: pag, pageSize: pag, pageSizes: this.pageSizes };
    this.timesheetfilter();
    this.getumpi();
     this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
     this.toolbar = ['Add', 'Edit', 'Update', 'Cancel'];
    this.conditionlist.push(new WhereCondition());
    // setTimeout(() => {
    //   this.timehssetgrid = true;
    // }, 400);

    this.serviceParams = {
      create:()=>{
      this.serviceElem = document.createElement('input');
          return this.serviceElem;
      },
      read:()=>{
          return this.serviceObj.text;
      },
      destroy:()=>{
          this.serviceObj.destroy();
      },
      write:()=>{
          this.serviceObj = new DropDownList({
          dataSource: this.serviceList,
          fields: { value: 'Key', text: 'Value' },
          change: () => {
          
          let tempQuery: Query = new Query().where('Key', 'equal', this.serviceObj.value);
         
      },
      placeholder: 'Select a service',
      floatLabelType: 'Never'
      });
      this.serviceObj.appendTo(this.serviceElem);
  }};
    this.childGrid = {
      dataSource: this.childData,
      // actionBegin:this.actionBegin,
      // dataStateChange:this.childdatachange,
      // recordDoubleClick:this.editchildgrid,
      queryCellInfo: this.customiseCell,
      queryString: 'serialNo',
     // toolbarClick:this.toobarchange,
      allowSorting: false,
      allowPaging: false,
     // toolbar: ['Add', 'Edit',  'Update', 'Cancel'],
    //  editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
      load() {
        this.registeredTemplate = {};       // set registertemplate value as empty in load event

      },

      // columns: [

      //   { field: 'timesheetDate', headerText: 'Timesheet Date', width: 75, allowEditing:true,type:'date',edit:this.dpParams,editType:'datepickeredit' },
      //   { field: 'service', headerText: 'Service', width: 100,allowEditing:true,edit: this.serviceParams},
      //   { field: 'payer', headerText: 'Payer', width: 80, allowEditing:false },
      //   { field: 'totalHours', headerText: 'Total Hours', width: 100, allowEditing:true },
      //   { field: 'notes', headerText: 'Notes', width: 50, allowEditing:true },
      //   { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate, allowEditing:false }
      // ]
      columns: [
  
        { field: 'timesheetDate', headerText: 'Timesheet Date', width: 75,  },
        { field: 'service', headerText: 'Service', width: 100,},
        { field: 'payer', headerText: 'Payer', width: 80, },
        { field: 'totalHours', headerText: 'Total Hours', width: 100, },
        { field: 'notes', headerText: 'Notes', width: 50, },
        { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate,allowEditing:false }
       ]
    };
    // this.getColumnwidth();
    this.toolbar = ['ColumnChooser'];
    this.gettimesheet.pageitems=pag
    setTimeout(() => {
      console.log(this.grid);
    }, 300);
    
  }
  /////////////////////////////////Refresh//////////////////////////////////////////////////////////////
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


  ngOnChanges(changes: SimpleChanges) {
    debugger;
    let f = changes;
    console.log(f);
  }

  //////////////////////////Date Piker Date Change///////////////////////////////////////////////////////////////////////

  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'filterstart') {
        //console.log("event.value",event);
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.filterStartDate = val1;
          //console.log('this.filters.filterStartDate',this.filters.filterStartDate);
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
          this.editDate = val1;
        }
      }
    }
    if (type == "datechagned") {
      if (name == 'filterstart') {
        //console.log("event.value",event);
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.filterStartDate = val1;
          //console.log('this.filters.filterStartDate',this.filters.filterStartDate);
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
          this.editDate = val1;
        }
      }
    }
  }

  //////////////////////////////////////////get Employee DropDown//////////////////////////////////////////////////////

  // getEmployeeDropDown(empType) {
  //   let params = new URLSearchParams();
  //   console.log(empType);
  //   params.append("AgencyId", this.global.globalAgencyId);
  //   params.append("EMPLOYEETYPE",empType);
  //   this.timesheetservice.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) => {
  //     this.EmployeeDropDown = data;
  //     this.EmployeeDropDown.forEach(element => {
  //       element.Key = element.Key.toString();

  //     })
  //   });

  // }
  getEmployeeDropDown() {
    let params = new URLSearchParams();
    //console.log(empType);
    params.append("AgencyId", this.global.globalAgencyId);
   // params.append("employeeId",empType);
    this.timesheetservice.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeDropDown = data;
      this.EmployeeDropDown.forEach(element => {
        element.Key = element.Key.toString();

      })
    });

  }

  ///////////////////////////////////////get payor///////////////////////////////////////////////////////////////////

  getPayorDropDown() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.timesheetservice.getPayor(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.PayorDropDown = data;
      this.PayorDropDown.forEach(element => {
        element.Key = element.Key.toString();
      })
    })

  }

  ///////////////////////////////////////get payor///////////////////////////////////////////////////////////////////

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

  /////////////////////////////get service////////////////////////////////////////////////////////////////////////

  getService() {

    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId)
    this.timesheetservice.getservice(params).subscribe((data: any) => {

      data.forEach(element => {

        element.Key = element.Key.toString()

      });
      this.serviceList = data;
      console.log(this.serviceList)
    });
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

    // this.getFilterTotal();
    this.getFilterTotalItem();


  }

  ////////////////////////////////////////////get timesheet total/////////////////////////////////////////////

  getFilterTotal() {

    let param = new URLSearchParams();
    param.append("start", this.filters.filterStartDate)
    param.append("end", this.filters.filterEndDate)
    param.append("employee", this.filters.filterEmployee.toString())
    param.append("client", this.filters.filterClient.toString())
    param.append("payor", this.filters.filterPayor.toString())
    param.append("page", this.sorting.currentPgNo.toString())
    param.append("pageitems", this.sorting.itemperpage.toString())
    param.append("AgencyId", this.global.globalAgencyId)
    this.timesheetservice.getTimesheetTotal(param).subscribe((data: number) => {
    })

  }

  /////////////////////////////////////get timesheet Iteam////////////////////////////////////////////////////////////////

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
    // console.log(this.gettimesheet)


    this.timeservice.execute(this.gettimesheet)
    let count=0;
    this.data.subscribe((data: any) => {
      this.childData = this.timeservice.getchilddata()
      this.TimesheetLst = this.timeservice.timelst;
      console.log(data,"childdata");
      count = count+1;
      if(data!=null&& data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
      // this.grid.childGrid.columns = [

      //   { field: 'timesheetDate', headerText: 'Timesheet Date', width: 75, },
      //   { field: 'service', headerText: 'Service', width: 100 },
      //   { field: 'payer', headerText: 'Payer', width: 80 },
      //   { field: 'totalHours', headerText: 'Total Hours', width: 100 },
      //   { field: 'notes', headerText: 'Notes', width: 50 },
      //   { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate }
      // ];
      this.childGrid = {
        dataSource: this.childData,
        //actionBegin:this.actionBegin,
        queryCellInfo: this.customiseCell,
        // recordDoubleClick:this.editchildgrid,
        // dataStateChange:this.childdatachange,
        // toolbarClick:this.toobarchange,
        // keyPressed:this.changeValue,
        queryString: 'serialNo',
        allowSorting: false,
        allowPaging: false,
      
       // toolbar: ['Add', 'Edit', 'Update', 'Cancel'],
       // editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
        load() {
          this.registeredTemplate = {};       // set registertemplate value as empty in load event
  
        },
  
        // columns: [
  
        //   { field: 'timesheetDate', headerText: 'Timesheet Date', width: 75,  allowEditing:true,editType:'datepickeredit',edit:this.dpParams},
        //   { field: 'service', headerText: 'Service', width: 100,allowEditing:true, editType: 'dropdownedit',edit: this.serviceParams },
        //   { field: 'payer', headerText: 'Payer', width: 80,allowEditing:false },
        //   { field: 'totalHours', headerText: 'Total Hours', width: 100, allowEditing:true},
        //   { field: 'notes', headerText: 'Notes', width: 50,allowEditing:true },
        //   { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate,allowEditing:false }
        
        // ]
         columns: [
  
          { field: 'timesheetDate', headerText: 'Timesheet Date', width: 75,  },
          { field: 'service', headerText: 'Service', width: 100,},
          { field: 'payer', headerText: 'Payer', width: 80, },
          { field: 'totalHours', headerText: 'Total Hours', width: 100, },
          { field: 'notes', headerText: 'Notes', width: 50, },
          { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate,allowEditing:false }
         ]
      };
      this.grid.childGrid.dataSource = this.childData;
    })


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
      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {
        if (this.arraycol.length > 0) {
          this.arraycol[0].Timesheet.ShowColumns.forEach(old => {
            showarr.forEach(element => {
              if (old == element) {
                count1 = count1 + 1;
              }
            });

          });

          this.arraycol[0].Timesheet.HideColumns.forEach(old => {
            hidearr.forEach(element => {
              if (old == element) {
                count = count + 1;
              }
            });

          });
        

          if (this.arraycol[0].Timesheet.ShowColumns.length != count1 || this.arraycol[0].Timesheet.HideColumns.length != count) {
          
            // this.temphide = hidearr;
            this.arraycol[0].Timesheet.ShowColumns = showarr;
            this.arraycol[0].Timesheet.HideColumns = hidearr;
            this.arraycol[0].Timesheet.Pagesize = this.grid.pagerModule.pagerObj.pageSize
            console.log("save column chooser");
            
            this.SaveColumnwidth();
          }
        }

      }
    }

    this.conditionlist = [];
    //console.log("args", args);
    //console.log("args", args.columns);

    if (args.requestType == "filterafteropen") {
      this.gettimesheet.type = args.columnType;
    }


  }


  ///////////////////////////////////////////////////data state////////////////////////////////////////////////////
  public dataStateChange(state): void {
    let type: String = (state.action.requestType).toString();
    //console.log(state);
    //console.log(type);
    this.sorting.currentPgNo = this.grid.pagerModule.pagerObj.currentPage;
    this.sorting.itemperpage = this.grid.pagerModule.pagerObj.pageSize;
    //  this.initialPage=
    //console.log(this.sorting)

    if (state.action.requestType != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.sorting.shortcolumn = state.sorted[0].name;
        if(this.sorting.shortcolumn=='fromDate'||this.sorting.shortcolumn=='toDate')
        {
          this.sorting.shortcolumn="timesheetDate"
        }
        this.sorting.shortType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
        //console.log(this.gettimesheet);

      }
    }
    // if(state.action.requestType=="paging" )
    // {
    //   this.timesheetfilter();
    // }
    if (type == "filtering" && state.action.action != "clearFilter") {
      this.sorting.currentPgNo = 1;
      this.sorting.itemperpage = 10;
      if (this.gettimesheet.type == "date") {

        this.gettimesheet.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        //console.log(this.gettimesheet.value)
      }
      else {
        this.gettimesheet.value = state.action.currentFilterObject.value
      }

      this.gettimesheet.field = state.action.currentFilterObject.field
      //console.log(this.gettimesheet)

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
      // if (state.action.currentFilterObject.field == "timesheetStatusLid") {

      //   this.gettimesheet.field = "timesheetDate"
      //   this.gettimesheet.type = "date"

      // }


    }
    if (state.action.requestType == "filtering" && state.action.action == "clearFilter") {
      this.sorting.currentPgNo = 1;
      this.sorting.itemperpage = 10;
      this.gettimesheet.value = ""
      this.gettimesheet.field = "clientName"
      this.sorting.shortcolumn = "TimesheetDate"
      this.sorting.shortType = 'ASC';
      //console.log(this.gettimesheet)

    }
    if (state.action.requestType != "refresh") {
      this.timesheetfilter();
    }


    if ( state.action.requestType == "paging" && state.action.name == "actionBegin") {
      console.log( "save page size")
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
        if( this.arraycol.length!=0)
        {
          if(this.arraycol[0].Timesheet.Pagesize!=state.take)
          {
            this.arraycol[0].Timesheet.Pagesize = state.take
               console.log( "save page size")
            this.SaveColumnwidth();
          // }
  
        }}
      }


  }


  //////////////////////////child table button validation///////////////////////////////////////////////////////////////////

  customiseCell(args: QueryCellInfoEventArgs) {

    if (args.column.field == "Edit") {

      if (args.data['timesheetStatusLid'] == 'EXPORTED') {

        args.cell.children[0].children[0].classList.add('disableedit');
        
          args.cell.children[0].children[1].classList.add('disableedit');
        }
        
      }
        
  }

  /////////////////////////////delete child table data//////////////////////////////////////////////////////
  deletetimesheetpopup(data) {
    console.log(data);
    document.getElementById("delete").click()
    this.deleteList.timesheet_id = data.timeSheetId;



  }
  //////////////////////////////view child //////////////////////////////////////////////////////////////////

  ngAfterViewInit() {
    console.log(this.childtemplate)
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }
  ///////////////////////////////////validate button//////////////////////////////////////////////////////////////

  validatebutton(args: QueryCellInfoEventArgs) {

    if (args.column.field == "timesheet") {
      console.log(args.column.field);
      console.log(args);
       if(this.fp.timesheetsdelete)
       {
        if (args.data['timesheetStatusLid'] == 'EXPORTED') {
          console.log(args,"inside if");
           
          args.cell.children[1].classList.add('disableedit');
          args.cell.children[2].classList.add('disableedit');
        }
       }
       else
       {
        if (args.data['timesheetStatusLid'] == 'EXPORTED') {
         // console.log(args,"inside if");
           
          args.cell.children[1].classList.add('disableedit');
          
        }
        args.cell.children[2].classList.add('disableedit');
       }
      
     
    }

  }

  //////////////////////////////edit parent table data//////////////////////////////////////////////////////////

  edittimesheet(data, args: any) {
console.log(data)
    this.editserialnumber = data.serialNo;
    let val1 = this.TimesheetLst.filter(s => s.serialNumber == data.serialNo);


    this.editemp = val1[0].timesheet[0].employeeId.toString();
    this.editcli = val1[0].timesheet[0].clientId.toString();



  }

  ///////////////////////////////get Employee Details////////////////////////////////////////////////////

  getumpi() {

    let param = new URLSearchParams();
    param.append("agency", this.global.globalAgencyId)
    this.timesheetservice.getEmpumpi(param).subscribe((data: any) => {

      this.empumpi = data;
    })
  }

  //////////////////////////Enable Employee Details/////////////////////////////////////////////////

  enableEmp(id) {

    if (id == undefined || id == 'undefined' || id == "undefined") {

      this.eanbleclient = true;
      this.enablestart = true;
      this.eanbleend = true;
      this.eanbleservice = true;
    } else {
      this.eanbleclient = false;
      this.empumpi.forEach(element => {
        if (id == element.id) {
          this.Employee = id;

          this.umpi = element.umpi
          this.payorreqID = element.payorreqID
        }
      });
    }
    this.isEmp = true;
    this.Employee = id;
  }

  ///////////////////////////Enable client Details//////////////////////////////////////////////////////

  enableCLi(id) {
    this.Client = id;

    if (id == undefined || id == "undefined" || id == 'undefined') {
      this.enablestart = true;
      this.eanbleend = true;
      this.eanbleservice = true;
      this.start = "";
      this.end = "";
      this.serviceName = "";
    } else {
      this.enablestart = false;

    }
    this.serviceName = "";
    if (new Date(this.start) != undefined && new Date(this.end) != undefined)
      this.startdates(this.start, this.end, id)

    this.Client = id;

    this.ClinetDropDown.forEach(element => {
      if (element.id == id) {

        this.clientdob = this.datePipe.transform(element.dob, 'MM-dd-yyyy')
        this.memberma = element.medicaid
      }
    });
    this.isCliInfo = true;

  }

  //////////////////////////addEdit switch/////////////////////////////////////////////////////////////

  addEdit() {
    this.manualEntry = true
    debugger;
    // this.ref.detach();
    // setInterval(() => {
    //        this.ref.detectChanges();
    //     }, 10);
  }

  ////////////////////////////// get Authorization///////////////////////////////////////////////////////

  startdates(startdate, enddate, clientsid) {
    // this.ref.detach();
    // setInterval(() => {
    //        this.ref.detectChanges();
    //     }, 10);
    debugger;
    if (startdate == undefined || startdate == "undefined" || startdate == 'undefined') {
      this.eanbleend = true;
      if (new Date(startdate) == undefined) {
        return;
      }
    } else {
      this.eanbleend = false;
    }
    if (enddate == undefined || enddate == "undefined" || enddate == 'undefined') {
      this.eanbleservice = true;
      if (new Date(enddate) == undefined) {
        return;
      }
    } else {
      this.eanbleservice = false;
    }


    startdate = this.datePipe.transform(startdate, 'MM-dd-yyyy');
    enddate = this.datePipe.transform(enddate, 'MM-dd-yyyy');

    if (clientsid == undefined || clientsid == '' || clientsid == "") {
      clientsid = null
    }

    if (startdate != null && enddate != null && clientsid != null) {
      if ((new Date(startdate).getTime() < new Date(enddate).getTime()) || (startdate == enddate)) {


        let parameter = new URLSearchParams();
        parameter.append("startdate", startdate)
        parameter.append("enddate", enddate)
        parameter.append("clientid", clientsid)

        this.timesheetservice.getAuthorization(parameter).subscribe((data: any) => {
          let i;
          this.serviceName = "";
          this.orderList = [];
          let service = [];
          if (data.length != 0) {
            for (i = 0; i < data.length; i++) {
              service[i] = { value: data[i].masterServiceCode, label: data[i].masterServiceCode, key: data[i].masterServiceId };

              if (data[i].billingunit != 0) {
                let diffDays = Math.round(Math.abs(new Date(data[i].endDate).getTime() - new Date(data[i].startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
                let units = data[i].totalUnits / diffDays;
                data[i].totalunitperday = units / data[i].billingunit;
                data[i].totalunitperday = data[i].totalunitperday.toString();
                let vals = data[i].totalunitperday.split('.');
                let vals2 = 0 + "." + vals[vals.length - 1];

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

          }

          this.authorizationdetails = data;

          if (this.authorizationdetails.length == 0) {
            this.dontshowAuth = true;
            this.isIns = false;
          }
          else {
            this.dontshowAuth = false;
            this.isIns = true;
          }


        })

      }
    }
  }

  /////////////////////////check timesheet///////////////////////////////////////////////////////////////

  checktimesheet(startDate, endDate, serviceName) {
    return new Promise((resolve, reject) => {
      let param = new URLSearchParams();
      param.append("employee", this.Employee.toString())
      param.append("client", this.Client.toString())
      param.append("startdate", startDate)
      param.append("enddate", endDate)
      param.append("service", serviceName)
      this.timesheetservice.Checktimesheets(param).subscribe((data: any) => {
        resolve(data)
      }, (err) => {
        reject(err)
      });
    });
  }

  ////////////////////////////////time gendrate////////////////////////////////////////////////////////

  async show(startDate, endDate, serviceName) {
    // this.ref.detach();
    // setInterval(() => {
    //        this.ref.detectChanges();
    //     }, 10);
    debugger;
    if ((new Date(startDate).getTime() < new Date(endDate).getTime()) || (startDate == endDate)) {

      this.orderList = [];
      var timesheetdata: any = []

      if (serviceName != null && serviceName != '' && serviceName != undefined && serviceName != "") {


        timesheetdata = await this.checktimesheet(startDate, endDate, serviceName).then((res: any) => { return res });

      }
      var startDate1 = new Date(startDate);
      var endDate1 = new Date(endDate);
      var daysdiff = Math.floor((Date.UTC(endDate1.getFullYear(), endDate1.getMonth(), endDate1.getDate()) -
        Date.UTC(startDate1.getFullYear(), startDate1.getMonth(), startDate1.getDate())) / (1000 * 60 * 60 * 24));

      for (let ss: number = 0; ss < this.serviceName.length; ss++) {
        for (let i: number = 0; i <= daysdiff; i++) {


          var d2 = new Date(startDate1)
          d2.setDate(d2.getDate() + i)

          let cormdata = false;
          let total = "";
          let timesheetnotes = "";
          let timesheetid = 0;
          if (timesheetdata.length != 0) {

            timesheetdata.forEach(element => {


              let today = this.datePipe.transform(element.date, 'MM/dd/yyyy');


              if (today == this.datePipe.transform(d2, 'MM/dd/yyyy') && element.employee == parseInt(this.Employee.toString()) && element.client == parseInt(this.Client.toString())
                && parseInt(this.serviceName[ss]) == element.service) {

                cormdata = true;
                total = element.totalhour != null ? element.totalhour : "";
                timesheetnotes = element.notes != null ? element.notes : "";
                timesheetid = element.id

              }

            });
          }
          else {
            total = "";
            timesheetnotes = "";
          }



          var d1: any = new Date(d2).getDay()
          switch (d1) {
            case 0:
              d1 = "Sunday";
              break;
            case 1:
              d1 = "Monday";
              break;
            case 2:
              d1 = "Tuesday";
              break;
            case 3:
              d1 = "Wednesday";
              break;
            case 4:
              d1 = "Thursday";
              break;
            case 5:
              d1 = "Friday";
              break;
            case 6:
              d1 = "Saturday";
          }

          this.createSchList = {
            Id: timesheetid != 0 ? timesheetid : 0,
            Day: d1,
            Date: new Date(d2).toLocaleDateString(),
            service: this.serviceList.filter(s => s.Key == serviceName[ss])[0].Value,
            tcHours: total != "" ? total : "",
            notes: timesheetnotes != "" ? timesheetnotes : "",
            isDisable: cormdata
          }
          this.orderList.push(this.createSchList);



        }

      }
    }

    this.hoursCal = false;
  }

  /////////////////////////Timesheet Validation/////////////////////////////////////////////////////////

  numberonly(event: any, type) {

   
    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
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


  /////////////////////Add Overall Time///////////////////////////////////////////////////////////////

  addTime() {

    this.orderList.forEach((element, index) => {

      let txt = document.getElementById("editable_div" + index);
      txt.innerHTML = this.Allhours;
      element.tcHours = "";

      element.tcHours = this.Allhours;
    });
    this.calculatehours(this.orderList)
  }

  ////////////////////////////calculate time//////////////////////////////////////////////////////

  calculatehours(orderlist) {

    let totalhours = orderlist.filter(t => t.tcHours != '' && t.tcHours != '.').map(t => t.tcHours).reduce((sum, sum1) => { return parseFloat(sum) + parseFloat(sum1) })
    let val5 = ((totalhours).toString()).split('.');


    if (val5.length == 2) {
      if (val5[val5.length - 1].length == 1) {
        val5[val5.length - 1] = parseInt(val5[val5.length - 1]) * 10;
      }
      if (parseFloat(0 + "." + val5[val5.length - 1]) == 0.25) {

        this.enterdhr = val5[0];
        this.entermin = 15;

      }
      if (parseFloat(0 + "." + val5[val5.length - 1]) == 0.50) {

        this.enterdhr = val5[0];
        this.entermin = 30;

      }
      if (parseFloat(0 + "." + val5[val5.length - 1]) == 0.75) {

        this.enterdhr = val5[0];
        this.entermin = 45;

      }

    }
    else {
      this.enterdhr = val5[0];
      this.entermin = 0;
    }
  }

  /////////////////////////////save hours ////////////////////////////////////////////////////////

  savehours(event, i) {

    if (event.target.innerHTML == "") {
      this.orderList[i].tcHours = 0;
    }
    else {

      if (event.target.innerHTML == "") {
        this.orderList[i].tcHours = 0;
      }
      else { this.orderList[i].tcHours = event.target.innerHTML.replace(/\s/g, ""); }

      this.orderList[i].tcHours = event.target.innerHTML.toString().replace(/\s/g, "");

      event.target.innerHTML = this.orderList[i].tcHours;


      this.calculatehours(this.orderList);
    }
    return true;
  }

  ///////////////////////////key Enter function///////////////////////////////////////////////

  // onKey(event) {
  //   $(function () {
  //     $(this).find('tr').each(function () {
  //       $(this).find('td').each(function (i) {

  //         $(this).attr('tabindex', i + 1);
  //       });
  //     });
  //   });
  // }

  ///////////////////////////////save Notes/////////////////////////////////////////////////////////

  savenote(event, i) {
    this.orderList[i].notes = event.target.innerHTML;

  }
  /////////////////////////////////upload File//////////////////////////////////////////////////////

  async onFileChanged(event) {

    let i = 0;
    for (i = 0; i < event.target.files.length; i++) {


      let val = await this.tobase64(event.target.files[i]);



      this.selected = true;

      this.filearray[i] = { "TimesheetUploadName": event.target.files[i].name, "uploadtimesheet": val }

    }
    this.pdfSrc = this.filearray[0].uploadtimesheet
  }

  /////////////////////////file to base64/////////////////////////////////////////////////////
  tobase64 = value => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = (e: any) => resolve(e.target.result);
    reader.onerror = error => reject(error);
  });
  ///////////////////////////save new//////////////////////////////////////////////////////////////////

  SaveandNew(tempval) {
    let list = JSON.parse(JSON.stringify(tempval))
    let checkempty=0
    console.log(list);
    list.forEach(element => {
      if(element.tcHours==0||element.tcHours==""||element.tcHours==null)
      {
        checkempty=checkempty+1;
      }
    });
    if(checkempty==list.length)
    {
      this.toastrService.error(
       "Please enter Total Hours",
        "error",
      );
      return
    }
    this.loading = true;
    let i;
    let temp: any = [];
    let temp1: any = [];
    let temparray: any = [];


    if (this.serviceName.length > 1) {

      this.serviceName.forEach(s => {
        let val = {};

        //console.log(s)
        let serviceid = this.serviceList.filter(d => d.Key ==  parseInt(s))[0].Value;

        if (this.authorizationdetails.length != 0) {

          if (this.authorizationdetails.filter(d => d.masterServiceCode == serviceid).length != 0) {

            val = {
              clientautherizationId: this.authorizationdetails.filter(d => d.masterServiceCode == serviceid)[0].id,
              serviceId: parseInt(s)
            }

          }
          else {
            val = { clientautherizationId: 0, serviceId: 0 };
          }
        }
        else {
          val = { clientautherizationId: 0, serviceId: 0 };
        }


        temp1.push(val);
      });

    }

    else {

      let serviceid = this.serviceList.filter(d => d.Key == parseInt(this.serviceName[0]))[0].Value;

      if (this.authorizationdetails.length != 0) {
        if (this.authorizationdetails[0].masterServiceCode == serviceid) {

          temp1 = [{
            clientautherizationId: this.authorizationdetails.filter(d => d.masterServiceCode == serviceid)[0].id,
            serviceId: parseInt(this.serviceList.filter(d => d.Value == serviceid)[0].Key),
          }]
        } else {
          temp1 = [{ clientautherizationId: 0, serviceId: 0 }];
        }
      } else {
        temp1 = [{ clientautherizationId: 0, serviceId: 0 }];
      }

    }

    let j = 0;

    for (i = 0; i < list.length; i++) {
      let datas = 0;

      datas = this.serviceList.filter(s => s.Value == list[i].service)[0].Key


      if (!(list[i].tcHours == "" || list[i].tcHours == 0)) {


        let val1 = list[i].tcHours;

        datas = this.serviceList.filter(s => s.Value == list[i].service)[0].Key

        if (!(list[i].tcHours == "" || list[i].tcHours == 0)) {


          let val1 = (list[i].tcHours.toString()).replace(/\s/g, "");

          temp[j] = {
            Id: list[i].Id,
            EmployeeId: parseInt(this.Employee.toString()),
            ClientId: parseInt(this.Client.toString()),

            MasterServiceId: parseInt(datas.toString()),
            TimesheetDate: new Date(new Date(list[i].Date).toDateString() + " "
              + "00:00:000" + " " + "GMT").toISOString(),
            TimesheetNotes: list[i].notes,

            GroupPayorServiceId: this.authorizationdetails.filter(s => s.masterServiceCode == list[i].service).length != 0 ? this.authorizationdetails.filter(s => s.masterServiceCode == list[i].service)[0].groupPayorServiceId : null,
            TotalHours: parseFloat(val1),
            isCliSignature: true,
            isEmpSignature: true,
          }
          j++;
        }


      }
    }
    temparray = {
      timesheet: temp,
      clientauth: temp1,
      file: this.filearray
    }




    this.timesheetservice.saveTimesheet(temparray).subscribe((data: any) => {

      this.orderList = "";

      this.Allhours = "";

      this.getService();
      this.orderList = [];
      this.Client = 0;
      this.Employee = 0;
      this.start = this.start;
      this.end = this.end;
      this.timesheetclose = false;
      this.serviceName = '';
      this.authorizationdetails = [];
      this.isEmp = false;
      this.isCliInfo = false;
      this.isIns = false;
      this.dontshowAuth = false;

      this.selected = false;
      this.enterdhr = 0;
      this.entermin = 0;
      this.toastrService.success(
        'Timesheets has been created successfully!',
        'Timesheets created'), 8000;
      this.hoursCal = false;
      this.eanbleclient = true;
      this.enablestart = true;
      this.eanbleend = true;
      this.eanbleservice = true;
      this.loading = false;
    },
    (err: HttpErrorResponse) => {
      this.toastrService.error(
        err.error,
        "error",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

    })
 


  }
  /////////////////////////////back function////////////////////////////////////////
  back() {


    this.orderList = "";

    this.Allhours = "";
    this.timesheetfilter();
    this.getService();
    this.orderList = [];
    this.Client = 0;
    this.Employee = 0;
    this.start = "";
    this.end = "";
    this.manualEntry = false;
    this.serviceName = '';
    this.authorizationdetails = [];
    this.isEmp = false;
    this.isCliInfo = false;
    this.isIns = false;
    this.dontshowAuth = false;
    this.pdfSrc = "";
    this.selected = false;
    this.filearray = [];
    this.selected = false;
    this.enterdhr = 0;
    this.entermin = 0;

    this.hoursCal = false;
    this.eanbleclient = true;
    this.enablestart = true;
    this.eanbleend = true;
    this.eanbleservice = true;
    this.timesheetclose = false;
  }
  ///////////////////////////save and close////////////////////////////////////////////////////
  succCliAdd(tempval) {
    let list = JSON.parse(JSON.stringify(tempval))
    let checkempty=0
    this.loading = true;
    let i;
    let temp: any = [];
    let temp1: any = [];
    let temparray: any = [];
    console.log(list);
    list.forEach(element => {
      if(element.tcHours==0||element.tcHours==""||element.tcHours==null)
      {
        checkempty=checkempty+1;
      }
    });
    if(checkempty==list.length)
    {
      this.toastrService.error(
       "Please enter Total Hours",
        "error",
      );
      return
    }
    if (this.serviceName.length > 1) {

      this.serviceName.forEach(s => {
        let val = {};


        let serviceid = this.serviceList.filter(d => d.Key == parseInt(s))[0].Value;

        if (this.authorizationdetails.length != 0) {

          if (this.authorizationdetails.filter(d => d.masterServiceCode == serviceid).length != 0) {

            val = {
              clientautherizationId: this.authorizationdetails.filter(d => d.masterServiceCode == serviceid)[0].id,
              serviceId: parseInt(s)
            }

          }
          else {
            val = { clientautherizationId: 0, serviceId: 0 };
          }
        }
        else {
          val = { clientautherizationId: 0, serviceId: 0 };
        }


        temp1.push(val);
      });

    }

    else {

      let serviceid = this.serviceList.filter(d => d.Key == parseInt(this.serviceName[0]))[0].Value;

      if (this.authorizationdetails.length != 0) {
        if (this.authorizationdetails[0].masterServiceCode == serviceid) {

          temp1 = [{
            clientautherizationId: this.authorizationdetails.filter(d => d.masterServiceCode == serviceid)[0].id,
            serviceId: parseInt(this.serviceList.filter(d => d.Value == serviceid)[0].Key),
          }]
        } else {
          temp1 = [{ clientautherizationId: 0, serviceId: 0 }];
        }
      } else {
        temp1 = [{ clientautherizationId: 0, serviceId: 0 }];
      }

    }

    let j = 0;

    for (i = 0; i < list.length; i++) {
      let datas = 0;

      datas = this.serviceList.filter(s => s.Value == list[i].service)[0].Key


      if (!(list[i].tcHours == "" || list[i].tcHours == 0)) {


        let val1 = list[i].tcHours;

        datas = this.serviceList.filter(s => s.Value == list[i].service)[0].Key


        if (!(list[i].tcHours == "" || list[i].tcHours == 0)) {


          let val1 = (list[i].tcHours.toString()).replace(/\s/g, "");

          temp[j] = {
            Id: list[i].Id,
            EmployeeId: parseInt(this.Employee.toString()),
            ClientId: parseInt(this.Client.toString()),

            MasterServiceId: parseInt(datas.toString()),
            TimesheetDate: new Date(new Date(list[i].Date).toDateString() + " "
              + "00:00:000" + " " + "GMT").toISOString(),
            TimesheetNotes: list[i].notes,

            GroupPayorServiceId: this.authorizationdetails.filter(s => s.masterServiceCode == list[i].service).length != 0 ? this.authorizationdetails.filter(s => s.masterServiceCode == list[i].service)[0].groupPayorServiceId : null,
            TotalHours: parseFloat(val1),
            isCliSignature: true,
            isEmpSignature: true,
          }
          j++;
        }


      }
    }
    temparray = {
      timesheet: temp,
      clientauth: temp1,
      file: this.filearray
    }




    this.timesheetservice.saveTimesheet(temparray).subscribe((data: any) => {
      this.filearray = [];

      this.getFilterTotal();
      this.getFilterTotalItem();
      this.toastrService.success(
        'Timesheets has been created successfully!',
        'Timesheets created',
      ), 3000;
      this.loading = false;
      this.back();
    },
    (err: HttpErrorResponse) => {
      this.toastrService.error(
        err.error,
        "error",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

    })
 

  }

  ///////////////////////////Edit Employee and Client///////////////////////////////////////////

  editTotaltimesheet() {
    this.loading = true;


    let val = {
      serialnumber: this.editserialnumber,
      employee: parseInt(this.editemp),
      client: parseInt(this.editcli)
    }

    this.timesheetservice.updateTimesheetdata(val).subscribe((data: any) => {
      document.getElementById("editall").click();
      this.timesheetfilter();
      let status: any = "success";
      this.toastrService.success(
        'Timesheet has been updated successfully',
        'Timesheet updated',
      ), 8000;
      this.loading = false;
    },
    (err: HttpErrorResponse) => {
      this.toastrService.error(
        err.error,
        "error",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

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
  deletetotalTimesheet() {
    this.loading = true;
    let obj = { Admin_Password: this.deleteList.admin_Password, SerialNumber: this.editserialnumber }

    this.timesheetservice.deleteAllTimesheetdata(obj).subscribe((data: any) => {
      this.deleteList = new deletepermission();
      this.editserialnumber = 0;
      this.timesheetfilter();
      this.passerror = false;
      this.toastrService.success(
        'Timesheet has been deleted successfully',
        'Timesheet deleted',
      ), 8000;

      document.getElementById("deleteall").click();
      this.timesheetfilter()
      this.loading = false;
      this.passerror = false;
    },
      (err: HttpErrorResponse) => {
        this.passerror = false;
        this.saveErr = err.error;
        setTimeout(() => {
          this.saveErr = ""

        }, 8000);
      });
  }
  /////////////////////////delete total timesheet//////////////////////////////////////////////
  deleteTimesheet() {
    this.loading = true;
    // let obj = { Admin_Password: this.deleteList.admin_Password }

    this.timesheetservice.deleteTimesheetdata(this.deleteList).subscribe((data: any) => {
      this.deleteList = new deletepermission();
      this.editserialnumber = 0;
      this.timesheetfilter();
      this.passerror = false;
      this.toastrService.success(
        'Timesheet has been deleted successfully',
        'Timesheet deleted',
      ), 8000;

      document.getElementById("delete").click();
      this.timesheetfilter()
      this.loading = false;
      this.passerror = false;
    },
      (err: HttpErrorResponse) => {
        this.passerror = false;
        this.saveErr = err.error;
        this.loading = false;
        setTimeout(() => {
          this.saveErr = ""
        }, 8000);
      }
    );
  }
  //////////////////////cacel Delete///////////////////////////////////////////////////////////////
  CancelDelete() {
    this.deleteList = new deletepermission();
    this.editserialnumber = 0;
    this.passerror = false;
    this.resetPass.reset()
  }
  ///////////////////////////////////assign value to Edit////////////////////////////////////////////////////////////
  openedit(args: any) {

    var grid = (parentsUntil(args.target, 'e-grid') as any);

    this.result2 = grid.ej2_instances[0].getRowInfo(args.target).rowData;


    let id = this.result2.timeSheetId;

    let val1;

    val1 = this.TimesheetLst.filter(s => s.serialNumber == this.result2.serialNo);
    let val = val1[0].timesheet.filter(t => t.id == id);

    console.log(args);
    console.log( this.result2);
    

    this.editid = id;
    this.editClient = val[0].clientName;
    this.editEmployee = val[0].employeeName;

    this.editDate = new Date(val[0].timesheetDate).toLocaleDateString();

    this.editNotes = val[0].timesheetNotes;
    this.editservice = val[0].masterServiceId.toString();
    console.log( this.editservice)
    this.edittime = val[0].totalHours;

    document.getElementById("update").click();
  }
  //////////////////////////////////////////update function////////////////////////////////////////////////////////
  update() {
    this.loading = true;
    let temp: any = [];


    let val1 = this.TimesheetLst.filter(s => s.serialNumber == this.result2.serialNo);
    let val = val1[0].timesheet.filter(t => t.id == this.result2.timeSheetId);
    temp = {
      Id: this.editid,
      TotalHours: parseFloat(this.edittime),
      EmployeeId: val[0].employeeId,
      ClientId: val[0].clientId,
      MasterServiceId: parseInt( this.editservice),
      TimesheetDate: new Date(new Date(this.editDate).toDateString() + " "
        + "00:00:000" + " " + "GMT").toISOString(),
      TimesheetNotes: this.editNotes,
      GroupPayorId: val[0].groupPayorId,


    }


    this.timesheetservice.editTimesheetdata(temp).subscribe((data: any) => {






      this.toastrService.success(
        'Timesheets has been updated successfully!',
        'Timesheets update',
      ), 8000;
      document.getElementById("update").click();
      this.loading = false;
      this.timesheetfilter()
    },
    (err: HttpErrorResponse) => {
      this.toastrService.error(
        err.error,
        "error",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

    })
 

  }
  /////////////////////////////////////////get timesheet Upload//////////////////////////////////////////////////

  getTimesheetUpload(id) {
    console.log(id);
    let myParams = new URLSearchParams();
    myParams.append("serialnumber", id);
    this.timesheetservice.gettimesheetUpload(myParams).subscribe((data: any) => {
    
      this.timesheetuploaddata = data;
      this.timesheetuploaddata.forEach((element,index) => {
        element.serialnumber=index+1;
      });
      // if(data!= null && data != undefined)
      // {
      //  this.getColumnwidthtimesheetupload();
      // }
    })
  }

  ////////////////////////////////////////////////////////upload Timesheet////////////////////////////////////////////////

  uploadTimesheet() {

    this.loading = true;


    let obj = {
      SequenceNumber: this.editserialnumber,
      TimesheetUpload: this.filearray,
      AgencyId: parseInt(this.global.globalAgencyId)
    }






    this.timesheetservice.uploadTimesheet(obj).subscribe(
      (data: any) => {
        this.filearray = [];
        this.loading = false;
        this.toastrService.success(
          'Timesheet upload successfully!',
          'Timesheet upload'), 8000;
        document.getElementById("uploads").click()
        this.getTimesheetUpload(this.editserialnumber)

      },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
   

  }

  //==================================Sub component edit changes============================//

  dataEmitfromChild(event: EditDetailsAuthorization) {
    this.EditAuthorization = false;
    this.authinput.isEdit = false;
    this.authinput.isView = true;
    //console.log(event)
    this.authinput = event
    this.startdates(this.start, this.end, this.Client)
  }
  //////////////////////////////////Add Client Auth//////////////////////////////////////
  addClientAuth() {

    this.authinput.ClientId = parseInt(this.Client.toString());
    this.authinput.isEdit = true;
    this.authinput.type = "new";
    this.authinput.isEditAuthorization = true;
    this.authinput.isView = false;
    this.EditAuthorization = true;
    //console.log(this.authinput)

  }
  /////////////////////////////////download uploaded file/////////////////////////////////////////////////////

  downloadfile(data) {


    let val = this.timesheetuploaddata.filter(e => e.sequenceNumber == data.sequenceNumber && e.timesheetUploadName == data.timesheetUploadName);


    if (val.length != 0) {
      window.open(val[0].uploadtimesheet);

    }

  }
  backwithalert() {
    if (this.timesheetclose == true) {
      document.getElementById("closealert").click();

    }
    else {
      this.back()
    }
  }
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
  openQP()
  {
    this.router.navigateByUrl("/qptimesheet");

  }
////////////////////////////////////get employee Type////////////////////////////////////////////////////////////

getEmployeeType() {
  let params = new URLSearchParams();
  params.append("Code", "EMPLOYEETYPE");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  let url = "api/LOV/getLovDropDown?"
  this.timesheetservice.getEmployeeStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {
    this.EmployeeTypeList = JSON.parse(JSON.stringify(data));
    // this.dropdata1 = data.map(e => e.Value);
    this.EmployeeTypeList.push({ Key: 0, Value: "All" });
    //console.log(data);
    // this.getEmployeeDropDown(this.employeeFilter.employeeType)
  })

}

filterchange(empType) {
//console.log("empType",empType);
if(this.employeeFilter.employeeType!=null || this.employeeFilter.employeeType!=undefined)
{
  this.getEmployeeDropDown()
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
onResize_timesheetupload(args) {
  
  const column = this.gridtimesheetupload.getColumnByField(args.column.field)
  column.width = args.column.width;
  this.ColumnArray_timesheetupload.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  this.SaveColumnwidthtiesheetupload();
}
getColumnwidth() {
  
  this.httpService.getcolumwidth().subscribe((data: any) => {
    if(data!=null&&data!=undefined)
      {
        this.global.globalColumn=data;
      }
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Timesheet.Columns;
    this.ColumnArray_timesheetupload = JSON.parse(data.column)[0].TimesheetViewUpload.Columns;


  
    //  this.grid.refreshColumns();

    let showcol = JSON.parse(data.column)[0].Timesheet.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Timesheet.HideColumns
  

 //   this.grid.showColumns(showcol);
    // this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Timesheet.Pagesize
    this.sorting.itemperpage =  this.grid.pageSettings.pageSize;


    this.ColumnArray.forEach(element => {



      if (element.column == 'Client') {

        const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Employee') {

        const column1 = this.grid.getColumnByField('EmployeeName'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'From Date') {

        const column2 = this.grid.getColumnByField('fromDate'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'To Date') {

        const column3 = this.grid.getColumnByField('toDate'); // get the JSON object of the column corresponding to the field name
        // column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Timesheet Status') {

        const column4 = this.grid.getColumnByField('timesheetStatusLid'); // get the JSON object of the column corresponding to the field name
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

getColumnwidthtimesheetupload() {
  
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);
console.log( this.arraycol);

    this.ColumnArray_timesheetupload = JSON.parse(data.column)[0].TimesheetViewUpload.Columns;


  
    //  this.grid.refreshColumns();
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.ColumnArray_timesheetupload.forEach(element => {

console.log( this.gridtimesheetupload)

      if (element.column == 'S.NO.') {

        const column = this.gridtimesheetupload.getColumnByField('serialnumber'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.gridtimesheetupload.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Sequence Number') {

        const column1 = this.gridtimesheetupload.getColumnByField('sequenceNumber'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.gridtimesheetupload.refreshHeader();
      }
      if (element.column == 'Timesheet Upload') {

        const column2 = this.gridtimesheetupload.getColumnByField('timesheetUploadName'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;

        this.gridtimesheetupload.refreshHeader();
      }
   
      else if (element.column == 'Actions') {

        const column5 = this.gridtimesheetupload.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column5.headerText = element.column;
        column5.width = element.width;
        this.gridtimesheetupload.refreshHeader();

      }
    });


  

  });

}
SaveColumnwidth() {

  this.arraycol[0].Timesheet.Columns = this.ColumnArray;
  this.arraycol[0].TimesheetViewUpload.Columns = this.ColumnArray_timesheetupload;
  this.arraycol[0].Timesheet.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();
  });
}
SaveColumnwidthtiesheetupload() {

  this.arraycol[0].TimesheetViewUpload.Columns = this.ColumnArray_timesheetupload;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidthtimesheetupload();
  });
}
actionBegin(args: any) {
  console.log(args)
  if (args.requestType === 'add') {
    
      // `parentKeyFieldValue` refers to the queryString field value of the parent record.
     // const EmployeeID = 'EmployeeID';parentKeyFieldValue
    //  let val =this.grid.parentDetails.parentKeyFieldValue ;
     
  }
  console.log(args)
  //console.log(this.grid)
  //console.log(this.grid.childGrid.)
  // var grid = (parentsUntil(args.target, 'e-grid') as any);
  // console.log(grid)
}
editchildgrid(args:any)
{
  console.log(args)
}
childdatachange(args:any)
{
  console.log(args)
}
toobarchange(args:any)
{
  console.log(args)
}
changeValue(event:any)
{

  if(event.target.name=="totalHours")
  {
    if (((event.which < 48 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 57) && ((event.which < 96 && (event.which != 8 && event.which != 46 && event.which != 39 && event.which != 37)) || event.which > 105)) {
      event.preventDefault();
    }
    // txt=event.
    // txt = (txt.trim) ? txt.trim() : txt.replace(/^\s+/, '');
    // if (txt.length == 1) {
    //   if (txt == "2") {
    //     if (event.key > 3) {

    //       event.preventDefault();
    //     }

    //   }
    //   if (parseInt(txt) > 2) {
    //     if (event.which != 46) {
    //       event.preventDefault();
    //     }
    //   }
    //   if (txt == '.') {
    //     if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
    //       event.preventDefault();
    //     }
    //   }


    // }

    // if (txt.length == 2) {

    //   let tempdata = txt.split("");
    //   if (!(tempdata[1] == ".")) {
    //     if (tempdata[0] == ".") {

    //       if (tempdata[1] == "5" || tempdata[1] == "0") {

    //         if (!(event.which == 48)) {


    //           event.preventDefault();
    //         }
    //       }
    //       if (tempdata[1] == "2" || tempdata[1] == "7") {

    //         if (!(event.which == 53)) {


    //           event.preventDefault();
    //         }
    //       }
    //     }
    //     else if (event.which != 46) {
    //       event.preventDefault();
    //     }

    //   }
    //   else {

    //     if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {
    //       event.preventDefault();
    //     }
    //   }


    // }
    // if (txt.length == 3) {

    //   let tempdata = txt.split("");

    //   if (tempdata[0] == ".") {
    //     event.preventDefault();
    //   }
    //   if (tempdata[2] == ".") {

    //     if (!(event.which == 50 || event.which == 53 || event.which == 55 || event.which == 48)) {


    //       event.preventDefault();
    //     }

    //   }
    //   if (tempdata[1] == ".") {

    //     let tempdata1 = txt.split(".");

    //     if (tempdata1[1] == "5" || tempdata1[1] == "0") {

    //       if (!(event.which == 48)) {


    //         event.preventDefault();
    //       }
    //     }
    //     if (tempdata1[1] == "2" || tempdata1[1] == "7") {

    //       if (!(event.which == 53)) {


    //         event.preventDefault();
    //       }
    //     }
    //   }
    // }
    // if (txt.length == 4) {
    //   let tempdata = txt.split(".");

    //   if (tempdata[1].length == 2) {
    //     event.preventDefault();
    //   }

    //   if (tempdata[1] == "5" || tempdata[1] == "0") {

    //     if (!(event.which == 48)) {


    //       event.preventDefault();
    //     }
    //   }
    //   if (tempdata[1] == "2" || tempdata[1] == "7") {

    //     if (!(event.which == 53)) {


    //       event.preventDefault();
    //     }
    //   }
    // }





    // let val = txt.split('.');

    // if (txt.length > 4) {
    //   event.preventDefault();
    // }

  }
}



}

