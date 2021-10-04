import { Component, OnInit, EventEmitter, Output, ViewChild, Inject, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Employee, employeeFilter, sortingObj, IsViewEdit, getEmployee, functionpermission } from '../emloyee.model';
import { GlobalComponent } from '../../../global/global.component';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, Column, QueryCellInfoEventArgs, } from '@syncfusion/ej2-angular-grids';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { EmployeeService } from '../employee.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DataUtil } from '@syncfusion/ej2-data';
import { generalservice } from 'src/app/services/general.service';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { Observable } from 'rxjs/Observable';
import { GetEmployeeservice } from '../employeedata.service'
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../icd10/icd10.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  // providers: [ToolbarService, ColumnChooserService]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit {



  ///////////////////////////////////////////search and search Option  variable///////////////////////////////////////////

  sorting = new sortingObj();
  employeeFilter = new employeeFilter();
  searchColumn: string = "Name";
  searchText: string = "";

  EmployeeListData: getEmployee = new getEmployee();
  //////////////////////////////////////////////Employee Data variable//////////////////////////////////////////////////////////
  fp: functionpermission = new functionpermission();
  EmployeeTotalCount: number;
  EmployeeList: Employee[];

  //////////////////////////////////////Drop down variable/////////////////////////////////////////////////////////////////////

  EmployeestatusList: [{ Key: number, Value: string }];
  EmployeeTypeList: [{ Key: number, Value: string }];

  //////////////////////////////////Table Intialize variable//////////////////////////////////////////////////////////////////////
  filterOptions: FilterSettingsModel;
  initialPage: object;
  filterSettings: object;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  type: string;
  //////////////////////////////////////////File variables/////////////////////////////////////////////////////////////////////
  selected: boolean = false;
  selectedFile = null;
  selectedFileName: string = "";
  ///////////////////////////////////////////FormatOptions/////////////////////////////////////
  public formatOptions: object;

  public formatPhoneNumber: object;
  /////////////////////////////////////////////view variable ///////////////////////////////////////////////////////////////////////
  @Output() isViewEdit = new EventEmitter<IsViewEdit>();
  isEdit: boolean = false;
  isView: boolean = false;
  isEditEmployee: boolean = false;

  ////////////////////////////////////////////////// obserable variable /////////////////////////////////////////////////////////
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  public dropdata: string[];
  public dropdata1: string[];
  public height = '220px';


  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO= new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(public global: GlobalComponent, public EmployeeService: EmployeeService, private datepipe: DatePipe, public toastrService: ToastrService,
    private ref: ChangeDetectorRef, public router: Router, public general: generalservice, @Inject(GetEmployeeservice) public EmployeeRequest: GetEmployeeservice) {

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data = EmployeeRequest;
  }



  ////////////////////////////////page Initial setup////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.toolbar = ['ColumnChooser'];
    this.getpermission();
    if (this.global.globalAgencyId != 0) {
      this.getEmployeeStatus();
    }

