import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, Inject, Output, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { generalservice } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { TimesheetverificationService } from '../timesheetverification/timesheetverification.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { IMyDateModel, IMyInputFieldChanged, IMyDpOptions } from 'mydatepicker';
import { DetailRowService, GridComponent, GridModel, FilterSettingsModel, IEditCell, SelectionSettingsModel, DataSourceChangedEventArgs, ToolbarItems, EditSettingsModel, parentsUntil, QueryCellInfoEventArgs, CellEditArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { sortingObj, TimeSheetVerificationList, LineItemDetail, LineItem, Error, GetTimesheetverificationBO, ClientERRBOTSV, keyvalue } from '../timesheetverification/timesheetverification.model';
import { WhereCondition } from '../icd10/icd10.model';
import { Observable } from 'rxjs';
import { timesheetverificationdataservice } from './timesheetverificationdata.service';
import { PageSettingsModel, queryCellInfo } from '@syncfusion/ej2-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { IsViewEditpayorequired, PayorRequiredID } from '../employee/emloyee.model';
import { EditDetailsAuthorization, editcertificate, EditSOCDetails, ClientAuthorizationBO } from '../client-parent/client-parent.model';
// import {  ClientAuthorizationB } from '../client-parent.model';
import { EventEmitter } from 'protractor';
import { DateService } from 'src/app/date.service';
import { ColumnChangeBO, columnWidth } from '../list/list.model';


@Component({
  selector: 'app-timesheetverification',
  templateUrl: './timesheetverification.component.html',
  styleUrls: ['./timesheetverification.component.scss'],
  providers: [DetailRowService],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
  //   styles: [`.e-detailcell .e-grid .e-headercontent .e-headercell,.e-detailcell .e-grid .e-detailheadercell {
  //     background-color: green;
  // }
  // .e-grid .e-headercell,.e-grid .e-detailheadercell  {
  //     background-color: rgba(0,66,144,1.00);
  // }

  // .e-grid .e-headercell,.e-grid .e-detailheadercell  {
  //   background-color: rgba(0,66,144,1.00);
  //   color:white;
  //   font-size:12px;
  //  text-align:left;
  //  padding: 5px;
  //  padding-left:3px;
  //  padding-right:3px;
  //  font-family: Exo
  // }
  // .e-grid .e-headercell,.e-grid .e-detailheadercell  {
  //   background-color: rgba(0,66,144,1.00);
  //   color:white;
  //   font-size:12px;
  //  text-align:left;
  //  padding: 5px;
  //  padding-left:3px;
  //  padding-right:3px;
  //  font-family: Exo
  // }
  // .e-grid .e-gridheader tr:first-child th { 
  //   background-color: rgba(0,66,144,1.00);
  //   color:white;
  //   font-size:12px;
  //  text-align:left;
  //  padding: 5px;
  //  padding-left:3px;
  //  padding-right:3px;
  //  font-family: Exo
  // }
  // .e-grid .e-headercell, .e-grid .e-detailheadercell {
  //   background-color: rgba(0,66,144,1.00);
  //   color:white;
  //   font-size:12px;
  //  text-align:left;
  //  padding: 5px;
  //  padding-left:3px;
  //  padding-right:3px;
  //  font-family: Exo
  // }
  // .e-detailcell  .e-detailcell .e-grid .e-headercontent .e-headercell,.e-detailcell  .e-detailcell .e-grid .e-detailheadercell { 
  //   background-color:  yellow; 
  // }
  // .btnclass 
  // {
  //   background-color: rgba(0,66,144,1.00);
  //   text-transform: none;
  //   font-size:13px;
  // }
  // .e-grid .e-rowcell
  // {
  //   padding: 4px 6px;
  // }
  // .below-30
  // {

  //   background-color:   #EC7063;

  // }

  // .disablecheckbox { 
  //   pointer-events: none; 
  //   opacity: 0.5; 
  //  } 
  // `],
  //   encapsulation: ViewEncapsulation.None
})

export class TimesheetverificationComponent implements OnInit {



  public countryParams: IEditCell;
  public checkparams;
  public countryElem: HTMLElement;
  public countryObj: DropDownList;
  public selectionOptions: SelectionSettingsModel
  public statechange: DataSourceChangedEventArgs;
  public toolbar: ToolbarItems[];
  public editSettings: EditSettingsModel;
  public enablepayrate: boolean = false;
  payoRequiredViewEdit: IsViewEditpayorequired = new IsViewEditpayorequired();
  /////===============Main functionality initialisation=====================///
  overfixedhours: number = 0;
  TimesheetList: TimeSheetVerificationList[];
  LineItem: LineItem[];
  LineItemDetail: LineItemDetail[];
  pagshort: sortingObj = new sortingObj();
  wholedata: TimeSheetVerificationList[];
  public parentData: object[] = [];
  public childData: any = [];
  public details: any = [];
  serialno: any;
  updateddata: any = []
  clientIdErr: string;
  genderList: [{ Key: number, Value: string }];
  Payor: string = "Payor";
  Service: string = "Service";
  payorList: [{ Key: string, Value: string }];
  /////////=========================//////////////////////////
  errorlist: Error[] = [];
  idsList: TimeSheetVerificationList[];
  selectedCheckbox: any = [];
  showerrolist: Error[] = [];
  showerrolistfilter: Error[] = [];
  isEnabled: boolean = false;
  result3: any = [];
  result4: any = [];
  Errmsg: string = "";
  billingUnit: any = [];
  Allservice: any = [];
  ErrModalClient: any = [];
  ErrModalGrouppayor: any = [];
  ErrModalCompany: any = [];
  ErrModalGrouppayorService: any = [];
  ErrModalIcd10: any = [];
  ////////////===============Split up=================================//////////////////
  detailstime: object[] = [];
  result2: any = [];
  serviceDate1: any;
  timeSheetId: Int32List;
  saveErr: boolean = false;
  dailyHours: number;
  lineStatus: string;
  over275Hrs: number;
  overDaily16Hours: number;
  procedureCode: number;
  timesheetIdservice: number;
  serviceDate: string;
  remaimimgAuthorizedHours: string;
  mOD1: string;
  mOD2: string;
  mOD3: string;
  uMPIMissing: string;

  singledata: any = [];
  mulitpledata: TimeSheetVerificationList[];
  Type: any;

  KeyArr: keyvalue[] = [];
  Keyvalue: any = [];
  ClienctBO: ClientERRBOTSV = new ClientERRBOTSV();

  dontshowAuth: boolean = false;
  selectAllValue: boolean = false;
  selectsingleValue: boolean = false;

  selectedId: any = [1, 2]
  //////====================ICD10 Edit functionality ===============//////////
  EditICD: boolean = false;

  EditOptions: editcertificate = new editcertificate();

  EditCertificateoption: editcertificate = new editcertificate();
  Editcert: boolean = false;

  EditStartofcare: boolean = false;
  EditSOC: boolean = false;
  EditSOCOptions: EditSOCDetails = new EditSOCDetails();

  // @Output()  DatafromCertificate=new EventEmitter<editcertificate>();
  ///////////////////////////////////////////FormatOptions/////////////////////////////////////
  public formatOptions: object;
  public formatPhoneNumber: object;
  //////////==================Filter===============================================////////////////////

  ListSendBO: GetTimesheetverificationBO = new GetTimesheetverificationBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  type: string = "";

  // initialPage: PageSettingsModel;
  initialPage: object;
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  public dropdata: string[];
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  public height = '220px';

  serviceName: any = [];
  orderList: any = [];
  //////////======================Datepicker fun initialization=================//////////////////////
  date: Date = new Date();
  fromdate: string;
  todate: string; @ViewChild('childtemplate') public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true,
    // height:'30px',
    //width:'200px',
    //selectorHeight:'30px',
    //selectorWidth:'200px',

  };
  //======================================Dropdown Enable variable==================================//
  eanbleclient: boolean = true;
  enablestart: boolean = true;
  eanbleend: boolean = true;
  eanbleservice: boolean = true;
  authinput: EditDetailsAuthorization = new EditDetailsAuthorization();
  payorListgroup: any = [];
  I837: any = [];
  GroupPayorlist: any = [];
  isIns: boolean = false;
  authorizationdetails: any = [];
  EditAuthorization: boolean = false;
  public childGrid: GridModel;
  public filterOptions: object;
  public secondChildGrid: any;
  public showCheckBox: boolean = true;
  public country: { [key: string]: Object }[] = [
    { countryName: 'Ready', countryId: '1' },
    { countryName: 'Validate', countryId: '2' }
  ];
  updatedBO: any = [];
  grouplid: number;
  updatedclaimstatus: any

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];

  ColumnArray: columnWidth[]
  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }
  constructor(public http: HttpClient, private formBuilder: FormBuilder, private ref: ChangeDetectorRef,
    public global: GlobalComponent, public httpService: TimesheetverificationService, public toastrService: ToastrService, @Inject(timesheetverificationdataservice) public timeservice: timesheetverificationdataservice, private modalService: NgbModal, public general: generalservice,
    public dateservice: DateService, private datePipe: DatePipe, @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef) {
    //  ref.detach();
    //   setInterval(() => {
    //     this.ref.detectChanges();
    //   }, 10);
    this.data = timeservice;
  }

  ngOnInit(): void {
    this.toolbar = ['ColumnChooser'];
    this.getService();
    this.getagency();
    this.dates();  // -----------for filter--------------
    this.filterOptions = {
      type: 'Menu'
    };
    this.updatedBO = [];
    let pag=JSON.parse(this.global.globalColumn.column)[0].TimesheetVerification.Pagesize;
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: pag, pageSize: pag, pageSizes: this.pageSizes };
    this.pagshort.itemperpage=pag;
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    // -----------for editsetup--------------
    this.editSettings = { allowEditing: false, mode: 'Normal', allowEditOnDblClick: true }

    // -----------for claimstatus dropdown action --------------
    this.selectionOptions = {
      checkboxOnly: true
    }
    this.checkparams =
    {
      checked: false
    }
    this.countryParams = {
      create: () => {
        this.countryElem = document.createElement('input');
        return this.countryElem;
      },
      read: () => {
        this.updatedclaimstatus = this.countryObj.text;

        // this.updatingrecord(this.updatedclaimstatus);
        return this.countryObj.text;
      },
      destroy: () => {
        this.countryObj.destroy();
      },
      write: () => {


        // args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
        // args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')

        this.countryObj = new DropDownList({
          dataSource: this.country,
          fields: { value: 'countryId', text: 'countryName' },
          placeholder: 'Claim Status',
          floatLabelType: 'Never'
        });
        this.countryObj.appendTo(this.countryElem);
      }
    };
    // this.toolbar = ['Update', 'Cancel'];
    this.dropdata = ['Validate', 'Ready'];
    this.childGrid = {

      queryCellInfo: this.customiseCell,
      queryString: 'serialNo',
      allowSorting: false,
      allowPaging: false,

      load() {
        this.registeredTemplate = {};       // set registertemplate value as empty in load event
        // this.onLoad
      },

      columns: [

        { field: 'lineStatus', headerText: 'LineStatus', width: 75, },
        { field: 'serviceDate', headerText: 'ServiceDate', width: 100 },
        { field: 'dailyHours', headerText: 'Daily Hours', width: 80 },
        { field: 'procedureCode', headerText: 'Procedure Code', width: 100 },
        { field: 'moD1', headerText: 'Mod', width: 50 },
        { field: 'moD2', headerText: 'Mod', width: 50 },
        { field: 'moD3', headerText: 'Mod', width: 50 },
        { field: 'over275Hrs', headerText: 'Over 275 Hours', width: 100 },
        { field: 'remaimimgAuthorizedHours', headerText: 'Remaining Authorized Hours', width: 135 },
        { field: 'overDaily16Hours', headerText: 'Over Daily 16 hours', width: 110 },
        { field: 'payDate', headerText: 'Pay Date', width: 110 },
        // { field: 'uMPIMissingstatus', headerText: 'UMPI Effective or missing', width: 135 },
        { headerText: 'Split Day', width: 80, template: this.childtemplate }
      ]
    };
    //.log(this.grid)
    // customiseCell(args: QueryCellInfoEventArgs,value):any {
    //  this.grid.childGrid.queryCellInfo=this.customiseCell(this.fixedhours)

  }
  onLoad() {
    this.data.subscribe((data: any) => {

      if (data.count > 0) {
        //.log(this.childData)
        this.grid.childGrid.dataSource = this.childData;

      }

    });

    this.grid.childGrid.dataSource = this.childData;
    //.log(this.childData)
    //.log(this.grid)
  }


  //===================================Show column settings===================//
  show() {
    //.log(this.grid,"show");
    //.log(this.grid.columnChooserModule,"show");

    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
  }
  ngOnChanges(changes: SimpleChanges) {
    //debugger;
    let f = changes;


    document.getElementById('OpenModal2').click();
    this.gettimesheetdata();
  }

  //==================================Sub component edit changes============================//

  dataEmitfromChild(event: EditDetailsAuthorization) {
    this.EditAuthorization = false;
    this.authinput.isEdit = false;
    this.authinput.isView = true;


    this.authinput = event
    // this.startdates(this.startDateauth, this.endDateauth, this.clientIdErr)
    document.getElementById("OpenModal1").click();
    document.getElementById("OpenModal2").click()

    this.gettimesheetdata()

  }
  //////////////////////////////////Add Client Auth//////////////////////////////////////
  addClientAuth() {

    this.authinput.ClientId = parseInt(this.clientIdErr);
    this.authinput.isEdit = true;
    this.authinput.AuthorizationId = this.clientauthId;
    this.authinput.isEditAuthorization = true;
    this.authinput.isView = false;
    this.EditAuthorization = true;
    this.authinput.AuthorizationData.id = this.clientauthId;
    this.authinput.AuthorizationData.groupPayorId = this.groupId;
    this.authinput.AuthorizationData.companyId = this.companyId;
    this.authinput.AuthorizationData.groupPayorServiceId = this.groupServiceId;



  }

  ////////////////////////////// get Authorization///////////////////////////////////////////////////////

  startdates(startdate, enddate, clientsid) {

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

        this.httpService.getAuthorization(parameter).subscribe((data: any) => {

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
  ////// Payor based on Group////////////////////////////
  groupchange(id) {

    if (id == undefined) {



    }
    else {

      // this.groupPayerForm.get('groupPayorId').enable()

      this.getpayer(id)
    }


  }
  getpayer(groupId) {
    let url = "api/GroupPayor/getpayerId?";
    let param = new URLSearchParams();
    param.append("groupId", groupId);
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getpayer(param).subscribe((data: any = []) => {

      // let temp:any=[];
      this.payorListgroup = data;
    })
  }
  fixedhours: number = 0;
  getagency() {
    // let url = "api/GroupPayor/getpayerId?";
    let param = new URLSearchParams();
    //param.append("groupId", groupId);
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getAgencySetting(param).subscribe((value: any) => {
      //.log(value)
      this.overfixedhours = parseInt(value.overallFixedHrs);
      this.fixedhours = parseInt(JSON.parse(JSON.stringify(this.overfixedhours)))
      //.log(this.overfixedhours);

    })
  }
  //================================get payor list=============================//

  getPayorList() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getPayorDropDown(params).subscribe((data: any) => {

      this.payorList = data;
    },
      err => {

      })
  }


  ///////////////////////////////////////////Refresh function ////////////////////////////////////////////////////

  Refresh() {


    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = "";
    this.ListSendBO.type = "string"
    this.ListSendBO.field = "fromDate"
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.pagshort = new sortingObj();
    this.pagshort.shortcolumn = "fromDate"
    this.pagshort.shortType = 'ASC';
    this.parentData = []
    this.childData = []
    this.dates();
  }
  // -----------------------------------for toolbar action--------------
  getdata(args) {
    alert("toolbar");
    if (args.data['bit'] > 0) {
      args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
      args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
    }
    var grid = (parentsUntil(args.target, 'e-grid') as any);

    this.result3 = grid.ej2_instances[0].getRowInfo(args.target).rowData;


  }

  // -----------------------------------------for refrsh button--------------------------

  // -----------------------------------------event for double click on the row--------------------------

  recordDoubleClick(args) {
    var grid = (parentsUntil(args.target, 'e-grid') as any);
    (grid.ej2_instances[0].getRowInfo(args.target).rowData);
    this.updateddata = grid.ej2_instances[0].getRowInfo(args.target).rowData;
    this.serialno = this.updateddata.serialNo
      (this.updateddata, "updateddata")

  }
  //-----------------------------------------event for upating status--------------------------
  updatingrecord(updatedclaimstatus) {

    this.updatedBO = [];

    if (updatedclaimstatus == 'Ready') {
      let serialNo = this.serialno;

      this.TimesheetList.forEach(element => {
        if (element.serialNo == serialNo) {
          element.claimStatus = updatedclaimstatus;
          this.updatedBO.push(element);
        }
      });

      this.gettimesheetdata();
    }



  }
  //////================Action begin Event============//////////////////////////
  // public onActionComplete(args) {
  //   this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
  //   this.ListSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
  //   this.conditionlist = [];
  //   if (args.requestType === "filtering" && args.action === "filter") {
  //     this.ListSendBO.type = args.columnType
  //     args.columns.forEach(element => {
  //       this.conditionlist.push(element.properties);

  //     });
  //   }

  // }

  /////////////////////////////////////Action Complete///////////////////////////////

  public onActionComplete(args) {
    this.conditionlist = [];


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

      //.log(hidearr, "hidearr")
      //.log(showarr, "showarr");
      //.log(this.arraycol, "arraycol");

      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {

        this.arraycol[0].TimesheetVerification.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].TimesheetVerification.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        //.log(count, count1, "count");


        if (this.arraycol[0].TimesheetVerification.ShowColumns.length != count1 || this.arraycol[0].TimesheetVerification.HideColumns.length != count) {
          this.arraycol[0].TimesheetVerification.ShowColumns = showarr;
          this.arraycol[0].TimesheetVerification.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    if (args.requestType == "filterafteropen") {
      this.ListSendBO.type = args.columnType;
    }


  }

  // =================================== data change event=====================///////
  public dataStateChange(state): void {
    //.log(state)
    this.type = (state.action.requestType).toString();


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
      if (this.ListSendBO.type == "date") {

        this.ListSendBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.ListSendBO.field = state.action.currentFilterObject.field;
      }
      else {
        this.ListSendBO.value = state.action.currentFilterObject.value;
        this.ListSendBO.field = state.action.currentFilterObject.field;
      }

      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "TimesheetDate";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = this.fromdate;
      }
    }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].TimesheetVerification.Pagesize != state.take) {
          this.arraycol[0].TimesheetVerification.Pagesize = state.take
          console.log("save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    if (state.action.requestType != "refresh") {
      this.gettimesheetdata();
    }

  }

  filterchange() {

    this.ListSendBO.field = "TimesheetDate";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = this.fromdate;
    this.ListSendBO.type = "string"
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.dates();
  }


  ///////////////////Error Modal Fun///////////////////////////////////////////////////////////////////
  updatemodal() {
    // debugger;
    // KeyArr.push(Keyvalue);
    this.KeyArr = [];
    if (this.ErrModalCompany.length != 0) {
      this.ErrModalCompany.forEach(element => {
        if (element.columnName.startsWith("Company_")) {
          this.Keyvalue = {
            id: element.companyId,
            key: element.columnName.slice(8),
            value: element.columnName_i,
            type: 'company',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }
          this.KeyArr.push(this.Keyvalue);
        }
      });

    }
    else if (this.ErrModalClient != 0) {

      this.Keyvalue = [];
      this.ErrModalClient.forEach(element => {
        if (element.columnName_i != undefined) {
          this.Keyvalue = {
            id: element.clientId,
            key: element.columnName.slice(7),
            value: element.columnName_i,
            type: 'client',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }

          this.KeyArr.push(this.Keyvalue);

        }




      });

    }
    else if (this.ErrModalGrouppayor != 0) {

      let i = 0
      this.Keyvalue = [];
      this.ErrModalGrouppayor.forEach(element => {
        if (element.columnName_i != undefined) {

          if ((element.grouppayorId == null || element.grouppayorId == 0 || element.grouppayorId == undefined)
            && (element.companyId == null || element.companyId == 0 || element.companyId == undefined)) {
            if (element.columnName_i != undefined) {
              if (element.columnName.startsWith("Payor_")) {
                this.Keyvalue = {
                  id: element.groupPayorId == null ? 0 : element.groupPayorId,
                  key: element.columnName.slice(6),
                  value: element.columnName_i,
                  type: 'grouppayorcompany',
                  userId: this.global.userID.toString(),
                  AgencyId: parseInt(this.global.globalAgencyId)
                }

              }
              if (element.columnName.startsWith("Company_")) {
                this.Keyvalue = {
                  id: element.groupPayorId == null ? 0 : element.groupPayorId,
                  key: element.columnName.slice(8),
                  value: element.columnName_i,
                  type: 'grouppayorcompany',
                  userId: this.global.userID.toString(),
                  AgencyId: parseInt(this.global.globalAgencyId)
                }
              }
              else if ((!element.columnName.startsWith("Payor_")) && (!element.columnName.startsWith("Company_"))) {

                this.Keyvalue = {
                  id: element.groupPayorId == null ? 0 : element.groupPayorId,
                  key: element.columnName,
                  value: element.columnName_i,
                  type: 'grouppayorcompany',
                  userId: this.global.userID.toString(),
                  AgencyId: parseInt(this.global.globalAgencyId)
                }
              }

            }

            this.KeyArr.push(this.Keyvalue);

          }

          else {
            if (element.columnName_i != undefined) {
              if (element.columnName.startsWith("Payor_")) {
                this.Keyvalue = {
                  id: element.groupPayorId == null ? 0 : element.groupPayorId,
                  key: element.columnName.slice(6),
                  value: element.columnName_i,
                  type: 'grouppayor',
                  userId: this.global.userID.toString(),
                  AgencyId: parseInt(this.global.globalAgencyId)
                }

              }
              else {

                this.Keyvalue = {
                  id: element.groupPayorId == null ? 0 : element.groupPayorId,
                  key: element.columnName,
                  value: element.columnName_i,
                  type: 'grouppayor',
                  userId: this.global.userID.toString(),
                  AgencyId: parseInt(this.global.globalAgencyId)
                }
              }
            }


            this.KeyArr.push(this.Keyvalue);

          }
        }


        // element.id= element.grouppayorId;
        // element.key= element.columnName;
        // element.value= element.columnName_i;
        // this.Keyvalue.id= element.clientId;
        // this.Keyvalue.key = element.columnName.slice(6);
        // this.Keyvalue.value = element.columnName_i;
        // KeyArr.forEach(element => {


        //   element.id= element1.clientId;
        //   element.key= element1.columnName.slice(6);
        //   element.value= element1.columnName_i;

        // });
        // this.KeyArr.push(element);
        i++;
      });

      // this.KeyArr=this.Keyvalue;

    }
    else if (this.ErrModalGrouppayorService != 0) {

      if (this.ErrModalGrouppayorService[0].grouppayorServiceId == 0 || this.ErrModalGrouppayorService[0].grouppayorServiceId == null) {
        this.Keyvalue = {
          id: this.ErrModalGrouppayorService[0].grouppayorServiceId == null || this.ErrModalGrouppayorService[0].grouppayorServiceId == undefined ? 0 : this.ErrModalGrouppayorService.grouppayorServiceId,
          key: this.Payor,
          value: this.ErrModalGrouppayorService[0].columnName_payor,
          type: 'grouppayorservice',
          userId: this.global.userID.toString(),
          AgencyId: parseInt(this.global.globalAgencyId)
        }
        this.KeyArr.push(this.Keyvalue);
        this.Keyvalue = {
          id: this.ErrModalGrouppayorService[0].grouppayorServiceId == null || this.ErrModalGrouppayorService[0].grouppayorServiceId == undefined ? 0 : this.ErrModalGrouppayorService.grouppayorServiceId,
          key: this.Service,
          value: this.ErrModalGrouppayorService[0].columnName_service,
          type: 'grouppayorservice',
          userId: this.global.userID.toString(),
          AgencyId: parseInt(this.global.globalAgencyId)
        }

        this.KeyArr.push(this.Keyvalue);
      }
      this.ErrModalGrouppayorService.forEach(element => {


        if (element.columnName_i != undefined) {
          if (element.columnName == "GroupPayorServiceId") {
            this.Keyvalue = {
              id: element.grouppayorServiceId == null || element.grouppayorServiceId == undefined ? 0 : element.grouppayorServiceId,
              key: element.columnName,
              value: this.grouplid,
              type: 'grouppayorservice',
              userId: this.global.userID.toString(),
              AgencyId: parseInt(this.global.globalAgencyId)
            }
          } else {
            this.Keyvalue = {
              id: element.grouppayorServiceId == null || element.grouppayorServiceId == undefined ? 0 : element.grouppayorServiceId,
              key: element.columnName,
              value: element.columnName_i,
              type: 'grouppayorservice',
              userId: this.global.userID.toString(),
              AgencyId: parseInt(this.global.globalAgencyId)
            }
          }


          this.KeyArr.push(this.Keyvalue);

        }
      });
    }
    else if (this.ErrModalIcd10 != 0) {

      this.ErrModalIcd10.forEach(element => {
        if (element.columnName_i != undefined) {
          this.Keyvalue = {
            id: element.clientId,
            key: element.columnName,
            value: element.columnName_i,
            type: 'icd10',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }

          this.KeyArr.push(this.Keyvalue);

        }
      });
    }
    else if (this.ErrModalclientAuth.length != 0) {
      this.ErrModalclientAuth.forEach(element => {
        if (element.columnName == "Client_ServiceAgreementNo") {
          this.Keyvalue = {
            id: element.clientauthId,
            key: element.columnName.slice(7),
            value: element.columnName_i,
            type: 'clientauth',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }
          this.KeyArr.push(this.Keyvalue);
        }
      });


    }

    else if (this.ErrModalemployee.length != 0) {
      // debugger;
      this.ErrModalemployee.forEach(element => {
        //    debugger;
        if (element.columnName == "Employee_UMPI") {
          this.Keyvalue = {
            id: element.employeeId,
            key: element.columnName.slice(9),
            value: element.columnName_i,
            type: 'employee',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }
          this.KeyArr.push(this.Keyvalue);
        }
        if (element.columnName == "Employee_RNNPI") {
          //    debugger;
          this.Keyvalue = {
            id: element.employeeId,
            key: element.columnName.slice(9),
            value: element.columnName_i,
            type: 'employee',
            userId: this.global.userID.toString(),
            AgencyId: parseInt(this.global.globalAgencyId)
          }
          this.KeyArr.push(this.Keyvalue);
        }
      });


    }


    this.httpService.UpdateTimesheetErr(this.KeyArr).subscribe((data: number) => {
      this.toastrService.success('Updated Successfully', 'Updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      document.getElementById('OpenModal1').click();
      document.getElementById('OpenModal2').click();
      this.gettimesheetdata();
    },
      (err: HttpErrorResponse) => {
        this.Errmsg = err.error
      });
  }

  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.genderList = data;
    })
  }

  ///////////////////////////////////Billing Status Dropdown///////////////////////////////////
  getBillingStatus() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "GROUP");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.GroupPayorlist = data;


      this.GroupPayorlist.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      });


    });
  }


  ///////////////////////////////////authorization///////////////////////////////////
  getAuth() {

    let params = new URLSearchParams();
    params.append("Id", this.clientauthId.toString());
    this.httpService.getauth(params).subscribe((data: ClientAuthorizationBO) => {

      data[0].startDate = this.datePipe.transform(data[0].startDate, 'MM-dd-yyyy');
      data[0].endDate = this.datePipe.transform(data[0].endDate, 'MM-dd-yyyy');
      // this.authinput.AuthorizationData = data[0];
      this.authinput.AuthorizationData.startDate = data[0].startDate;
      this.authinput.AuthorizationData.endDate = data[0].endDate;
      this.authinput.AuthorizationData.insuranceNo = data[0].insuranceNo;
      this.authinput.AuthorizationData.totalUnits = data[0].totalUnits;
      this.authinput.AuthorizationData.unitsRemaining = data[0].unitsRemaining;

      this.addClientAuth();
      // this.authinput.AuthorizationData.unitsRemaining = data.unitsRemaining;


      // this.GroupPayorlist.forEach(element => {
      //   element.label = element.Value;
      //   element.value = element.Key.toString();
      // });


    });
  }
  clientauthId: number;
  groupId: number;
  companyId: number;
  groupServiceId: number;
  ErrModalclientAuth: any = [];
  ErrModalemployee: any = [];
  payrname: string;
  errmodal(name) {
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    // debugger;

    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
    document.getElementById("OpenModal1").click();
    this.ErrModalCompany = [];
    this.ErrModalClient = [];
    this.ErrModalGrouppayor = [];
    this.ErrModalGrouppayorService = [];
    this.ErrModalIcd10 = [];
    this.ErrModalclientAuth = [];
    this.ErrModalemployee = [];
    if (name.startsWith("Client_")) {
      this.getGender();
      if (name == "Client_ServiceAgreementNo") {
        this.showerrolist.forEach(element => {
          this.clientIdErr = element.clientId.toString();
          this.clientauthId = element.clientauthId;
          this.groupId = element.groupPayorId;
          this.companyId = element.companyId;
          this.groupServiceId = element.grouppayorServiceId;
        });

        if (this.clientauthId != null) {
          this.showerrolist.forEach(element => {
            this.clientIdErr = element.clientId.toString();

            document.getElementById('authedit').click();
            if (element.isValid == false && element.columnName == "Client_ServiceAgreementNo") {

              this.ErrModalclientAuth.push(element);
            }
          });
          // this.authinput.type = this.clientauthId == null ? "new" : "edit";
          // // this.getAuth();
          // this.addClientAuth();
        }
        else {
          this.authinput.type = "new";
          this.addClientAuth();
          this.EditAuthorization = true;
        }




        this.ErrModalClient = [];
      }
      else {
        this.showerrolist.forEach(element => {
          this.clientIdErr = element.clientId.toString();


          if (element.isValid == false && element.columnName.startsWith("Client_") && element.columnName != "Client_ServiceAgreementNo") {

            this.ErrModalClient.push(element);
          }
        });
      }


    }
    else if (name.startsWith("Company") && name != "CompanyIdentifier_NPI" && name != "CompanyIdentifier_CompanyName") {
      this.getI837();
      this.getPayorList();
      this.getBillingStatus();
      this.showerrolist.forEach(element => {
        if ((element.groupPayorId == null || element.groupPayorId == undefined) && (element.companyId == null || element.companyId == undefined)) {
          // if (element.columnName == "GroupPayorId") {
          //   element.columnName = "Group";
          // }

          if (element.isValid == false && ((element.columnName.startsWith("Payor") || element.columnName == "GroupPayorId" || element.columnName == "BillingpayorID"
            || element.columnName == "I837PInsTypeLid" || element.columnName == "Claim_Filling_Ind" || element.columnName == "GroupPayorCompany_ProviderNo"
            || element.columnName == "GroupPayorCompany_CompanyFEIN") || element.columnName.startsWith("Company")) && element.columnName != "CompanyIdentifier_NPI" && element.columnName != "CompanyIdentifier_CompanyName") {
            this.ErrModalGrouppayor.push(element);
          }
        }

        else
          if (element.isValid == false && element.columnName.startsWith("Company")) {
            this.groupId = element.groupPayorId;
            this.companyId = element.companyId;
            this.payrname = element.payorName;


            // this.saveErr = (element.groupPayorId != null || element.groupPayorId != undefined|| element.groupPayorId !=0)? "":"hgfhg";
            if (this.groupId != null && element.columnName.startsWith("Company")) {
              this.saveErr = true;
            }
            this.ErrModalCompany.push(element);
          }
      });
    }
    else if (name.startsWith("Payor") || name == "GroupPayorId" || name == "Group" || name == "BillingpayorID"
      || name == "I837PInsTypeLid" || name == "Claim_Filling_Ind" || name == "GroupPayorCompany_ProviderNo"
      || name == "GroupPayorCompany_CompanyFEIN" || name.startsWith("Company") && name != "CompanyIdentifier_NPI" && name != "CompanyIdentifier_CompanyName") {
      this.getI837();
      this.getPayorList();
      this.getBillingStatus();
      this.showerrolist.forEach(element => {
        if ((element.groupPayorId == null || element.groupPayorId == undefined) && (element.companyId == null || element.companyId == undefined)) {
          // if(element.columnName =="GroupPayorId")
          // {
          //   element.columnName ="Group";
          // }
          if (element.isValid == false && ((element.columnName.startsWith("Payor") || element.columnName == "GroupPayorId" || element.columnName == "Group" || element.columnName == "BillingpayorID"
            || element.columnName == "I837PInsTypeLid" || element.columnName == "Claim_Filling_Ind" || element.columnName == "GroupPayorCompany_ProviderNo"
            || element.columnName == "GroupPayorCompany_CompanyFEIN") || element.columnName.startsWith("Company")) && element.columnName != "CompanyIdentifier_NPI" && element.columnName != "CompanyIdentifier_CompanyName") {
            this.ErrModalGrouppayor.push(element);
          }
        }
        else {
          if (element.isValid == false && ((element.columnName.startsWith("Payor") || element.columnName == "GroupPayorId" || element.columnName == "Group" || element.columnName == "BillingpayorID"
            || element.columnName == "I837PInsTypeLid" || element.columnName == "Claim_Filling_Ind" || element.columnName == "GroupPayorCompany_ProviderNo"
            || element.columnName == "GroupPayorCompany_CompanyFEIN"))) {
            this.groupId = element.groupPayorId;
            this.companyId = element.companyId;
            this.payrname = element.payorName;


            // this.saveErr = (element.groupPayorId != null || element.groupPayorId != undefined|| element.groupPayorId !=0)? "":"hgfhg";
            if (this.groupId != null && (element.columnName == "GroupPayorCompany_CompanyFEIN" || element.columnName == "Claim_Filling_Ind" || element.columnName == "GroupPayorCompany_ProviderNo")) {
              this.saveErr = true;
            }
            this.ErrModalGrouppayor.push(element);
            // this.ErrModalGrouppayor.push(element);


          }
        }

      });
    }
    else if (name == "GroupPayorServiceId" || name == "Unitrate"
      || name == "BillingUnit" || name == "NetRate" || name == "ServiceLoc") {
      this.getBillingStatus();
      this.getBillingUnit();
      this.getService();
      this.showerrolist.forEach(element => {
        if (element.isValid == false && ((element.columnName == "GroupPayorServiceId" || element.columnName == "Unitrate"
          || element.columnName == "BillingUnit" || element.columnName == "NetRate" || element.columnName == "ServiceLoc"))) {
          this.ErrModalGrouppayorService.push(element);
        }
      });
    }
    else if (name == "Icd10" || name == "CertificateICD10_01") {
      this.EditICD = true;

      this.Editcert = true;

      this.showerrolist.forEach(element => {
        if (element.isValid == false && ((element.columnName == "Icd10") || (element.columnName == "CertificateICD10_01"))) {
          this.clientIdErr = element.clientId.toString();
          this.ErrModalIcd10.push(element);
        }
      });

      this.EditCertificateoption.clientId = parseInt(this.clientIdErr);
      this.EditCertificateoption.type = 'new';


    }
    else if (name == "StartofCareId") {
      this.EditStartofcare = true;
      this.showerrolist.forEach(element => {
        if (element.isValid == false && (element.columnName == "StartofCareId")) {
          this.clientIdErr = element.clientId.toString();
        }
      });

      // this.EditSOCOptions.clientId = parseInt(this.clientIdErr);
      this.global.clientId = parseInt(this.clientIdErr);
      this.EditSOCOptions.type = 'new';
      this.EditSOC = true;

    }
    else if (name == "Employee_UMPI") {
      this.showerrolist.forEach(element => {
        if (element.isValid == false && element.columnName == "Employee_UMPI") {
          this.ErrModalemployee.push(element);
          //.log( this.ErrModalemployee)
        }
      });
    }
    else if (name == "Employee_RNNPI") {
      this.showerrolist.forEach(element => {
        if (element.isValid == false && element.columnName == "Employee_RNNPI") {
          this.ErrModalemployee.push(element);
        }
      });
    }
    else if (name == "EmployeePayorUMPI") {

      this.showerrolist.forEach(element => {
        if (element.isValid == false && element.columnName == "EmployeePayorUMPI") {
          this.payoRequiredViewEdit.isEdit = true;
          this.payoRequiredViewEdit.isView = false;
          this.payoRequiredViewEdit.employeeId = element.employeeId
          this.payoRequiredViewEdit.payorRequiredId = 0;

          this.payoRequiredViewEdit.payorRequired = [];
          this.payoRequiredViewEdit.payorActiotype = "new"
          this.enablepayrate = true;
          // debugger;
        }
      })

    }

    else if (name == "G2id" || name == "CompanyIdentifier_NPI" || name == "CompanyIdentifier_CompanyName") {
      this.showerrolist.forEach(element => {
        if (element.isValid == false && (element.columnName == "G2id" || element.columnName == "CompanyIdentifier_NPI"
          || element.columnName == "CompanyIdentifier_CompanyName")) {
          this.ErrModalGrouppayorService.push(element);
        }
      });
    }


  }

  /////////////Billing unit dropdown and Service ==========================////////////
  getBillingUnit() {

    let url = "api/LOV/getLovDropDownByCode?";
    let params = new URLSearchParams();
    params.append("Code", "BILLING");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getLOVCode(params).subscribe((data: [{ Key: number, Value: string }]) => {

      this.billingUnit = data;

    },
      err => {
        // alert(err.error)
      });
  }



  getService() {

    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getService(param).subscribe((data: any) => {

      this.Allservice = data;


      // let temp:any="";
      // data.forEach(element => {
      // temp={label:element.Value,value:element.Key.toString()}
      // this.Allservice.push(temp);
      // });
      // this.payerLst=data;
    })
  }


  /////////////////////////////////////get timesheet Iteam////////////////////////////////////////////////////////////////

  gettimesheetdata() {
    this.errorlist = [];
    // this.TimesheetList = new TimeSheetVerificationList();
    this.parentData = [];
    this.childData = [];
    this.details = [];
    this.ListSendBO.agencyId = parseInt(this.global.globalAgencyId);
    this.ListSendBO.fromDate = new Date(new Date(this.fromdate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.ListSendBO.toDate = new Date(new Date(this.todate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.ListSendBO.pageitem = parseInt(this.pagshort.itemperpage.toString());
    this.ListSendBO.currentpageno = this.pagshort.currentPgNo;


    this.timeservice.execute(this.ListSendBO)


let count=0;
    this.data.subscribe((data: any) => {


      count= count+1;
      if( data!=null && data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
      this.selectedId = [];
      this.parentData = data.result;

      this.TimesheetList = this.timeservice.getwholeData();
      this.serialno = this.timeservice.getserialNo();
      this.childData = this.timeservice.getChildData();
      this.details = this.timeservice.getDetails();
      this.errorlist = this.timeservice.getErrorlist();
      this.idsList = this.timeservice.getidsList();
      console.log(this.selectAllValue, "selectAllValue====");

      if (this.selectAllValue) {
        this.TimesheetList.forEach((element, index) => {
          console.log(element.claimStatus, "element.claimStatus");

          if (element.claimStatus == 'Ready')
          {
            this.selectedId.push(index);
           
          }
            
        });
        console.log(this.selectedId, "this.selectedId");

         setTimeout(() => {
       this.grid.selectionModule.selectRows(this.selectedId);
        }, 1000);
        this.mulitpledata = this.idsList;
      }

      if (this.selectsingleValue) {
        this.singledata.forEach(sel => {
          this.TimesheetList.forEach((element, index) => {
            console.log(element.claimStatus, "element.claimStatus");

            if (sel.timesheetId == element.timesheetId)
              this.selectedId.push(index);
          });
        });

        console.log(this.selectedId, "this.selectedId");

        // setTimeout(() => {
        // this.grid.selectionModule.selectRows(this.selectedId);
        this.grid.selectRows(this.selectedId);
        // }, 800);
        console.log(this.grid.selectRows(this.selectedId), " this.grid.selectRows(this.selectedId);");

        // this.singledata=this.selectedCheckbox;
      }
      this.childData.forEach((element) => {
        element.overhours = this.fixedhours;
      })
      //.log(this.childData)
      this.wholedata = data.result;
      let objArray: any = [];
      let objArray1: any = [];
      // -------------------------------------------------------the child grid configuration-------------------------
      //   this.grid.childGrid.dataSource = this.childData;
      // var col = { field: 'Edit', headerText: 'Edit', width: 50, template: this.childtemplate }
      this.childGrid = {
        rowDataBound: this.rowDataBound1,
        dataSource: this.childData,
        queryCellInfo: this.customiseCell,
        queryString: 'serialNo',
        allowSorting: false,
        allowPaging: false,
        load() {
          // this.onLoad
          this.registeredTemplate = {};


        },
        editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

        columns: [

          { field: 'lineStatus', headerText: 'LineStatus', width: 75, },
          { field: 'serviceDate', headerText: 'ServiceDate', width: 100 },
          { field: 'dailyHours', headerText: 'Daily Hours', width: 80 },
          { field: 'procedureCode', headerText: 'Procedure Code', width: 100 },
          { field: 'moD1', headerText: 'Mod', width: 50 },
          { field: 'moD2', headerText: 'Mod', width: 50 },
          { field: 'moD3', headerText: 'Mod', width: 50 },
          { field: 'over275Hrs', headerText: 'Over' + this.fixedhours.toString() + 'Hrs', width: 100 },
          { field: 'remaimimgAuthorizedHours', headerText: 'Remaining Authorized Hours', width: 135 },
          { field: 'overDaily16Hours', headerText: 'Over Daily 16 hours', width: 110 },
          { field: 'payDate', headerText: 'Pay Date', width: 110 },
          // { field: 'uMPIMissingstatus', headerText: 'UMPI Effective or missing', width: 135 },
          { headerText: 'Split Day', width: 50, template: this.childtemplate }
        ]
      };

      this.grid.childGrid.columns = [

        { field: 'lineStatus', headerText: 'LineStatus', width: 75, },
        { field: 'serviceDate', headerText: 'ServiceDate', width: 100 },
        { field: 'dailyHours', headerText: 'Daily Hours', width: 80 },
        { field: 'procedureCode', headerText: 'Procedure Code', width: 100 },
        { field: 'moD1', headerText: 'Mod', width: 50 },
        { field: 'moD2', headerText: 'Mod', width: 50 },
        { field: 'moD3', headerText: 'Mod', width: 50 },
        { field: 'over275Hrs', headerText: 'Over' + this.fixedhours.toString() + 'Hrs', width: 100 },
        { field: 'remaimimgAuthorizedHours', headerText: 'Remaining Authorized Hours', width: 135 },
        { field: 'overDaily16Hours', headerText: 'Over Daily 16 hours', width: 110 },
        { field: 'payDate', headerText: 'Pay Date', width: 110 },
        // { field: 'uMPIMissingstatus', headerText: 'UMPI Effective or missing', width: 135 },
        { headerText: 'Split Day', width: 80, template: this.childtemplate }
      ];
      //   let column = this.grid.getColumnByField('over275Hrs'); // Get column object.
      // column.headerText ='Over'+this.fixedhours.toString()+'Hours';
      // this.grid.childGrid.;
      //this.grid.childGrid.queryCellInfo=this.customiseCell(Event,this.fixedhours)
      // this.grid.childGrid.load = this.onLoad();

      //.log(this.grid)

    })





  }

  // gettimesheetdata1() {

  //   this.global.loading = true;


  //   this.errorlist = [];
  //   // this.TimesheetList = new TimeSheetVerificationList();
  //   this.parentData = [];
  //   this.childData = [];
  //   this.details = [];
  //   let url1 = "api/TimeSheetVerfication/GetTimeSheetVerfication?";
  //   this.ListSendBO.agencyId = parseInt(this.global.globalAgencyId);
  //   this.ListSendBO.fromDate = this.fromdate;
  //   this.ListSendBO.toDate = this.todate;
  //   this.ListSendBO.pageitem = parseInt(this.pagshort.itemperpage.toString());
  //   this.ListSendBO.currentpageno = this.pagshort.currentPgNo;

  //   let params1 = new URLSearchParams();
  //   params1.append("AgencyId", this.global.globalAgencyId);
  //   params1.append("FromDate", this.fromdate);
  //   params1.append("ToDate", this.todate);
  //   this.httpService.gettimesheetList(params1).subscribe((data: TimeSheetVerificationList[]) => {


  //     // this.http.get(url1 + params1).subscribe((data: any) => {


  //     this.global.loading = false;
  //     this.TimesheetList = JSON.parse(JSON.stringify(data))
  //     this.wholedata = data;
  //     let objArray: any = [];
  //     let objArray1: any = [];
  //     let objchildarray: any = [];
  //     let clientId: number;
  //     let companyId: number;
  //     let grouppayorId: number;
  //     let grouppayorServiceId: number;
  //     let clientcertiificationId: number;
  //     // this.childData =[];

  //     // this.parentData
  //     if (data.length != 0) {
  //       data.forEach(element => {
  //         this.serialno = element.serialNo
  //         clientId = element.clientId
  //         // ----------for errolist-----------
  //         let btncount = 0;
  //         let buttoncolor: any;
  //         element.error.forEach(element => {

  //           if (element.isValid == true) {

  //             this.global.loading = false;
  //             element.color = "Green";
  //             element.colr = 'black'
  //             element.status = 'Valid'
  //             //  this.buttoncolor = "Green"
  //           }
  //           if (element.isValid == false) {
  //             element.color = "Red"
  //             element.colr = 'Red'
  //             //  this.buttoncolor = "red"
  //             element.status = 'Not valid'
  //             btncount += 1;
  //           }
  //           if (btncount > 0) {
  //             buttoncolor = "Red"
  //           }
  //           else {
  //             buttoncolor = "Green"
  //           }
  //           element.serialno = this.serialno;

  //           objArray1.push(element);
  //         });

  //         // ----------for parentgrid list-----------
  //         element.clientName = element.client_LastName.toString() + "," + " " + element.client_FirstName.toString();
  //         element.employee = element.employee_LastName.toString() + "," + " " + element.employee_FirstName.toString();
  //         if (element.claimStatus == "Validate") {
  //           element.bit = 1;
  //           element.color = 'red'
  //         }
  //         else {
  //           element.bit = 0;
  //           element.color = 'green'
  //         }
  //         let fromDate = this.datePipe.transform(element.fromDate, "MM/dd/yyyy")
  //         let toDate = this.datePipe.transform(element.toDate, "MM/dd/yyyy")
  //         let obj =
  //         {
  //           clientName: element.clientName,
  //           insuredId: element.client_InsuranceNo,
  //           'payer': element.payorName,
  //           'fromDate': fromDate,
  //           "employeeID": element.employeeId,
  //           'toDate': toDate,
  //           // 'HireDate': new Date(704692800000),
  //           'totalHours': element.totalHours,
  //           'employee': element.employee,
  //           'employeeUMPI': element.employee_UMPI,
  //           'payorID': element.billingpayorID,
  //           'totalAmountBIlled': element.totalAmountBIlled,
  //           'claimStatus': element.claimStatus,
  //           'service': element.serviceCode,
  //           'serialNo': element.serialNo,
  //           'buttoncolor': buttoncolor,
  //           'color': element.color,
  //           'bit': element.bit,
  //           'validate': ''
  //         }

  //         objArray.push(obj);
  //         // ----------for childgrid data-----------
  //         element.lineItem.forEach(element => {
  //           if (element.lineStatus == "Validate") {
  //             element.bit = 1;
  //             // element.color = 'red'
  //           }
  //           else {
  //             element.bit = 0;
  //             // element.color = 'green'
  //           }
  //           let serviceDate = this.datePipe.transform(element.serviceDate, "MM/dd/yyyy")
  //           let obj1 =
  //           {

  //             'serialNo': element.serialNo,
  //             'lineStatus': element.lineStatus,
  //             'serviceDate': this.datePipe.transform(element.serviceDate, "MM/dd/yyyy"),
  //             'dailyHours': element.dailyHours,
  //             'procedureCode': element.procedureCode,
  //             // 'HireDate': new Date(704692800000),
  //             'moD1': element.mOD1,
  //             'moD2': element.mOD2,
  //             'moD3': element.mOD3,
  //             'over275Hrs': element.over275Hrs,
  //             'remaimimgAuthorizedHours': element.remaimimgAuthorizedHours,
  //             'overDaily16Hours': element.overDaily16Hours,
  //             'timeSheetId': element.timeSheetId,
  //             'bit': element.bit,
  //             'payDate': this.datePipe.transform(element.paydate, "MM/dd/yyyy")

  //           }

  //           this.childData.push(obj1);


  //         });

  //         this.parentData = objArray;
  //         this.errorlist = objArray1;


  //       });
  //       // ----------for splitday data-----------

  //       data.forEach(element => {


  //         element.lineItem.forEach(element => {
  //           element.lineItemDetail.forEach(element => {
  //             let serviceDate = this.datePipe.transform(element.serviceDate, "MM/dd/yyyy")

  //             let obj2 =
  //             {

  //               // 'serialNo': element.serialNo,
  //               'lineStatus': element.lineStatus,
  //               'serviceDate': serviceDate,
  //               "dailyHours": element.dailyHours,
  //               'procedureCode': element.procedureCode,
  //               // 'HireDate': new Date(704692800000),
  //               'moD1': element.mOD1,
  //               'moD2': element.mOD2,
  //               'moD3': element.mOD3,
  //               'over275Hrs': element.over275Hrs,
  //               'remaimimgAuthorizedHours': element.remaimimgAuthorizedHours,
  //               'overDaily16Hours': element.overDaily16Hours,
  //               'timeSheetId': element.timeSheetId


  //             }
  //             this.details.push(obj2)
  //           });


  //         });
  //         this.childGrid = {
  //           rowDataBound: this.rowDataBound1,
  //           dataSource: this.childData,
  //           queryCellInfo: this.customiseCell,
  //           queryString: 'serialNo',
  //           allowSorting: false,
  //           allowPaging: false,
  //           load() {
  //             this.registeredTemplate = {};
  //             this.onLoad();
  //           },
  //           editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },

  //           columns: [

  //             { field: 'lineStatus', headerText: 'LineStatus', width: 75, },
  //             { field: 'serviceDate', headerText: 'ServiceDate', width: 100 },
  //             { field: 'dailyHours', headerText: 'Daily Hours', width: 80 },
  //             { field: 'procedureCode', headerText: 'Procedure Code', width: 100 },
  //             { field: 'moD1', headerText: 'Mod', width: 50 },
  //             { field: 'moD2', headerText: 'Mod', width: 50 },
  //             { field: 'moD3', headerText: 'Mod', width: 50 },
  //             { field: 'over275Hrs', headerText: 'Over 275 Hours', width: 100 },
  //             { field: 'remaimimgAuthorizedHours', headerText: 'Remaining Authorized Hours', width: 135 },
  //             { field: 'overDaily16Hours', headerText: 'Over Daily 16 hours', width: 110 },
  //             { field: 'payDate', headerText: 'Pay Date', width: 110 },
  //             // { field: 'uMPIMissingstatus', headerText: 'UMPI Effective or missing', width: 135 },
  //             { headerText: 'Split Day', width: 50, template: this.childtemplate }
  //           ]
  //         };


  //       });
  //     }

  //   },

  //     (err: HttpErrorResponse) => {
  //       this.global.loading = false;
  //     })


  //   // -------------------------------------------------------the child grid configuration-------------------------


  // }


  // --------------------------------------event for accessing template of split day-----------------------------
  splitup(args: any) {

    this.detailstime = [];
    var grid = (parentsUntil(args.target, 'e-grid') as any);

    this.result2 = grid.ej2_instances[0].getRowInfo(args.target).rowData;


    this.timeSheetId = this.result2.timeSheetId;



    this.details.forEach(element => {
      if (element.timeSheetId == this.timeSheetId) {
        this.detailstime.push(element)
      }

    });


    // document.getElementById('split').click();
    // this.dialogService.open(splitday);
  }

  // --------------------------------------for editing timesheet-----------------------------
  Edittimesheets(list) {


    this.lineStatus = list.lineStatus;
    this.dailyHours = list.dailyHours;
    this.uMPIMissing = list.uMPIMissing
    this.remaimimgAuthorizedHours = list.remaimimgAuthorizedHours;
    this.overDaily16Hours = list.overDaily16Hours
    this.mOD1 = list.moD1;
    this.mOD2 = list.moD2
    this.mOD3 = list.moD3;
    this.serviceDate = list.serviceDate
    this.procedureCode = list.serviceId
    this.over275Hrs = list.over275Hrs
    this.timesheetIdservice = list.timeSheetId
    // this.dialogService.open(Edittimesheet);
  }


  ///////////////////////////////////////////Date piker function///////////////////////////////////////////////////////

  newdates(event, type) {
    if (type == "inputchage") {
      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
        this.serviceDate = val1;

      }
    }
    if (type == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        this.serviceDate = val1;
      }
    }


  }

  // --------------------------------------event for updating the timesheet data of splitday-----------------------------
  save() {


    let val = {
      serviceId: +this.procedureCode,
      id: this.timesheetIdservice,
      serviceDate: new Date(new Date(this.serviceDate).toDateString() + " " + "00:00:000" + " " + "GMT").toISOString(),
    }

    this.httpService.updateTimesheetdata(val).subscribe((data: any) => {

      document.getElementById('OpenModal4').click();
      document.getElementById('OpenModal3').click();
      this.toastrService.success('Record has been updated successfully!', 'Record updated');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      this.gettimesheetdata()
    });
    // let url = "api/BillingClaim/SaveBillingClaim";
    // const httpOptions =
    // {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //   })
    // };
    // let obj = {
    //   LineStatus: this.lineStatus,
    //   ServiceDate: this.serviceDate,
    //   DailyHours: this.dailyHours,
    //   ProcedureCode: this.procedureCode,
    //   MOD1: this.mOD1,
    //   MOD2: this.mOD2,
    //   MOD3: this.mOD3,
    //   Over275Hrs: this.over275Hrs,
    //   RemaimimgAuthorizedHours: this.remaimimgAuthorizedHours,
    //   OverDaily16Hours: this.overDaily16Hours,
    //   UMPIMissing: this.uMPIMissing
    // }
    // this.http.post(url, obj, httpOptions).subscribe((data: any) => {


    // },
    // err => {
    //   let status: any = 'danger';
    //   this.toastrService.show(
    //     'PayRoll has been update Error!',
    //     'PayRoll Error', { status }), 8000;
    // }
    // );
  }

  // -----------------------------------------event for sent to bill button--------------------------
  getAlert: string = "";
  sendingdata: TimeSheetVerificationList[];
  selecttobill() {


    if (this.Type == 1) {
      this.sendingdata = this.mulitpledata;
    }
    else if (this.Type == 2) {

      this.sendingdata = this.singledata;

    }

    this.sendingdata.forEach(element => {
      element.fromDate = new Date(new Date(element.fromDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
      element.toDate = new Date(new Date(element.toDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    });

    if (this.sendingdata.length != 0) {
      console.log(this.sendingdata, "this.sendingdata");

      this.httpService.Selectbill(this.sendingdata).subscribe((data: number) => {
        this.sendingdata = [];
        this.singledata = [];
        this.mulitpledata = []
        this.gettimesheetdata();
        this.toastrService.success('Selected Record sent to bill successfully!', 'Sent successfully');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);

      }, (err: HttpErrorResponse) => {

        this.toastrService.error(err.error);
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);

      }


      );
    }

    if (this.sendingdata.length == 0) {
      this.toastrService.error('No Record Selected for Send to bill !!!');
      setTimeout(() => {
        this.toastrService.clear();
      }, 8000);
      // this.getAlert = "No Record Selected for Send to bill !!!";

      // if (this.getAlert != "") {
      //   setTimeout(() => {
      //     this.getAlert = "";
      //   }, 8000)
      // }
    }


    // this.sendingdata = [];
    // this.singledata=[];
    // this.mulitpledata=[]
  }

  /////////////////////////////get i837 Dropdown//////////////////////////
  getI837() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "I837");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);

    this.httpService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {

      this.I837 = data;
      this.I837.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      });

    },
      (err: HttpErrorResponse) => {
        // this.ListI837 = "";
        // this.ListI837 = JSON.stringify(err.error);

        // if (this.ListI837 != "") {
        //   setTimeout(() => {
        //     this.ListI837 = "";
        //   }, 8000)
        // }
      });
  }
  // ----------------------------------------- to get current date as default--------------------------
  dates() {
    var d = this.date.getDate();
    var m = this.date.getMonth() + 1; //Jan is 0
    var yyyy = this.date.getFullYear();
    this.fromdate = m + '/' + d + '/' + yyyy;
    this.todate = m + '/' + d + '/' + yyyy;

    this.gettimesheetdata();
  }

  // -----------------------------------------event for childgrid--------------------------
  rowDataBound1(args) {
    // const claimStatus = 'claimStatus';
    if (args.data['bit'] > 0) {
      args.row.style.color = 'White';
      // args.row.style.background = '#EC7063';
    }
  }
  datavaluechange(value): any {

    //.log(value)
    return value;
  }
  // -----------------------------------------event for to get styles for particular cell on condition--------------------------
  overall: number = 275;
  customiseCell(args: QueryCellInfoEventArgs) {
    //  //.log(args)
    // //.log( )
    //let val1=this.datavaluechange(args)
    ////.log(val1);
    // this.datavaluechange(args);
    // let val=this.fixedhours;
    if (args.column.field === 'over275Hrs') {
      // //.log(args.data['overhours'],"overhours")
      // //.log(val)
      if (args.data[args.column.field] > args.data['overhours']) {

        args.cell.classList.add('warning');
        //.log(args.cell.classList,"insideif")
        //.log( args,"insideif")
      }
    }
    if (args.column.field === 'overDaily16Hours') {
      if (args.data[args.column.field] > 16) {
        args.cell.classList.add('warning');
      }
    }
    if (args.column.field === 'remaimimgAuthorizedHours') {
      if (args.data[args.column.field] == 0) {
        args.cell.classList.add('warning');

      }

    }
  }

  // -----------------------------------------event for allowing edit for particular cell--------------------------
  cellEdit(args: CellEditArgs) {
    if (args.value === 'Ready') {
      args.cancel = true;
    }
  }

  validatebutton(args: QueryCellInfoEventArgs) {


    if (args.column.field == "validate") {
      // console.log(args.cell.firstElementChild.firstElementChild)
      if (args.data['buttoncolor'] == "Red") {
        args.cell.firstElementChild.firstElementChild.classList.add('invalid')

      }
      if (args.data['buttoncolor'] == "Green") {
        args.cell.firstElementChild.firstElementChild.classList.add('valid')
      }
    }

  }

  // ------------------------------------testing for edit-----------------------------------------------
  // public dataStateChange(state: DataStateChangeEventArgs): void {
  //   //.log('BEFORE: ' + JSON.stringify((<any>this.parentData)));
  //   setTimeout(() => {
  //     //.log('AFTER: ' + JSON.stringify((<any>this.parentData)));
  //   }, 0);
  // }

  // public actionComplete(args) {
  //   var grid = (parentsUntil(args.target, 'e-grid') as any);
  //   //.log(grid, "griddata");
  //   if (args.requestType === 'save') {
  //     var grid = (parentsUntil(args.target, 'e-grid') as any);
  //     //.log(grid, "griddata");

  //   }
  // }

  public dataSourceChanged(state: DataSourceChangedEventArgs): void {
    //.log(state)
    if (state.action === 'edit') {

      state.endEdit();
    }
  }

  SelectErrorData() {

    this.global.loading = false;
    if (this.isEnabled == true) {
      this.showerrolist = this.showerrolistfilter.filter(err => err.isValid == false);
    }
    else {
      this.showerrolist = this.showerrolistfilter;
    }
  }

  // -----------------------------------------event for assigning selected record to be sent to bill--------------------------
  show1(args: any): void {
    this.mulitpledata = []

    var customselect = [];

    console.log(this.selectedCheckbox, "selectedCheckbox");

    if (args.checked && args.target.classList.contains('e-checkselectall')) {
      //.log(args.checked && args.target.classList.contains('e-checkselectall'),"selectall");
      //   if (this.selIndex.length) {
      //     this.grid.selectRows(this.selIndex);
      //     this.selIndex = [];
      // }
      this.selectAllValue = true;
      this.mulitpledata = this.idsList;
      console.log(this.mulitpledata,"data");

      // this.idsList.forEach(element => {

      //   });
      this.Type = 1;
      var row1: any = this.grid.getSelectedRecords();
      var selectedrow = this.grid.getRowInfo(args.target)
      let resultantdata: any = selectedrow.rowData;

      row1.forEach(element => {
        if (element.claimStatus == 'Ready') {
          let serialNo = element.serialNo;
          console.log(this.TimesheetList, "this.TimesheetList");

          this.TimesheetList.forEach(element => {
            // this.idsList.forEach(c => {
            //   //.log(element.timesheetId,"element.TimesheetId");
            // if(element.timesheetId == c.timesheetId)
            // {
            //   console.log(element.timesheetId,"element.timesheetId");

            //   this.mulitpledata.push(element);
            // }
            if (element.serialNo == serialNo) {
              // this.mulitpledata.push(element);
            }


            // });

          });

        }
      });
      //.log(this.mulitpledata,"data");

      if (this.mulitpledata.length == 0) {
        this.selectAllValue = false;
        this.toastrService.error('Ready status claims only can be selected for send to bill !!!');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        // this.getAlert = "Ready status claims only can be selected for send to bill !!!";

        // if (this.getAlert != "") {
        //   setTimeout(() => {
        //     this.getAlert = "";
        //   }, 8000)
        // }
      }
      for (var i = 0; i < args.selectedRowIndexes.length; i++) {
        var row = this.grid.getRowByIndex(args.selectedRowIndexes[i]);



        if (!row.querySelector('.disablecheckbox')) {


          customselect.push(args.selectedRowIndexes[i])

        }
      }



      this.grid.selectRows(customselect)


    }
    else {

      this.selectAllValue = false;
      this.Type = 2;

      let result = this.grid.getRowInfo(args.target)

      this.result4 = result.rowData;
      if (args.checked) {
        this.selectsingleValue = true;
        this.TimesheetList.forEach(element => {


          if (element.serialNo == this.result4.serialNo && element.claimStatus != 'Validate') {
            this.singledata.push(element)

            // this.selectedCheckbox.push(element)
          }
        });


      }
      else {

        for (let data of this.singledata) {
          if (this.result4.serialNo === data.serialNo) {
            this.singledata.splice(this.singledata.indexOf(data), 1);
            // this.selectedCheckbox.splice(this.selectedCheckbox.indexOf(data), 1);
            break;
          }
        }

      }
      // this.singledata = this.selectedCheckbox;
      // console.log(this.selectedCheckbox,"selectedCheckbox");
      console.log(this.singledata, "singledata");

    }

  }
  public selIndex: number[] = [];
  // -----------------------------------------event for acheiving some styles based on the condition--------------------------
  rowDataBound(args) {
    // const claimStatus = 'claimStatus';
    //.log(args.data,"args");
    //.log(this.idsList,"args");
    this.idsList.forEach(element => {
      //.log(element,"element");
      //.log(args.data['timesheetId'] ,"args.data['timesheetId']");
      if (args.data['timesheetId'] == element) {
        this.selIndex.push(parseInt(args.row.getAttribute('aria-rowindex'), 10));
      }
    });
    //.log(this.selIndex,"selIndex");

    if (args.data['bit'] > 0) {
      // args.row.style.background= 'red';
      // args.row.style.color= 'white';
      args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
      args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
    }
  }


  public dataBound(args): void {
    if (this.selIndex.length) {
      this.grid.selectRows(this.selIndex);
      this.selIndex = [];
    }
  }

  ////////////event for show Error/////////////////////////////////////////
  startDateauth: any;
  endDateauth: any;
  showerrors(args) {
    this.isEnabled = false;
    this.showerrolist = [];
    this.showerrolistfilter = [];
    var grid = (parentsUntil(args.target, 'e-grid') as any);

    this.result3 = grid.ej2_instances[0].getRowInfo(args.target).rowData;
    this.startDateauth = this.result3.fromDate;
    this.endDateauth = this.result3.toDate;


    let serialno = this.result3.serialNo
    this.errorlist.forEach(element => {
      if (element.serialno == serialno) {

        this.showerrolist.push(element);
        JSON.parse(JSON.stringify(this.showerrolistfilter.push(element)));

      }
    });
    this.showerrolist.forEach(element => {
      this.clientauthId = element.clientauthId;
    });


    // this.dialogService.open(showerror);
  }
  // --------------------------------------date changing event for start and end date-----------------------------
  onDateChanged(event: IMyDateModel) {
    this.fromdate = event.formatted;

  }
  datechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.fromdate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);

    }
  }
  onDateChangedend(event: IMyDateModel) {
    this.todate = event.formatted;

  }
  datechangend(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.todate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);

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
      if (args.data[args.column.field] != null) {
        const tooltip: Tooltip = new Tooltip({
          content: args.data[args.column.field].toString()
        }, args.cell as HTMLTableCellElement);
      }
    }
  }

  dataEmitFromCertificate(event) {

    event.clientId = this.global.clientId;
    this.Editcert = event.isEdit;
    this.EditCertificateoption = event;
    document.getElementById("OpenModal1").click();
    document.getElementById("OpenModal2").click()
    this.gettimesheetdata();

  }

  EventfromSOCEdit(event: EditSOCDetails) {
    this.EditSOC = event.isEdit;
    this.EditSOCOptions = event;
    document.getElementById("OpenModal1").click();
    document.getElementById("OpenModal2").click()
    this.gettimesheetdata();

  }
  dataEmitpayfromChild(event: IsViewEditpayorequired) {
    this.payoRequiredViewEdit.isEdit = false;
    this.payoRequiredViewEdit.isView = true;

    this.enablepayrate = false;
    document.getElementById("OpenModal1").click();
    document.getElementById("OpenModal2").click()
    this.gettimesheetdata();
  }
  closeerromodal() {

    this.ErrModalemployee.forEach(element => {
      element.columnName_i = "";
    });
    this.ErrModalCompany.forEach(element => {
      element.columnName_i = "";
    });
    this.ErrModalClient.forEach(element => {
      element.columnName_i = "";
    });

    this.ErrModalGrouppayor.forEach(element => {
      element.columnName_i = "";
    });
    this.ErrModalGrouppayorService.forEach(element => {
      element.columnName_i = "";
      element.grouplid = "";
      element.columnName_payor = "";
      element.columnName_service = "";
    });
    this.ErrModalIcd10.forEach(element => {
      element.columnName_i = "";
    });
    this.ErrModalclientAuth.forEach(element => {
      element.columnName_i = "";
    });
    this.ErrModalCompany = [];
    this.ErrModalClient = [];
    this.ErrModalGrouppayor = [];
    this.ErrModalGrouppayorService = [];
    this.ErrModalIcd10 = [];
    this.ErrModalclientAuth = [];
    this.ErrModalemployee = [];
    console.log(this.ErrModalemployee, "error");

  }


  onResize(args) {

    const column = this.grid.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.grid.refreshHeader();
    this.ColumnArray.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });

    this.SaveColumnwidth();
  }
  // ==============================================================================

  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {

this.global.globalColumn=data;
      this.arraycol = JSON.parse(data.column);
      this.ColumnArray = JSON.parse(data.column)[0].TimesheetVerification.Columns;
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].TimesheetVerification.Pagesize
      // this.ColumnArray = JSON.parse(data.column)[0].TimesheetVerification;

      //  this.grid.refreshColumns();

      let showcol = JSON.parse(data.column)[0].TimesheetVerification.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].TimesheetVerification.HideColumns;
      this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      // });


      this.ColumnArray.forEach(element => {



        if (element.column == 'Client') {

          const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();


        }
        if (element.column == 'Insured ID') {

          const column1 = this.grid.getColumnByField('insuredId'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Payer') {

          const column1 = this.grid.getColumnByField('payer'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'From Date') {

          const column1 = this.grid.getColumnByField('fromDate'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'To Date') {

          const column1 = this.grid.getColumnByField('toDate'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Total Hours') {

          const column1 = this.grid.getColumnByField('totalHours'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Employee') {

          const column1 = this.grid.getColumnByField('employee'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'UMPI') {

          const column1 = this.grid.getColumnByField('employeeUMPI'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Billed Amt.') {

          const column1 = this.grid.getColumnByField('totalAmountBIlled'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Payor ID') {

          const column1 = this.grid.getColumnByField('payorID'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Claim Status') {

          const column1 = this.grid.getColumnByField('claimStatus'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'Service') {

          const column1 = this.grid.getColumnByField('service'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Validate') {

          const column1 = this.grid.getColumnByField('validate'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == '') {

          const column1 = this.grid.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

      });

      // this.ColumnArray = data;
      // this.initialPage.totalRecordsCount = data;
      // = data;
    });
  }
  SaveColumnwidth() {
    this.arraycol[0].TimesheetVerification.Columns = this.ColumnArray;

    this.arraycol[0].TimesheetVerification.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {


      this.getColumnwidth();
      // data.forEach(element => {


      // });
      // this.ColumnArray = data;
      // this.initialPage.totalRecordsCount = data;
      // = data;
    });
  }
  valuechange() {
    //  debugger;
  }
}
