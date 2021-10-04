import { Component, OnInit, ViewChild, Inject, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { LPRHTTPService } from './lockedpayroll.service';
import { PayrollreturnBO, getPayrollListBO, WhereCondition, updatePayDateBO } from './lockedpayroll.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './lockedpayroll-data.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { outputs } from '@syncfusion/ej2-angular-grids/src/grid/grid.component';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { formatDate, DatePipe } from '@angular/common';
import { DateService } from '../../date.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../list/list.model';


@Component({
  selector: 'app-lockedpayroll',
  templateUrl: './lockedpayroll.component.html',
  styleUrls: ['./lockedpayroll.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LockedpayrollComponent implements OnInit {

  SaveList: updatePayDateBO = new updatePayDateBO();
  PRSendBO: getPayrollListBO = new getPayrollListBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();

  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  initialPage: object;
  filterOptions: FilterSettingsModel;
  // grid: GridComponent
  public formatOptions: object;

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
  ///////////////================Column chooser=================////////
  filter: IFilter;
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false;
  // ===================================Other initialization===================//
  employeelists: any = [];
  statusList: any = [];
  clientlist: any = [];
  clientid: string = '';
  employee: string;
  status: string = "0";
  Client: string;
  fromDate: string;
  toDate: string;
  payrollDate: string;
  paydate1: string;
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  ///////////////////////////////Date Piker intialization////////////////////////////////////////////////////////////////
  public myDatePickerOptionsEFF: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1 },
    showClearDateBtn: false,
    editableDateField: true
  };

  constructor(public dateservice: DateService, private formBuilder: FormBuilder, @Inject(GetHTTPService) public gethttp: GetHTTPService,
    public global: GlobalComponent, public httpService: LPRHTTPService, private ref: ChangeDetectorRef,
    public toastrService: ToastrService, public general: generalservice) {
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data = gethttp;
  }
  type: string = "";
  public dataStateChange(state): void {


    console.log("Stats chage", state);
    this.type = (state.action.requestType).toString();
    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.PRSendBO.orderColumn = state.sorted[0].name;
        this.PRSendBO.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
      }
    }
    if (this.type == "filtering" && state.action.action != "clearFilter") {
      if (this.PRSendBO.type == "date") {

        this.PRSendBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
      } else {
        this.PRSendBO.value = state.action.currentFilterObject.value.toString();
      }
      this.PRSendBO.field = state.action.currentFilterObject.field;
      this.PRSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.PRSendBO.operator = state.action.currentFilterObject.operator;
      // this.PRSendBO.value=state.action.currentFilterObject.value:
    }
    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.PRSendBO.field = "EmployeeName";
        this.PRSendBO.matchCase = false;
        this.PRSendBO.operator = "startswith";
        this.PRSendBO.value = "";
        this.PRSendBO.type = "string";
      }
    }
    this.PRSendBO.agency = this.global.globalAgencyId;
    this.getPR();
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].LockedPayroll.Pagesize != state.take) {
          this.arraycol[0].LockedPayroll.Pagesize = state.take
          console.log("save page size")
          this.SaveColumnwidth();
          // }

        }

      }
    }

  }

  ngOnInit(): void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.getemployee();
    this.getstatus();
    this.getclient();
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.filterOptions = { type: 'Menu' };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    this.getColumnwidth();
  }

  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
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

      console.log(hidearr, "hidearr")
      console.log(showarr, "showarr");
      console.log(this.arraycol, "arraycol");

      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {
        if (this.arraycol.length > 0) {
          this.arraycol[0].LockedPayroll.ShowColumns.forEach(old => {
            showarr.forEach(element => {
              if (old == element) {
                count1 = count1 + 1;
              }
            });

          });

          this.arraycol[0].LockedPayroll.HideColumns.forEach(old => {
            hidearr.forEach(element => {
              if (old == element) {
                count = count + 1;
              }
            });

          });
          console.log(count, count1, "count");


          if (this.arraycol[0].LockedPayroll.ShowColumns.length != count1 || this.arraycol[0].LockedPayroll.HideColumns.length != count) {
            this.arraycol[0].LockedPayroll.ShowColumns = showarr;
            this.arraycol[0].LockedPayroll.HideColumns = hidearr;
            this.SaveColumnwidth();
          }
        }

      }
    }
    this.PRSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.PRSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type", this.conditionlist);
      });
    }
    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.PRSendBO.type = args.columnType
      console.log(this.PRSendBO)
    }
  }

  ApplyFilter() {
    this.PRSendBO.fromDate = new Date(new Date(this.fromDate).toDateString() + " " + "00:00:000" + " " + "GMT").toISOString();
    this.PRSendBO.toDate = new Date(new Date(this.toDate).toDateString() + " " + "00:00:000" + " " + "GMT").toISOString();
    this.PRSendBO.employeeId = Math.floor(Number(this.employee));
    this.PRSendBO.clientId = Math.floor(Number(this.Client));
    this.PRSendBO.paydateLid = Math.floor(Number(this.status));
    this.PRSendBO.pageitem = 10;
    this.PRSendBO.currentpageno = 1;
    this.data = this.gethttp;
    this.getPR();
  }

  Refresh() {
    this.fromDate = "";
    this.toDate = "";
    this.employee = "";
    this.Client = "";
    this.status = "0";
    this.PRSendBO.fromDate = "";
    this.PRSendBO.toDate = "";
    this.PRSendBO.employeeId = null;
    this.PRSendBO.clientId = null;
    this.PRSendBO.paydateLid = null;
    this.PRSendBO.pageitem = 10;
    this.PRSendBO.currentpageno = 1;
    this.data = null;
    // this.data: Observable<DataStateChangeEventArgs>;
    // this.ngOnInit();
  }

  getPR() {
    this.PRSendBO.agency = parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.PRSendBO);
    let count=0
    this.data.subscribe((data: any) => {
      count=count+1
      if (data != null && data != undefined && count==1) {
        this.getColumnwidth();
      }
    })
    console.log(" this.gethttp.", this.data);
  }

  getemployee() {
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getEmployeeList(param).subscribe((data: any) => {
      console.log("data emp", data);
      this.employeelists = data;
      this.employeelists.forEach(element => {
        element.label = element.Value,
          element.value = element.Key
      })
    })
  }

  getstatus() {
    let params = new URLSearchParams();
    params.append("Code", "PAYDATESTATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getClientList(params).subscribe((data: any) => {
      console.log("data sts", data);
      this.statusList = data;
      this.statusList.forEach(element => {
        element.label = element.dob;
        element.value = element.value;
      })
    })
  }

  getclient() {
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getClientList(param).subscribe((data: any) => {
      console.log("data client", data);
      data.forEach(element => {
        element.value = element.id.toString()
        this.clientid = element.value
        element.label = element.names
      });
      this.clientlist = data;
    })
  }

  ispayrolllocked: boolean = false;
  payrollLockId: any = 0;
  payrollISLocked: boolean = false;
  payrollPayDateId: string = "";

  paydateUpdate(data) {
    console.log("data from UI", data);
    this.SaveList.PayrollId = data.id.toString();
    setTimeout(() => {
      if (data.payDate != null && data.payDate != "") {
        this.SaveList.PayDate = new Date(data.payDate).toLocaleDateString()
      } else {
        this.SaveList.PayDate = "";
      }
    }, 400);
  }

  lockPayroll(data) {
    this.payrollLockId = data.id;
    if (data.islocked == true) {
      this.ispayrolllocked = true;
    } else {
      this.ispayrolllocked = false;
    }
  }

  lockPR() {
    this.httpService.Lock(Math.floor(Number(this.payrollLockId))).subscribe((data: any) => {
      // if(data){
      document.getElementById('openModal2').click();
      this.toastrService.success(
        'Pay roll has been Locked successfully',
        'Pay roll Locked'), 8000
      this.ispayrolllocked = false;
      this.payrollLockId = 0;
      this.getPR();
      // }
    }, (err: any) => {
      if (err) {
        console.log("err.error", err.error);
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }

  unlockPR() {
    this.httpService.Unlock(Math.floor(Number(this.payrollLockId))).subscribe((data: any) => {
      // if(data){
      document.getElementById('openModal2').click();
      this.toastrService.success(
        'Pay roll has been UnLocked successfully',
        'Pay roll UnLocked'), 8000
      this.ispayrolllocked = false;
      this.payrollLockId = 0;
      this.getPR();
      // }
    }, (err: any) => {
      if (err) {
        console.log("err.error", err.error);
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }

  updatePayDate() {
    this.SaveList.PayDate = new Date(new Date(this.SaveList.PayDate).toDateString() + " " + "00:00:000" + " " + "GMT").toISOString();
    console.log("this.SaveList", this.SaveList);
    this.httpService.saveupdate(this.SaveList).subscribe((data: any) => {
      if (data) {
        document.getElementById('openModal1').click();
        this.toastrService.success(
          'Pay date has been updated successfully',
          'Pay date updated'), 8000
        this.paydate1 = "";
        this.payrollDate = "";
        this.payrollPayDateId = "";
        this.getPR();
      }
    }, (err: any) => {
      if (err) {
        console.log("err.error", err.error);
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }

  newdates(event, name, refname) {

    if (name == "inputchage") {
      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
        if (refname == "start") {
          this.fromDate = val1;
        }
        if (refname == "end") {
          this.toDate = val1;
        }
        if (refname == "pay") {
          this.SaveList.PayDate = val1;
        }
      }
    }
    if (name == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        if (refname == "start") {
          this.fromDate = val1;
        }
        if (refname == "end") {
          this.toDate = val1;
        }
        if (refname == "pay") {
          this.SaveList.PayDate = val1;
        }
      }
    }
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


      this.ColumnArray = JSON.parse(data.column)[0].LockedPayroll.Columns;

      console.log(this.ColumnArray, "column change");


      //  this.grid.refreshColumns();

      let showcol = JSON.parse(data.column)[0].LockedPayroll.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].LockedPayroll.HideColumns


      //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].LockedPayroll.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Employee') {

          const column = this.grid.getColumnByField('employeeName'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Paid On') {

          const column1 = this.grid.getColumnByField('payDate'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Total Amt.') {

          const column2 = this.grid.getColumnByField('totalAmount'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Total hrs.') {

          const column3 = this.grid.getColumnByField('totalWorkedHrs'); // get the JSON object of the column corresponding to the field name
          column3.headerText = element.column;
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Lock Status') {

          const column4 = this.grid.getColumnByField('lockStatus'); // get the JSON object of the column corresponding to the field name
          column4.headerText = element.column;
          column4.width = element.width;

          this.grid.refreshHeader();
        }
        else if (element.column == 'Actions') {

          const column5 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column5.headerText = element.column;
          column5.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });

  }
  SaveColumnwidth() {

    this.arraycol[0].LockedPayroll.Columns = this.ColumnArray;
    this.arraycol[0].LockedPayroll.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }
}