let pag=JSON.parse(this.global.globalColumn.column)[0].Employee.Pagesize;
    this.filterSettings = { type: 'Menu' };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: pag, pageSize: pag, pageSizes: this.pageSizes };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    
    // this.grid.pageSettings.currentPage = 1;
    //console.log(this.initialPage, "current");
    this.EmployeeListData.pageitem=pag
    this.EmployeeListData.currentpageno = 1;
    

  }

  //===================================Show column settings===================//
  argsenabled:boolean=false
  show() {
    // this.grid.columnChooserModule.openColumnChooser(950, 20); // give X and Y axis
    // this.grid.columnChooserModule.openColumnChooser(20,20); // give X and Y axis
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
    this.argsenabled =true;
   // console.log(this.grid.columnChooserModule, "column chooser");

  }
  //////////////////////////////////////////////////get Employee///////////////////////////////////////////////////////////

  getEmployee() {


    this.getEmployeedata();
  }

  //////////////////////////////////////Employee Total Count //////////////////////////////////////////////////////////

  getEmployeeTotalCount() {
    let params = new URLSearchParams();
    params.append("SearchColumn", this.searchColumn);
    params.append("SearchText", this.searchText);
    params.append("AgencyId", this.global.globalAgencyId);
    this.EmployeeService.getEmployeeTotal(params).subscribe((data: number) => {
      //console.log("total count==", data);
      this.EmployeeTotalCount = data;
      // this.initialPage = { pageSizes: ['10', '20', '50'], pageSize: 10 }
    });
  }
  //////////////////////////////////////////Employee Total Iteam /////////////////////////////////////////////////////////

  getEmployeeTotalIteam() {
    //console.log(this.employeeFilter.employeeStatus)
    //console.log(this.employeeFilter.employeeType)
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    params.append("SearchColumn", this.searchColumn);
    params.append("SearchText", this.searchText);
    params.append("Pageitem", this.sorting.itemperpage.toString());
    params.append("Currentpageno", this.sorting.currentPgNo.toString());
    params.append("OrderColumn", this.sorting.shortcolumn);
    params.append("StatusLid", this.employeeFilter.employeeStatus.toString());
    params.append("EmployeeTypeLid", this.employeeFilter.employeeType.toString());
    params.append("OrderType", this.sorting.shortType);
    this.EmployeeService.getEmployeeTotaIteam(params).subscribe((data: Employee[]) => {


      this.EmployeeList = DataUtil.parse.parseJson(data);
      //console.log("data", this.EmployeeList);

    })

  }

  ////////////////////////////////////get employee status////////////////////////////////////////////////////////////

  getEmployeeStatus() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getEmployeeStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {

      this.EmployeestatusList = JSON.parse(JSON.stringify(data));
      this.dropdata = data.map(e => e.Value);
      this.EmployeestatusList.push({ Key: 0, Value: "All" });

      this.employeeFilter.employeeStatus = this.EmployeestatusList.filter(st => st.Value == "Active")[0].Key;


      //console.log(this.dropdata)
      this.getEmployeeType();
    })

  }
  ////////////////////////////////////get employee Type////////////////////////////////////////////////////////////

  getEmployeeType() {
    let params = new URLSearchParams();
    params.append("Code", "EMPLOYEETYPE");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getEmployeeStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeTypeList = JSON.parse(JSON.stringify(data));
      this.dropdata1 = data.map(e => e.Value);
      this.EmployeeTypeList.push({ Key: 0, Value: "All" });
      this.employeeFilter.employeeType = this.EmployeeTypeList.filter(t => t.Value == "PCA Employee")[0].Key;

      this.EmployeeListData.statusLid = parseInt(this.employeeFilter.employeeStatus.toString())
      this.EmployeeListData.employeeTypeLi = parseInt(this.employeeFilter.employeeType.toString());
      this.getEmployee()
    })

  }
  ///////////////////////////////////////////Refresh function ////////////////////////////////////////////////////

  Refresh() {
    this.searchText = "";
    this.EmployeeListData.matchCase = false;
    this.EmployeeListData.operator = "startswith";
    this.EmployeeListData.value = this.searchText;
    this.EmployeeListData.type = "string"
    this.EmployeeListData.field = "Name"
    this.EmployeeListData.statusLid = this.EmployeestatusList.filter(st => st.Value == "Active")[0].Key;
    this.EmployeeListData.employeeTypeLi = this.EmployeeTypeList.filter(t => t.Value == "PCA Employee")[0].Key;
    this.employeeFilter.employeeStatus = this.EmployeeListData.statusLid
    this.employeeFilter.employeeType = this.EmployeeListData.employeeTypeLi
    this.EmployeeListData.pageitem = 10;
    this.EmployeeListData.currentpageno = 1;
    this.selectedFile = null
    this.selectedFileName = ""
    this.selected = false;
    this.sorting = new sortingObj();

    this.getEmployee();
    this.grid.pageSettings.currentPage = 1;
  }
  /////////////////////////////////////////Edit Employee/////////////////////////////////////////////////////////

  editEmployee(edit) {
    //console.log(edit)
    if (edit == 'new') {
      this.isViewEdit.emit({ isView: false, isEdit: true, isEditEmployee: false, editEmployee: 0, Employeedata: new Employee() })
      this.isEditEmployee = false;
    }
    else {

      this.isViewEdit.emit({ isView: false, isEdit: true, isEditEmployee: true, editEmployee: edit.id, Employeedata: edit })
      this.isEditEmployee = true;
    }
    this.isEdit = true;

  }
  ///////////////////////////////////view Employee Report////////////////////////////////////////////////////////
  viewReport() {
    this.router.navigateByUrl("/employee-report");
  }

  ////////////////////////////////////export excel////////////////////////////////////////////////////////

  excelformatfunction() {
    window.open('/assets/employee/Employee_Import_Excel_Format.xlsx');
  }
  /////////////////////////////Action Begin ////////////////////////////////////////////////////////

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

  // console.log(hidearr, "hidearr")
  // console.log(showarr, "showarr");
  // console.log(this.arraycol, "arraycol");

  var count = 0;
  var count1 = 0;
  if (args.columns.length > 0) {
if(this.arraycol.length > 0)
{
  this.arraycol[0].Employee.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Employee.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });
  //console.log(count,this.arraycol[0].Employee.HideColumns.length,this.arraycol[0].Employee.ShowColumns.length, count1, "count");


  if (this.arraycol[0].Employee.ShowColumns.length != count1 || this.arraycol[0].Employee.HideColumns.length != count) {
    this.arraycol[0].Employee.ShowColumns = showarr;
    this.arraycol[0].Employee.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
  
  }
}
    
    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.EmployeeListData.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.EmployeeListData.pageitem = this.grid.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.EmployeeListData.type = args.columnType
   //   console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    //console.log(this.grid)

  }
  ///////////////////////////////get employee data with filter/////////////////////////////////////////////////////////////
  getEmployeedata() {

    this.EmployeeListData.agencyId = parseInt(this.global.globalAgencyId);

let val=0;



    this.EmployeeRequest.execute(this.EmployeeListData)
    this.data.subscribe((datas:any) => {
      val++;
    //  console.log(datas);
      if(datas!=null&&datas!=undefined&&val==1)
      {
        this.getColumnwidth();
      }
     
      // if (this.employeeFilter.employeeStatus == 0) {
      //   this.grid.showColumns(['Status']);
      // }
      // else {
      //   this.grid.hideColumns(['Status']);
      // }
      //console.log("EmployeeList", data);
 //   })
    //console.log("EmployeeList", this.data);



    })

  }
  //////////////////////////////////////////choose file //////////////////////////////////////////////////////////////////

  onFileChanged(file) {


    this.selectedFile = file.item(0);
    this.selectedFileName = this.selectedFile.name;


    this.selected = true;

  }

  ///////////////////////////////////////upload employee//////////////////////////////////////////////////////////////////

  async uploademployee() {

    let basevalue = await this.tobase64(this.selectedFile);
    let obj = {
      file: basevalue,
      filename: this.selectedFile.name,
      agencyId: parseInt(this.global.globalAgencyId.toString())
    }

    this.EmployeeService.uploadEmployeedata(obj).subscribe(
      (data: any) => {
       if(data.errorCount>0)
        {
          this.toastrService.error(data.errorValues.toString(),
          'Employee import error')
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
        }
       else if(data.importedcount==0)
        {
          

          this.toastrService.error("Employee not added!",
          'Employee import error')
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        }
        else
        {
          this.EmployeeListData.currentpageno=1;
          this.selectedFileName="";
          this.selectedFile=null;
          this.getEmployee();
          this.toastrService.success("Employee has been added successfully",
          'Employee added')
        setTimeout(() => {
          this.toastrService.clear();
        }, 3000);
        }
        this.selectedFile = null
        this.selectedFileName = ""
        this.getEmployee();
      }, (err: HttpErrorResponse) => {
        this.toastrService.error(err.error,
          'Employee import error')
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      }
    );

  }

  /////////////////////////file to base64////////////////////////////////////////////////////////////////////////////////

  tobase64 = value => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = (e: any) => resolve(e.target.result);
    reader.onerror = error => reject(error);
  });

  ////////////////////////////////////get Employee/////////////////////////////////////////////////////////////////////
  public dataStateChange(state): void {
    //console.log("Stats chage", state);
    this.type = (state.action.requestType).toString();
    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.EmployeeListData.orderColumn = state.sorted[0].name;
        this.EmployeeListData.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
      }
    }
    if (this.type == "filtering" && state.action.action != "clearFilter") {
      if (this.EmployeeListData.type == "number") {


        this.EmployeeListData.value = state.action.currentFilterObject.value.toString();
        this.EmployeeListData.field = state.action.currentFilterObject.field;


      }
      if (this.EmployeeListData.type == "date") {
        //console.log(state.action.currentFilterObject.value)
        this.EmployeeListData.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.EmployeeListData.field = state.action.currentFilterObject.field;
      }
      else {
        this.EmployeeListData.value = state.action.currentFilterObject.value;
        this.EmployeeListData.field = state.action.currentFilterObject.field;
      }
      if (state.action.currentFilterObject.field == "statusLidName") {

        this.EmployeeListData.value = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
        this.EmployeeListData.field = "statusLid";
        this.EmployeeListData.statusLid = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
        this.EmployeeListData.type = "number";
      }
      if (state.action.currentFilterObject.field == "employeeTypeLidName") {

        this.EmployeeListData.value = this.EmployeeTypeList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
        this.EmployeeListData.field = "employeeTypeLid";
        this.EmployeeListData.employeeTypeLi = this.EmployeeTypeList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
        this.EmployeeListData.type = "number";
      }


      this.EmployeeListData.matchCase = state.action.currentFilterObject.matchCase;
      this.EmployeeListData.operator = state.action.currentFilterObject.operator;

    }
    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.EmployeeListData.field = "Name";
        this.EmployeeListData.matchCase = false;
        this.EmployeeListData.operator = "contains";
        this.EmployeeListData.value = "";
        this.EmployeeListData.type = "string"
      }
    }

    this.getEmployeedata();

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Employee.Pagesize!=state.take)
        {
          this.arraycol[0].Employee.Pagesize = state.take
          //   console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }
    }
  }



  filterchange() {

    this.EmployeeListData.field = "Name";
    this.EmployeeListData.matchCase = false;
    this.EmployeeListData.operator = "contains";
    this.EmployeeListData.value = this.searchText;
    this.EmployeeListData.type = "string"
    this.EmployeeListData.statusLid = parseInt(this.employeeFilter.employeeStatus.toString());
    this.EmployeeListData.employeeTypeLi = parseInt(this.employeeFilter.employeeType.toString());
    this.EmployeeListData.pageitem = 10;
    this.EmployeeListData.currentpageno = 1;
    this.getEmployeedata();
  }

  getpermission() {
    let params = new URLSearchParams();

    params.append("pagecode", "Employee");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.EmployeeService.getEmployeepermission(params).subscribe((data: any) => {

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
  //============================== Tooltip =========================================================//
  headerCellInfo(args) {

    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({
      content: toolcontent
    });
    tooltip.appendTo(args.node);
    //  console.log(tooltip,"tooltip");

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
    //console.log(args.column, "column");

  }

  // ==============================================================================

getColumnwidth() {
  this.EmployeeService.getcolumwidth().subscribe((data: any) => {
    if(data!=null&&data!=undefined)
    {
      this.global.globalColumn=data;
    }
  
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Employee.Columns;


  
    let showcol = JSON.parse(data.column)[0].Employee.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Employee.HideColumns
  

 //   this.grid.showColumns(showcol);log
 console.log(this.grid,"grid eployeee");
 
    this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Employee.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Name') {

        const column = this.grid.getColumnByField('name'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'DOB') {

        const column1 = this.grid.getColumnByField('dob'); // get the JSON object of the column corresponding to the field name
        
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Age') {

        const column1 = this.grid.getColumnByField('age'); // get the JSON object of the column corresponding to the field name
      
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Email') {

        const column1 = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
      
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Phone') {

        const column1 = this.grid.getColumnByField('phone1'); // get the JSON object of the column corresponding to the field name
       
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Street') {

        const column1 = this.grid.getColumnByField('street'); // get the JSON object of the column corresponding to the field name
     
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Zip Code') {

        const column1 = this.grid.getColumnByField('zipCode'); // get the JSON object of the column corresponding to the field name
       
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Status') {

        const column1 = this.grid.getColumnByField('statusLidName'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Employee Type') {

        const column1 = this.grid.getColumnByField('employeeTypeLidName'); // get the JSON object of the column corresponding to the field name
    
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
  this.arraycol[0].Employee.Columns = this.ColumnArray;
  this.arraycol[0].Employee.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.EmployeeService.savecolumwidth(this.columnchange).subscribe((data: any) => {

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


