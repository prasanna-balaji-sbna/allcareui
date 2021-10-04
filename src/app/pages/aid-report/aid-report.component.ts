import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DateService } from 'src/app/date.service';
import { filters, ClientAidReportBO, getaid } from './aid-report-modal';
import { AidReportService } from './aid-report.service';
import { GlobalComponent } from 'src/app/global/global.component';
import { IMyDpOptions } from 'mydatepicker';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, SearchSettingsModel, ToolbarItems, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { Gethttp } from './getaid.service'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
@Component({
  selector: 'app-aid-report',
  templateUrl: './aid-report.component.html',
  styleUrls: ['./aid-report.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AidReportComponent implements OnInit {
  //================================== declate variable==========================================================//
  filters: filters = new filters();
  StatusLst: [{ label: string, value: string }]
  complete: boolean = false;
  clidropdown: any = []
 
  aidvaluechange: boolean = false;
  isCliInfo: boolean = false;
  clientinfodetails: any = []
  SelectedStatus: string;
  isEmp: boolean = false;
  aidReport: any = new ClientAidReportBO();
  isView: boolean = false;
  isApproved: boolean = false;
  SubmissionList: any = [];
  checkList: any = []
  serviceList: any = []
  todo: any = []
  RPList: any = []
  RPdetailList: any = []
  PCAlst: any = []
  QpLst: any = []
  checklistjson:any=[]
  Err: string = ""
  statusname: string = "Pending"
  getaid: getaid = new getaid()

  showstatus:string="false";

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  //===============================Date picker Intialization==================================================//
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  //===============================Ejs Grid Variable Intialization========================================================//
  @ViewChild('grid') public grid: GridComponent;
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  public submissiondrop: string[];
  public height = '220px';
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  filterOptions: FilterSettingsModel
  initialPage: object
  filter: IFilter;
  public formatOptions: object;
  //=======================================================================================//
  constructor(public dateservice: DateService, public Aidservice: AidReportService, public global: GlobalComponent, public toastrService: ToastrService,
    @Inject(Gethttp) public GetaidReports: Gethttp, public DatePipe: DatePipe, public router: Router, private ref: ChangeDetectorRef) {
    //   ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);


    this.data = GetaidReports

  }

  ngOnInit() {
    this.toolbar = ['ColumnChooser'];
    if (this.global.globalAgencyId) {


      this.getaidstatus()
      this.getClient()
      this.getsumission()
      this.getChecklist()
      this.getservice()
    }
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.filterOptions = { type: 'Menu' };

    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
  }
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
  }

  //=============================Date picker Event=============================================================//
  newdates(event, type, name) {

    if (type == "inputchage") {
      if (name == "start") {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.start = val1;

        }
      }
      if (name == "end") {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.filters.end = val1;
        }
      }
      if (name == "review") {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.aidReport.reviewDate = val1;
          this.aidvaluechangefunction()
        }
      }
      if (name == "report") {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.aidReport.reportDate = val1;
          this.aidvaluechangefunction()
        }
      }

    }
    if (type == "datechagned") {

      if (name == "start") {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.start = val1;

        }
      }
      if (name == "end") {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.filters.end = val1;
        }
      }
      if (name == "review") {
      //  console.log(event)
        let val = this.dateservice.Datechange(event);

        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);

          this.aidReport.reviewDate = val1;
          this.aidvaluechangefunction()
        }
      }
      if (name == "report") {

        let val = this.dateservice.Datechange(event);

        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);

          this.aidReport.reportDate = val1;
          this.aidvaluechangefunction()
        }
      }
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
    console.log(f);

   
  }
  //============================open new aid=================================================================//
  newaid() {
    this.isView = true;
    this.aidReport = new ClientAidReportBO();
    this.todo = [];
    this.checkList=this.checklistjson
    this.isCliInfo = false;
    this.isEmp = false;
    this.isApproved = false;
    this.aidvaluechange=false;
  }
  //===========================get Aid Report Status=========================================================//
  getaidstatus() {
    let param = new URLSearchParams();
    param.append("Code", "CLIENTAIDREPORTSTATUS");
    this.Aidservice.getstutus(param).subscribe((data: [{ label: string, value: string }]) => {
      this.StatusLst = data;
      this.SelectedStatus = this.StatusLst.filter(s => s.label == "Pending")[0].value
      this.statusname = this.StatusLst.filter(s => s.value == this.SelectedStatus.toString())[0].label
      this.aidfilters()
    })

  }
  //=========================get Client ==================================================================//
  getClient() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.Aidservice.getclient(params).subscribe((data: any) => {

      data.forEach(element => { element.id = element.id.toString() })

      this.clidropdown = data
    })
  }
  //================================get Submision type======================================================//
  getsumission() {
    let param = new URLSearchParams();
    param.append("Code", "CLIENTAIDREPORTSUBMISSIONTYPE");

    this.Aidservice.getsubmissionType(param).subscribe((data: any) => {

      data.forEach(element => { element.value = element.value.toString() })

      this.SubmissionList = data
      this.submissiondrop = this.SubmissionList.map(s => s.label);
    })
  }
  //===============================get check List=========================================================//
  getChecklist() {

    let param = new URLSearchParams();
    param.append("Code", "CLIENTAIDREPORTCHECKLIST");
    this.Aidservice.getcheckListdata(param).subscribe((data: any) => {
    //  console.log(data);
      
      this.checkList = data;
      this.checkList.forEach(element => {
        element.name = element.label;
        element.isCheckValue = false;
        element.checkListLid = parseInt(element.value)
      });
      this.checklistjson=JSON.parse(JSON.stringify(this.checkList))
    });
  }
  //===============================get Service========================================================//
  getservice() {

    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.Aidservice.getserviceListdata(param).subscribe((data: any) => {




      this.serviceList = data;



      this.serviceList.forEach(element => {
        element.label = element.name;
        element.check = false;
        element.value = (element.id).toString();
      });

    });
  }
  //===============================save service command========================================================//
  savecomment(event, i) {

    let val = event.target.innerHTML;

    this.todo[i].comment = val;

  }
  //===============================service change========================================================//
  servicechange() {
  //  console.log(this.todo.length);
 //   console.log(this.aidReport.servicelists);
    if (this.aidReport.servicelists != null) {

      let param = new URLSearchParams();
      param.append("ServiceId", this.aidReport.servicelists);
      this.Aidservice.getActivityList(param).subscribe((data: any) => {
        this.todo = [];
  //      console.log(data);


        let temp = data;

        temp.forEach(element => {
          let temp1 = { masterServiceActivityId: element.Key, activity: element.Value, comment: null, isCheckSatisfaction: false }
          this.todo.push(temp1);

        });
    //    console.log(this.todo);
   //     console.log(this.aidReport.serviceactivity);
        if (this.aidReport.serviceactivity != undefined) {
          if (this.aidReport.serviceactivity.length != 0) {
            this.todo = this.aidReport.serviceactivity;
            this.aidReport.serviceactivity = []
          }

        }
//        console.log(this.todo);
      });
    }
  }
  //===============================get Responsipe party number========================================================//
  getRP(clientid) {

    let param = new URLSearchParams();
    param.append("clientId", clientid);
    this.Aidservice.getRPlst(param).subscribe((data: any) => {

      if (data.length != 0) {

        this.RPList = [];

        let temp = data;
        this.RPdetailList = data
      //  console.log(data);

        if (data.id != 0 && data.responsiblePartyName != null) {
          let temp1 = { label: data.responsiblePartyName, value: (data.id).toString() }
    //      console.log(temp1);
          this.RPList.push(temp1);
        }

  //      console.log(this.RPList);



      }
      else {
        this.RPList = []
      }
     // console.log(this.RPList)
    });
  }
  //===============================Enable client Details========================================================//
  enableCLi() {

    let clientdetails = this.clidropdown.filter(s => s.id == this.aidReport.clientId);
    //console.log(clientdetails)
    this.clientinfodetails.dob = clientdetails[0].dob;
    this.clientinfodetails.medicaid = clientdetails[0].medicaid;
    this.isCliInfo = true;

    let agency = clientdetails[0].agencyId;



    this.getRP(this.aidReport.clientId);
    this.getEmployee(agency)
  }
  //===============================Get Employee========================================================//
  getEmployee(agent) {


    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    this.Aidservice.getEmp(param).subscribe((data: any) => {
     


      if (data.length != 0) {
        this.PCAlst = [];
        this.QpLst = [];
        data.forEach(element => {

          if (element.employeeType == "QPEMPLOYEE") {

            let temp = { label: element.firstName, value: (element.id).toString() }
            this.QpLst.push(temp);

          }
          if (element.employeeType == "PCAEMPLOYEE") {
            let temp1 = { label: element.firstName, value: (element.id).toString() }
            this.PCAlst.push(temp1);
          }
        });

console.log( this.QpLst);
 console.log(this.PCAlst);
      }

    })

  }
  //===============================Save Aid Report========================================================//
  save(reportstatus, value) {
   // console.log(value)
    let saveData = JSON.parse(JSON.stringify(value));
    saveData.reportStatusLid = this.StatusLst.filter(s => s.label == reportstatus)[0].value;

    saveData.checkList = this.checkList;

    saveData.serviceactivity = this.todo;


    if (saveData.id == undefined) {
      saveData.id = 0;
    }


   // console.log(saveData)

    saveData.clientId = parseInt(saveData.clientId);
      saveData.responsiblePartyNameContactId = saveData.responsiblePartyNameContactId != null ? parseInt(saveData.responsiblePartyNameContactId) : null;
      saveData.pcaEmployeeId = saveData.pcaEmployeeId != null ? parseInt(saveData.pcaEmployeeId.toString()) : null;
      saveData.qpEmployeeId = saveData.qpEmployeeId != null ? parseInt(saveData.qpEmployeeId.toString()) : null;
      saveData.reviewDate = saveData.reviewDate != null ? new Date(new Date(saveData.reviewDate).toDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null;
      saveData.reportDate = saveData.reportDate != null ? new Date(new Date(saveData.reportDate).toDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null;
      saveData.reviewStartTime = saveData.reviewStartTime != null ? new Date(new Date(saveData.reviewDate).toLocaleDateString() + " " + saveData.reviewStartTime + " " + "GMT").toISOString() : null;
      saveData.reviewEndTime = saveData.reviewEndTime != null ? new Date(new Date(saveData.reviewDate).toLocaleDateString() + " " + saveData.reviewEndTime + " " + "GMT").toISOString() : null;

      saveData.submissionTypeLid = saveData.submissionTypeLid != null ? parseInt(saveData.submissionTypeLid) : null;

      saveData.masterServiceId = saveData.servicelists != null ? parseInt(saveData.servicelists) : null;

      saveData.reportStatusLid = saveData.reportStatusLid != null ? parseInt(saveData.reportStatusLid) : null;


      console.log(saveData);
    let url = "api/ClientAidReport/SaveProcess"
    this.Aidservice.savereport(saveData).subscribe((data: any) => {


      this.aidvaluechange = false;
      if (reportstatus == "Pending") {
        this.showstatus="false";
        this.toastrService.success(
          'Report has been created successfully',
          'Aide Report',
        ), 5000;
        this.complete = true;
      }
      if (reportstatus == "Completed") {
        this.showstatus="true";
        this.toastrService.success(
          'Report has been Completed successfully',
          'Aide Report',
        ), 5000;
        this.complete = false;
        this.isView = false;
      }
      this.aidfilters()

    }, (err: HttpErrorResponse) => {


    }
    )


  }
  //===============================Aid Report filter change========================================================//
  aidfilters() {

    if ((this.filters.start == undefined || this.filters.start == "") &&
      (this.filters.end != undefined && this.filters.end != "") ||
      ((this.filters.end == undefined || this.filters.end == "") && (this.filters.start != undefined && this.filters.start != ""))) {

      this.Err = "select start and end date ";

      setTimeout(() => {

        this.Err = " ";
      }, 3000);
      return;
    }
    if (new Date(this.filters.start).getTime() > new Date(this.filters.end).getTime()) {
      this.Err = "End date should be grater than Start date ";

      setTimeout(() => {

        this.Err = " ";
      }, 3000);
      return;
    }
    if(this.filters.client==undefined)
    {
      this.getaid.client=0
    }
    else
    {
      this.getaid.client=parseInt(JSON.parse(JSON.stringify(this.filters.client)).toString())
    }
 //   console.log(this.SelectedStatus)
    this.statusname = this.StatusLst.filter(s => s.value == this.SelectedStatus.toString())[0].label
 //   console.log(this.statusname)
    if (this.statusname == "Completed") {
  //    this.showstatus="true";
      this.getaid.currentpage = 1;
      this.getaid.pageitems = 20;

      this.getaidreport()
      this.isApproved = true;
    }

    if (this.statusname == "Pending") {
   //   this.showstatus="false";
    //  this.getaid.client = this.filters.client != null ? parseInt(this.filters.client.toString()) : null
      this.getaid.currentpage = 1;
      this.getaid.pageitems = 20;
      this.getaidreport()
      this.isApproved = false;
    }
  //  this.statusname = this.StatusLst.filter(s => s.value == this.SelectedStatus.toString())[0].label
  console.log(this.statusname)
    // if(this.statusname=="Pending")
    // {
    //   this.grid.hideColumns(['Completed On','Completed By']);
    // }
    // else
    // {
    //   this.grid.showColumns(['Completed On','Completed By']);
    // }
  }
  //===============================get Aid Report ========================================================//
  getaidreport() {
    this.getaid.status = parseInt(this.SelectedStatus.toString())
   // console.log(this.filters.start)
 //   console.log(this.filters.end)
    this.getaid.agencyId = parseInt(this.global.globalAgencyId)
  //  this.getaid.client=parseInt(this.filters.client.toString());
    this.getaid.start = this.filters.start != null ? new Date(new Date(this.filters.start).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null
    this.getaid.end = this.filters.end != null ? new Date(new Date(this.filters.end).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString() : null
    let val = this.GetaidReports.execute(this.getaid)
    let count=0;
    this.data.subscribe((data:any) => {
      count=count+1;
      console.log(this.statusname);
      
      if(data!=null&&data!=undefined && count ==1)
      {
        this.getColumnwidth();
      }
    if (this.statusname == "Pending") {
      
      this.showstatus="false";
        
         }
         else{
          this.showstatus="true";
         }
    
    })

  }
  //===============================Edit Aid Report ========================================================//
  showAidData(id) {

    this.getvalue(id)
    this.complete = true;
  }
  //====================================Enable Employee ===================================================//
  enableEmp() {
    this.isEmp = true;

  }
  //===================================get Aid Report By Id====================================================//
  getvalue(id) {


    let param = new URLSearchParams();
    param.append("id", id);
    this.Aidservice.getAidReportById(param).subscribe((data: any) => {
      console.log(data);
      if (data.responsiblePartyNameContactId != null && data.responsiblePartyNameContactId != 0 && data.responsiblePartyNameContactId != "" && data.responsiblePartyNameContactId != undefined) {

        this.enableEmp();
      }
      this.getRP(data.clientId);
      this.aidReport = data;
      this.aidReport.serviceactivity = data.serviceactivity;
      this.todo = data.serviceactivity;
 //     console.log(this.todo);
      this.enableCLi();


    //  console.log(this.aidReport.submissionTypeLid);
    //  console.log(data.submissionTypeLid);

      this.aidReport.responsiblePartyNameContactId = data.responsiblePartyNameContactId != null ? data.responsiblePartyNameContactId.toString() : null;
      this.aidReport.submissionTypeLid = data.submissionTypeLid != null ? data.submissionTypeLid.toString() : null;

      this.aidReport.reviewDate = this.aidReport.reviewDate != null ? new Date(this.aidReport.reviewDate).toLocaleDateString() : null;


      this.aidReport.reportDate = this.aidReport.reportDate != null ? new Date(this.aidReport.reportDate).toLocaleDateString() : null;


      this.aidReport.reviewStartTime = this.aidReport.reviewStartTime != null ? this.DatePipe.transform(this.aidReport.reviewStartTime, 'HH:mm') : null;



      this.aidReport.reviewEndTime = this.aidReport.reviewEndTime != null ? this.DatePipe.transform(this.aidReport.reviewEndTime, 'HH:mm') : null;


      this.aidReport.clientId = data.clientId != null ? data.clientId.toString() : null;
      this.aidReport.pcaEmployeeId = data.pcaEmployeeId != null ? data.pcaEmployeeId.toString() : null;
      this.aidReport.qpEmployeeId = data.qpEmployeeId != null ? data.qpEmployeeId.toString() : null;
      this.aidReport.servicelists = data.masterServiceId != null ? data.masterServiceId.toString() : null;
      this.checkList = data.checkList;
      console.log(this.aidReport);
      
      this.servicechange();
      this.isView = true;
      this.aidvaluechange = false;
    })
  }
  //====================================Monitor Aid form value change===================================================//
  aidvaluechangefunction() {
    this.aidvaluechange = true;
   // console.log(this.aidvaluechange);
  }
  //============================== Ejs Grid Data state change Event=========================================================//
  public dataStateChange(state): void {
   
    let type = (state.action.requestType).toString();
    if (type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getaid.orderColumn = state.sorted[0].name;
        this.getaid.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
      }
    }
    if (type == "filtering" && state.action.action != "clearFilter") {
      if (state.action.currentFilterObject.field == "submissiontyepe") {

        this.getaid.value = this.SubmissionList.filter(e => e.label == state.action.currentFilterObject.value)[0].value.toString()
        this.getaid.field = "submissiontyepe";

        this.getaid.type = "number";
      }
      else if (this.getaid.type == "number") {


        this.getaid.value = state.action.currentFilterObject.value.toString();
        this.getaid.field = state.action.currentFilterObject.field;


      }
      else if (this.getaid.type == "date") {
      //  console.log(state.action.currentFilterObject.value)
        this.getaid.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.getaid.field = state.action.currentFilterObject.field;
      }
      else {
        this.getaid.value = state.action.currentFilterObject.value;
        this.getaid.field = state.action.currentFilterObject.field;
      }




      this.getaid.matchCase = state.action.currentFilterObject.matchCase;
      this.getaid.operator = state.action.currentFilterObject.operator;

    }
    else {
      if (type == "filtering" && state.action.action == "clearFilter") {
        this.getaid.field = "clientName";
        this.getaid.matchCase = false;
        this.getaid.operator = "startswith";
        this.getaid.value = "";
        this.getaid.type = "string"
      }
    }
    if (type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Aidreport.Pagesize!=state.take)
        {
          this.arraycol[0].Aidreport.Pagesize = state.take
          this.SaveColumnwidth();
        // }

      }
    
    }
    }
    this.aidfilters();
  }
  //=======================================Ejs Grid Action Evnet================================================//
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
  this.arraycol[0].Aidreport.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Aidreport.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });
  console.log(count, count1, "count");


  if (this.arraycol[0].Aidreport.ShowColumns.length != count1 || this.arraycol[0].Aidreport.HideColumns.length != count) {
    this.arraycol[0].Aidreport.ShowColumns = showarr;
    this.arraycol[0].Aidreport.HideColumns = hidearr;
    this.SaveColumnwidth();
  }

}
     
      }
    }


   // console.log(args)
   // console.log(this.grid)
  //  console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getaid.currentpage = this.grid.pagerModule.pagerObj.currentPage;
    this.getaid.pageitems = this.grid.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getaid.type = args.columnType
 //     console.log(this.getaid)
    }
 //   console.log(this.getaid)
 //   console.log(this.grid)

  }
  //======================================Refresh function=================================================//
  Refresh() {
    this.getaid = new getaid();
    this.filters = new filters();
    this.SelectedStatus = this.StatusLst.filter(s => s.label == "Pending")[0].value
    this.statusname = this.StatusLst.filter(s => s.value == this.SelectedStatus)[0].label
   // console.log(this.SelectedStatus)
   // console.log(this.filters)
    this.aidfilters();

  }
  //====================================Back to client===================================================//
  back() {
    this.router.navigateByUrl("/client-parent");
  }
  //================================close Aid Report Form=======================================================//
  close() {
    this.isView = false;
    this.isApproved = false;
    this.complete = false;
    this.aidfilters()
    this.aidvaluechange=false;
  }
  //=============================open Close Alert ==========================================================//
  closealert() {
    if (this.aidvaluechange == true) {
      document.getElementById("cancelmodal").click()
    }
    else {
      this.close()
    }
  }
  //=============================== open Complete Alert========================================================//
  completealert() {
    if (this.aidvaluechange == true) {
      document.getElementById("completealert").click()
    }
    else {
      this.save('Completed', this.aidReport)
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
 if(args.column.field!=null)
 {
  if(args.data[args.column.field]!=null)
  {
   const tooltip: Tooltip = new Tooltip({
     content: args.data[args.column.field].toString(),
     position:'RightCenter',
     

 }, args.cell as HTMLTableCellElement);
 }
}
}


  // ==============================================================================

  getColumnwidth() {
    this.Aidservice.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Aidreport.Columns;

      let showcol = JSON.parse(data.column)[0].Aidreport.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Aidreport.HideColumns
    

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
    
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Aidreport.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Client Name') {

          const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'RP Name') {

          const column1 = this.grid.getColumnByField('resopnsiplePartyName'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'PCA Name') {

          const column1 = this.grid.getColumnByField('pcaEmployee'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'QP Name') {

          const column1 = this.grid.getColumnByField('qpEmployee'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Submission Type') {

          const column1 = this.grid.getColumnByField('submissiontyepe'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'Reported By') {

          const column1 = this.grid.getColumnByField('reportedBy'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Completed By') {

          const column1 = this.grid.getColumnByField('completedBy'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Completed On') {

          const column1 = this.grid.getColumnByField('modifiedDate'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Reported On') {

          const column1 = this.grid.getColumnByField('createdDate'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        else if (element.column == 'Actions') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });

  }
  SaveColumnwidth() {
    this.arraycol[0].Aidreport.Columns = this.ColumnArray;
    this.arraycol[0].Aidreport.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.Aidservice.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
