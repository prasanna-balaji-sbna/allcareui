import { Component, OnInit, ChangeDetectionStrategy,Inject, ViewChild, ChangeDetectorRef } from '@angular/core';;
import { IMyDpOptions } from 'mydatepicker';
import { filters, gettimesheetBO, deletepermission } from './evv-timesheet.model';
import { DateService } from 'src/app/date.service';
import { GlobalComponent } from 'src/app/global/global.component';
import { EvvTimesheetService } from './evv-timesheet.service';
import { EvvTimesheetdataService } from './evv-timesheetdata.service';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, Column, QueryCellInfoEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';;
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup ,Validators, FormControl } from '@angular/forms';
import { ColumnChangeBO, columnWidth } from '../list/list.model';

@Component({
  selector: 'app-evv-timesheet',
  templateUrl: './evv-timesheet.component.html',
  styleUrls: ['./evv-timesheet.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvvTimesheetComponent implements OnInit {
  filters: filters = new filters();
  EmployeeDropDown: any
  ClinetDropDown: any;
  PayorDropDown: any;
  public serviceList: any = [];
  public dropdatas: string[] = ['Yes', 'No']
  public height = '220px';
  loading: boolean = false;
  valuechange:boolean=false;
  reason:string="";
  width: string;
  deleteList: deletepermission = new deletepermission();
  passerror: boolean = false;
  @ViewChild('grid') public grid: GridComponent;
  timesheetsendBO: gettimesheetBO = new gettimesheetBO();
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  initialPage: object;
  public toolbar: ToolbarItems[];
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  public formatOptions: object;
  filterOptions: FilterSettingsModel;
  timeformatoption: object;
  editEmployee: string = null;
  editClient: string = null;
  editDate: string = "";
  editservice: number = null;
  edittime: string = "";
  editNotes: string = "";
  editstart: string = "";
  saveErr:string="";
  editend: string = ""
  saveEvvErr: string = "";
  edittimesheetid:number=0;
  startmin:string="";
  endmin:string="";
  showerrolist:any=[];
  resetPass: FormGroup;

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]

  constructor(public dateservice: DateService, public global: GlobalComponent, public http: EvvTimesheetService,
    @Inject(EvvTimesheetdataService) public evvtimesheet: EvvTimesheetdataService,  public httpService: EvvTimesheetService, public toastrService: ToastrService,
     private datepipe: DatePipe,public ngxService:NgxUiLoaderService, private ref: ChangeDetectorRef) {

      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
     
      this.resetPass = new FormGroup({
        Password: new FormControl('', [Validators.required])
      });
    this.data = this.evvtimesheet
  }
  
  

  ngOnInit(): void {
    this.getClient();
    this.getEmployeeDropDown();
    this.getService();
    this.filters.filterStartDate = new Date().toLocaleDateString();
    this.filters.filterEndDate = new Date().toLocaleDateString();
    this.filterfunction();
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.timeformatoption = { type: 'time', format: 'H:m:s' };
    this.toolbar = ['ColumnChooser'];
    this.filterOptions = { type: 'Menu' };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    this.width = 'auto';
    // this.getColumnwidth();  
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };


  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
  }

  //============================Date time =============================================//
  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'filterstart') {
        //console.log("event.value", event);
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.filterStartDate = val1;
          //console.log('this.filters.filterStartDate', this.filters.filterStartDate);
        }
      }
      if (name == 'filterend') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.filterEndDate = val1;
        }
      }

    }
    if (type == "datechagned") {
      if (name == 'filterstart') {

        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.filterStartDate = val1;
          //console.log('this.filters.filterStartDate', this.filters.filterStartDate);
        }
      }
      if (name == 'filterend') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.filterEndDate = val1;
        }
      }

    }
  }

  getClient() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.http.getClient(params).subscribe((data: any) => {
      this.ClinetDropDown = data;
      this.ClinetDropDown.forEach(element => {
        element.id = element.id.toString();
      })
    });
  }

  getEmployeeDropDown() {
    let params = new URLSearchParams();
    //console.log(empType);
    params.append("AgencyId", this.global.globalAgencyId);
    // params.append("employeeId",empType);
    this.http.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeDropDown = data;
      this.EmployeeDropDown.forEach(element => {
        element.Key = element.Key.toString();

      })
    });

  }

  getService() {

    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId)
    this.http.getservice(params).subscribe((data: any) => {

      data.forEach(element => {

        element.Key = element.Key.toString()

      });
      this.serviceList = data;

    });
  }
  filterfunction() {
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
    this.timesheetsendBO.agencyId = parseInt(this.global.globalAgencyId)
    this.timesheetsendBO.client = this.filters.filterClient!=null?parseInt(this.filters.filterClient.toString()):null;
    this.timesheetsendBO.employee = this.filters.filterEmployee!=null?parseInt( this.filters.filterEmployee.toString()):null;
    this.timesheetsendBO.start = this.filters.filterStartDate != null ? new Date(new Date(this.filters.filterStartDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null
    this.timesheetsendBO.end = this.filters.filterEndDate != null ? new Date(new Date(this.filters.filterEndDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null
    this.timesheetsendBO.service = this.filters.filtermasterservice!=null?parseInt(this.filters.filtermasterservice.toString()):null;
    this.getdata();
  }

  getdata() {
    this.ngxService.start()
    this.evvtimesheet.execute(this.timesheetsendBO)
    let count=0;
    this.data.subscribe(data => { 
      count=count+1;
      if(data!=null&& data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
    }

    )
    //console.log("EmployeeList", this.data);
  }
  Refresh() {
    this.filters = new filters();
    this.filters.filterStartDate = new Date().toLocaleDateString();
    this.filters.filterEndDate = new Date().toLocaleDateString();
    this.timesheetsendBO = new gettimesheetBO();
    this.filterfunction();
  }
  //===================================Action Complete===================================//

  public onActionComplete(args) {

    //console.log("args", args);
    //console.log("args", args.columns);
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
      this.arraycol[0].EVV_Timesheet.ShowColumns.forEach(old => {
        showarr.forEach(element => {
          if (old == element) {
            count1 = count1 + 1;
          }
        });
    
      });
    
      this.arraycol[0].EVV_Timesheet.HideColumns.forEach(old => {
        hidearr.forEach(element => {
          if (old == element) {
            count = count + 1;
          }
        });
    
      });
      console.log(count, count1, "count");
    
    
      if (this.arraycol[0].EVV_Timesheet.ShowColumns.length != count1 || this.arraycol[0].EVV_Timesheet.HideColumns.length != count) {
        this.arraycol[0].EVV_Timesheet.ShowColumns = showarr;
        this.arraycol[0].EVV_Timesheet.HideColumns = hidearr;
        this.SaveColumnwidth();
      }
    }
      
      }
    }
    if (args.requestType == "filterafteropen") {
      this.timesheetsendBO.type = args.columnType;
    }


  }

  //===================================data state===================================//
  public dataStateChange(state): void {
    let type: String = (state.action.requestType).toString();
    //console.log(state);
    //console.log(type);
    this.timesheetsendBO.currentpage = this.grid.pagerModule.pagerObj.currentPage;
    this.timesheetsendBO.pageitems = this.grid.pagerModule.pagerObj.pageSize;
    //  this.initialPage=


    if (state.action.requestType != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.timesheetsendBO.orderColumn = state.sorted[0].name;
        this.timesheetsendBO.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
        //console.log(this.timesheetsendBO);

      }
    }
    // if(state.action.requestType=="paging" )
    // {
    //   this.timesheetfilter();
    // }
    if (type == "filtering" && state.action.action != "clearFilter") {
      this.timesheetsendBO.currentpage = 1;
      this.timesheetsendBO.pageitems = 10;
      if (this.timesheetsendBO.type == "date") {

        this.timesheetsendBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        //console.log(this.timesheetsendBO.value)
      }
      else {
        this.timesheetsendBO.value = state.action.currentFilterObject.value
      }

      this.timesheetsendBO.field = state.action.currentFilterObject.field
      //console.log(this.timesheetsendBO)

      if (state.action.currentFilterObject.field == "isCliSignature") {

        this.timesheetsendBO.value = this.timesheetsendBO.value == 'Yes' ? 'true' : 'false';
        this.timesheetsendBO.type = "boolean"

      }
      if (state.action.currentFilterObject.field == "isEmpSignature") {

        this.timesheetsendBO.value = this.timesheetsendBO.value == 'Yes' ? 'true' : 'false';
        this.timesheetsendBO.type = "boolean"

      }
      if (state.action.currentFilterObject.field == "timesheetStatusLid") {

        this.timesheetsendBO.field = "timesheetStatus"
        this.timesheetsendBO.type = "string"

      }

    }
    if (state.action.requestType == "filtering" && state.action.action == "clearFilter") {
      this.timesheetsendBO.currentpage = 1;
      this.timesheetsendBO.pageitems = 10;
      this.timesheetsendBO.value = ""
      this.timesheetsendBO.field = "clientName"
      this.timesheetsendBO.orderColumn = "TimesheetDate"
      this.timesheetsendBO.orderType = 'ASC';
      //console.log(this.timesheetsendBO)

    }
    if (state.action.requestType != "refresh") {
      this.getdata();
    }

    if (state.action.requestType == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].EVV_Timesheet.Pagesize!=state.take)
        {
          this.arraycol[0].EVV_Timesheet.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
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
    if (args.column.field != null) {
      if(args.data[args.column.field]!=null)
      {
      const tooltip: Tooltip = new Tooltip({
        content: args.data[args.column.field].toString()
      }, args.cell as HTMLTableCellElement);
    }
  }
  }

  edittimesheet(data) {
    //console.log(data)
    this.edittimesheetid=data.scheduleId;
    this.editEmployee = data.ename;
    this.editClient = data.cname;
    this.editservice = data.service;
    this.edittime = data.totalHours;
    this.editNotes = data.notes;
    this.editstart = data.starttime;
    this.editend = data.endtime;
    this.editDate = this.datepipe.transform(data.scheduleDate, "MM/dd/yyy");
 //  this.startmin=this.datepipe.transform(new Date(new Date(this.editstart).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString(),"yyy-MM-ddTHH:mm:ss" );
   // console.log(this.startmin);
   // this.startmin=new Date(new Date(data.starttime).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString();

  // let start=  document.getElementById("editstarttime");
 //  start.setAttribute('min',this.datepipe.transform(new Date(new Date(this.editstart).toLocaleDateString()+" "+"00:00:00"+" "+"GMT"),"yyy-MM-ddTHH:mm:ss" ));
  // start.setAttribute('max',new Date(new Date(this.editstart).toLocaleDateString()+" "+"23:59:00"+" "+"GMT"));
  //  let end=  document.getElementById("editendtime");
  
  //  {
  //    end.setAttribute('min',new Date(new Date(this.editend).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString());
  //  end.setAttribute('max',new Date(new Date(this.editend).toLocaleDateString()+" "+"23:59:00"+" "+"GMT").toISOString());
  //  }
    
 
  }
  hourscal() {
  this.valuechange=true;

    if (this.editstart != null && this.editend!=null) {
      if (new Date(this.editstart).getTime() < new Date(this.editend).getTime()) {
        let start = new Date(this.editstart).getTime();
        let end = new Date(this.editend).getTime();
        let diff = end - start;

        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        if (minutes < 15) {
          minutes = 0
        }
        else if (minutes < 30) {
          minutes = 25
        }
        else if (minutes < 45) {
          minutes = 50
        }
        else {
          minutes = 75
        }
        this.edittime = hours + "." + minutes;

      }
      else {
        this.saveEvvErr = "end time should greater than start time"
        setTimeout(() => {
          this.saveEvvErr = ""
        }, 2000);
      }
    }
  }
  checkvalidation()
  {
    
    if (this.editstart == null || this.editend==null ||this.editend==""||this.editend=="") {
      this.saveEvvErr = "select start Date and End Date"
      setTimeout(() => {
        this.saveEvvErr = ""
      }, 2000);
      return
    }
    else{
      if (new Date(this.editstart).getTime() > new Date(this.editend).getTime()) {
        this.saveEvvErr = "end time should greater than start time"
        setTimeout(() => {
          this.saveEvvErr = ""
        }, 2000);
        return
      }
      if( this.valuechange && (this.reason==null||this.reason==""))
      {
        this.saveEvvErr = "Enter Reason for modify time"
        setTimeout(() => {
          this.saveEvvErr = ""
        }, 2000);
        return
      }
    }
    this.updateEvvTimesheet()
  }
  updateEvvTimesheet()
  {
      let val={
        id:this.edittimesheetid,
        start:new Date(this.editstart+"Z").toISOString(),
        end: new Date(this.editend+"Z").toISOString(),
        reason:this.reason,
        notes:this.editNotes
      }
      this.ngxService.start()
      this.http.update(val).subscribe((data:any)=>{
        this.valuechange=false;
        this.ngxService.stop()
        document.getElementById("update").click();
        this.filterfunction();
      },(err:HttpErrorResponse)=>{
        this.toastrService.error(
          err.error,
          "Update Error"
        );
        setTimeout(() => {
          this.toastrService.clear();
        }, 2000);
        this.ngxService.stop()
      })
  }

  validatebutton(args) {

    







 
    if (args.column.field == "validate") {

      ////console.log(args.column.field);
    
      //console.log(args.data['onhold']);
      if (args.data['onhold'] == true) {
        //console.log(args);
        //console.log( args.cell.firstElementChild.classList);
        args.cell.firstElementChild.classList.add('invalid')
      }
      if (args.data['onhold'] == false) {
        //console.log(args);
        //console.log( args.cell.firstElementChild.classList);
        args.cell.firstElementChild.classList.add('valid')
      }
    }

  }

  errorlst(data)
  {
    this.showerrolist=data.errorList
  }

  //===========================================passWord Validation=======================================================//
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

  deleteTimesheet() {
    this.loading = true;
    // let obj = { Admin_Password: this.deleteList.admin_Password }
    //console.log(this.deleteList)
    this.http.deleteTimesheetdata(this.deleteList).subscribe((data: any) => {
      this.deleteList = new deletepermission();
 
      this.filterfunction();
      this.passerror = false;
      this.toastrService.success(
        'Timesheet has been deleted successfully',
        'Timesheet deleted',
      ), 8000;

      document.getElementById("delete").click();
      this.filterfunction()
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
   //=============================cacel Delete=============================//
   CancelDelete() {
    this.deleteList = new deletepermission();
    this.passerror = false;
    this.resetPass.reset()
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
  
  
      this.ColumnArray = JSON.parse(data.column)[0].EVV_Timesheet.Columns;
  
  
    
  
      let showcol = JSON.parse(data.column)[0].EVV_Timesheet.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].EVV_Timesheet.HideColumns
  

 //   this.grid.showColumns(showcol);
    this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
  
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].EVV_Timesheet.Pagesize
  
      this.ColumnArray.forEach(element => {
  
  
  
        if (element.column == 'Client') {
  
          const column = this.grid.getColumnByField('cname'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;
  
          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Employee') {
  
          const column1 = this.grid.getColumnByField('ename'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Timesheet Date') {
  
          const column2 = this.grid.getColumnByField('scheduleDate'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Start Time') {
  
          const column3 = this.grid.getColumnByField('starttime'); // get the JSON object of the column corresponding to the field name
          column3.headerText = element.column;
          column3.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'End Time') {
  
          const column4 = this.grid.getColumnByField('endtime'); // get the JSON object of the column corresponding to the field name
          column4.headerText = element.column;
          column4.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Clent Signature') {
  
          const column5 = this.grid.getColumnByField('isCliSignature'); // get the JSON object of the column corresponding to the field name
          column5.headerText = element.column;
          column5.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Employee Signature') {
  
          const column6 = this.grid.getColumnByField('isEmpSignature'); // get the JSON object of the column corresponding to the field name
          column6.headerText = element.column;
          column6.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Total hours') {
  
          const column7 = this.grid.getColumnByField('totalHours'); // get the JSON object of the column corresponding to the field name
          column7.headerText = element.column;
          column7.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Service') {
  
          const column8 = this.grid.getColumnByField('service'); // get the JSON object of the column corresponding to the field name
          column8.headerText = element.column;
          column8.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Reason') {

          const column9 = this.grid.getColumnByField('notes'); // get the JSON object of the column corresponding to the field name
          column9.headerText = element.column;
          column9.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'ModifiedBy') {
  
          const column10= this.grid.getColumnByField('modifiedBy'); // get the JSON object of the column corresponding to the field name
          column10.headerText = element.column;
          column10.width = element.width;
  
          this.grid.refreshHeader();
        }
        
        if (element.column == 'Actions') {
  
          const column11 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column11.headerText = element.column;
          column11.width = element.width;
          this.grid.refreshHeader();
  
        }
        if (element.column == 'Validate ') {
  
          const column12 = this.grid.getColumnByField('validate'); // get the JSON object of the column corresponding to the field name
          column12.headerText = element.column;
          column12.width = element.width;
  
          this.grid.refreshHeader();
        }
      });
  
  
    });
  
  }
  SaveColumnwidth() {
   
    this.arraycol[0].EVV_Timesheet.Columns = this.ColumnArray;
    this.arraycol[0].EVV_Timesheet.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {
  
      this.getColumnwidth();
  
    });
  }
}
