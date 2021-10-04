import { Component, OnInit, Output, EventEmitter, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { EditDetailsClient, ClientBO, sortingObj, clientFilter, getClient, QPfilter, GetClientEmployeeRelationshipBO, functionpermission } from '../client-parent.model';
import { GlobalComponent } from 'src/app/global/global.component';
import { ClientHttpService } from '../client-parent.service';
import { generalservice } from 'src/app/services/general.service';
import { GridComponent, FilterSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { clienttserivce } from '../clientservice'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../list/list.model';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent implements OnInit {
  //=======================General intialzations=================//
  pClientList: ClientBO[] = [];
  //=========================filter inializations===============//
  filterOptions: FilterSettingsModel;
  initialPage: object;
  height: string = "200px";
  @ViewChild('grid') public grid: GridComponent;
  //===============================Sorting=================================//
  fp: functionpermission = new functionpermission();
  sorting = new sortingObj();
  SearchColumn: string = "FirstName";
  SearchText: string = "";
  clientFilter = new clientFilter();
  TotalCount: number = 0;
  public formatOptions: object;
  ClientStatus: [{ Key: number, Value: string }]
  QpStatusDropdown: [{ Key: number, Value: string }]
  ClientDropDown: [{ Key: string, Value: string }]
  EmployeeDropdown: [{ Key: string, Value: string }]
  @Output() EventToEdit = new EventEmitter<EditDetailsClient>();
  employeeStatus: number = 0;
  ClientEmployee: GetClientEmployeeRelationshipBO[] = [];
  saveClientEmployee: any = new GetClientEmployeeRelationshipBO();
  QPFilter: QPfilter = new QPfilter();
  getClient: getClient = new getClient();
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  EditOptions: EditDetailsClient = new EditDetailsClient();
  dropdata: string[] = []
  Searchtext: string = ""
  //=========================File Upload Variable==============================//
  selectedFile: any = null;
  selectedFileName: string = "";
  selected: boolean = false;

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;

  constructor(public datepipe: DatePipe, public global: GlobalComponent,
    public http: ClientHttpService, public general: generalservice, @Inject(clienttserivce) public clienttserivce: clienttserivce,
    public router: Router, public toastrService: ToastrService, private ref: ChangeDetectorRef) {

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);


    this.data = clienttserivce;
  }

  ngOnInit(): void {
    this.getpermission()
    this.toolbar = ['ColumnChooser'];
    if (this.global.globalAgencyId) {

      this.getclinetStatus()
    }
    let pag=JSON.parse(this.global.globalColumn.column)[0].Client.Pagesize;
    this.filterOptions = { type: 'Menu' };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.initialPage = { pageSizes: ['10','15', '20', '50','100','250'], pageSize: pag }
    this.getClient.pageitem=pag
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
    // console.log(f);
  }

  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
  }
  //============================Add client======================//
  AddClient(modalType: string) {
    if (modalType == 'new') {
      //console.log("Type");
      this.global.clientId = 0;
      this.EditOptions.clientData = new ClientBO();
      this.EditOptions.isEdit = true;
      this.EventToEdit.emit(this.EditOptions);
    }
    else {
      this.global.clientId
      this.EditOptions.isEdit = true;
      this.EditOptions.isEditClient = true;
      this.EventToEdit.emit(this.EditOptions);
    }
  }


  //=================================Clientdatatobind====================//
  Clientdatatobind(data: any) {
    this.EditOptions.clientId = data.id
    this.EditOptions.clientData = data;
    this.EditOptions.clientData.dOB = data.dob
  }

  //==============================getClientList=============================//
  getClientListerr: any = ""
  getClientListDetails() {
    this.clientFilter.clientStatus = Math.floor(Number(this.clientFilter.clientStatus));

    let myParams = new URLSearchParams();

    //console.log("c;iet lisr",this.pClientList);
    this.getClient.agencyId = parseInt(this.global.globalAgencyId);

    this.clienttserivce.execute(this.getClient);
let val=0
   // console.log(data)
    console.log("get column in get clinet")
    
    this.data.subscribe((data:any) => {
      val++;
      if(data!=null&& data!=undefined&&val==1)
    {
      this.getColumnwidth();
    }


    })

  }

  ////////////////////////get List Count/////////////////////////////
  getClientListCount() {
    this.clientFilter.clientStatus = Math.floor(Number(this.clientFilter.clientStatus));
    let url = "api/Client/GetClientListCount?"
    let myParams = new URLSearchParams();
    myParams.append("clientFilter", this.clientFilter.clientStatus.toString());
    myParams.append("SearchColumn", this.SearchColumn);
    if (this.SearchText != null) {
      myParams.append("SearchText", this.SearchText);
    }
    myParams.append("agencyId", this.global.globalAgencyId);
    this.http.getClientListTotalCount(myParams).subscribe((data) => {
      this.TotalCount = data;
    })
  }
  //========================= evnt change =====================================================================//
  public dataStateChange(state): void {
    // console.log("Stats chage",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClient.orderColumn = state.sorted[0].name;
        this.getClient.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
      }
    }
    if (val == "filtering" && state.action.action != "clearFilter") {
      if (state.action.currentFilterObject.field == "status_Name") {

        this.getClient.value = this.ClientStatus.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
        this.getClient.field = "statusLid";
        this.getClient.statusLid = this.ClientStatus.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
        this.getClient.type = "number";
        this.getClient.operator = "equal";
      }
      else if (this.getClient.type == "number") {


        this.getClient.value = state.action.currentFilterObject.value.toString();
        this.getClient.field = state.action.currentFilterObject.field;


      }
      else if (this.getClient.type == "date") {
        //console.log(state.action.currentFilterObject.value)
        this.getClient.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.getClient.field = state.action.currentFilterObject.field;
      }
      else {
        this.getClient.value = state.action.currentFilterObject.value;
        this.getClient.field = state.action.currentFilterObject.field;





        this.getClient.matchCase = state.action.currentFilterObject.matchCase;
        this.getClient.operator = state.action.currentFilterObject.operator;

      }
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClient.field = "Name";
        this.getClient.matchCase = false;
        this.getClient.operator = "contains";
        this.getClient.value = "";
        this.getClient.type = "string"
        this.getClient.statusLid = this.ClientStatus[0].Key
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
        if( this.arraycol.length!=0)
        {
          if(this.arraycol[0].Client.Pagesize!=state.take)
          {
            this.arraycol[0].Client.Pagesize = state.take
               console.log( "save page size")
            this.SaveColumnwidth();
          // }

        }
      
      }

    }
    this.getClientListDetails();
  }

  getclinetStatus() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.http.getStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {

      this.ClientStatus = JSON.parse(JSON.stringify(data));
      /// this.QpStatusDropdown= this.ClientStatus;
      this.QpStatusDropdown = JSON.parse(JSON.stringify(data));
      this.dropdata = data.map(e => e.Value);
      this.ClientStatus.push({ Key: 0, Value: "All" });

      this.getClient.statusLid = this.ClientStatus.filter(st => st.Value == "Active")[0].Key;
      this.QPFilter.Status = this.ClientStatus.filter(st => st.Value == "Active")[0].Key;
      this.saveClientEmployee.statusLid = this.ClientStatus.filter(st => st.Value == "Active")[0].Key;

      //console.log( this.dropdata)
      this.getClientListDetails();
    })

  }
  AidReport() {
    this.router.navigateByUrl("/aid-report");
  }
  temphide: any = [];
  public onActionComplete(args) {
    console.log(args)
    //console.log(this.grid)
    //console.log(this.grid.pagerModule.pagerObj.currentPage)



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
          this.arraycol[0].Client.ShowColumns.forEach(old => {
            showarr.forEach(element => {
              if (old == element) {
                count1 = count1 + 1;
              }
            });

          });

          this.arraycol[0].Client.HideColumns.forEach(old => {
            hidearr.forEach(element => {
              if (old == element) {
                count = count + 1;
              }
            });

          });
        

          if (this.arraycol[0].Client.ShowColumns.length != count1 || this.arraycol[0].Client.HideColumns.length != count) {
          
            this.temphide = hidearr;
            this.arraycol[0].Client.ShowColumns = showarr;
            this.arraycol[0].Client.HideColumns = hidearr;
            this.arraycol[0].Client.Pagesize = this.grid.pagerModule.pagerObj.pageSize
            console.log("save column chooser");
            
            this.SaveColumnwidth();
          }
        }

      }
    }

    this.getClient.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.getClient.pageitem = this.grid.pagerModule.pagerObj.pageSize;


    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClient.type = args.columnType

    }


  }
  getClientDropDown() {
    let myParams = new URLSearchParams();
    myParams.append("agencyId", this.global.globalAgencyId);
    this.http.Clientdropdown(myParams).subscribe((data: any) => {
      data.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();
      })
      this.ClientDropDown = data;
    })
  }
  getEmployeeDropdown() {
    let myParams = new URLSearchParams();
    myParams.append("agencyId", this.global.globalAgencyId);
    this.http.EmployeeDropdown(myParams).subscribe((data: any) => {
      data.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();

      })
      this.EmployeeDropdown = data;
    })
  }
  getQp() {
    this.getEmployeeDropdown();
    this.getClientDropDown();
    this.QPFilter = new QPfilter();
    this.QPFilter.Status = this.ClientStatus.filter(st => st.Value == "Active")[0].Key;
    this.getClientEmployee()

    // this.getClientEmployee();
  }
  filterchange() {
    this.getClient.field = "Name";
    this.getClient.matchCase = false;
    this.getClient.operator = "startswith";
    this.getClient.value = "";
    this.getClient.type = "string"
    this.getClient.statusLid = parseInt(this.getClient.statusLid.toString());
    this.getClientListDetails();
  }
  getClientEmployee() {
    let client = 0;
    let employee = 0
    if (this.QPFilter.Client != null || this.QPFilter.Client != undefined) {
      client = this.QPFilter.Client
    }
    if (this.QPFilter.QPEMP != null || this.QPFilter.QPEMP != undefined) {
      employee = this.QPFilter.QPEMP
    }
    let myParams = new URLSearchParams();
    myParams.append("agency", this.global.globalAgencyId);
    myParams.append("clientId", client.toString())
    myParams.append("employeeId", employee.toString())
    myParams.append("relationshipFilter", this.QPFilter.Status.toString())
    this.http.getClientEmployeeRelation(myParams).subscribe((data: any) => {
      this.ClientEmployee = data;
    })
  }
  newmap() {
    this.saveClientEmployee.clientId = 0;
    this.saveClientEmployee.employeeId = 0;
    this.saveClientEmployee.statusLid = this.ClientStatus.filter(e => e.Value == "Active")[0].Key;
    //console.log(this.saveClientEmployee.statusLid)
    this.saveClientEmployee.id = 0;

  }
  editmap(data) {

    //console.log(data)
    this.saveClientEmployee = JSON.parse(JSON.stringify(data));
    this.saveClientEmployee.clientId = this.saveClientEmployee.clientId.toString()
    this.saveClientEmployee.employeeId = this.saveClientEmployee.employeeId.toString()
    this.saveClientEmployee.statusLid = this.saveClientEmployee.statusLid.toString()

  }
  saveClientEmployeedata(saveData) {

    let val = JSON.parse(JSON.stringify(saveData))
    val.clientId = parseInt(val.clientId.toString())
    val.employeeId = parseInt(val.employeeId.toString())
    val.statusLid = parseInt(val.statusLid.toString())

    this.http.saveClientEmployeedatas(val).subscribe((data: any) => {
      this.toastrService.success(
        "QP Mapped Successfully  ",
        "QP Map",
      );
      this.QPFilter = new QPfilter();
      this.getClientEmployee();
      document.getElementById("QPAddopen").click();
      this.saveClientEmployee = new GetClientEmployeeRelationshipBO();
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

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

  onFileChanged(file) {
    //console.log( file)
    this.selectedFile = file.item(0);
    this.selectedFileName = this.selectedFile.name;
    //console.log( this.selectedFile)

    this.selected = true;

  }
  uploadClient() {
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    var url = "api/Client/uploadclient?agencyId=" + this.global.globalAgencyId;
    this.http.uploadClientlst(uploadData, url).subscribe((data) => {
      if (data.errorCount == 0) {
       // let val=document.getElementById("customFile");
        
        this.selectedFileName = ""
        this.selectedFile = null
        this.selected = false;
     
      
       
        this.getClient.currentpageno=1;
        this.getClientListDetails();
      }
      else {
        if(data.errorCount>0)
        {
          this.toastrService.error(data.errorValues.toString(),
            'Client import error')
            setTimeout(() => {
              this.toastrService.clear();
            }, 8000);
         
        }
       else if(data.importedcount==0)
        {
         

          this.toastrService.error("Client not added!",
          'Client import error')
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        }
        else
        {
          this.toastrService.success(
            'Client has been added successfully!',
            'Client added',
          ), 3000;
      }
      }
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "Client import error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  filtername(value) {
    this.getClient.field = "Name";
    this.getClient.matchCase = false;
    this.getClient.operator = "contains";
    this.getClient.value = value;
    this.getClient.type = "string";
    this.getClientListDetails();

  }
  Refresh() {
    this.getClient.field = "Name";
    this.getClient.matchCase = false;
    this.getClient.operator = "contains";
    this.getClient.value = "";
    this.getClient.type = "string"
    this.getClient.statusLid = this.ClientStatus[0].Key
    this.getClient.orderColumn = "Name"
    this.getClient.orderType = "asc";
    this.getClient.currentpageno = 1;
    this.getClient.pageitem = 10;
    this.Searchtext = ""
    this.selectedFileName = ""
    this.selectedFile = null
    this.selected = false;
    this.getClientListDetails();
    this.grid.pageSettings.currentPage = 1;
  }
  excelformatfunction() {
    window.open('/assets/client/Client_Import_Excel_Format.xlsx');
  }
  //==========================================report==================================================================//
  report() {
    this.router.navigateByUrl('/client-report');
  }
  getpermission() {
    let params = new URLSearchParams();

    params.append("pagecode", "Client");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.http.getClientpermission(params).subscribe((data: any) => {

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

  }
  tooltip(args: QueryCellInfoEventArgs) {
    if (args.data[args.column.field] != null) {

      const tooltip: Tooltip = new Tooltip({
        content: args.data[args.column.field].toString(),
        position: 'RightCenter',


      }, args.cell as HTMLTableCellElement);
    }
  }
  Qpsetdefault() {
    this.QPFilter = new QPfilter();
  }
  // Qpback()
  // {
  //   document.getElementById("QPAddopen").click();
  //   this.getClientEmployee();
  // }


  // ==============================================================================

  getColumnwidth() {
    this.http.getcolumwidth().subscribe((data: any) => {
   
      if(data!=null&&data!=undefined)
      {
        this.global.globalColumn=data;
      }
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Client.Columns;


     
          let showcol = JSON.parse(data.column)[0].Client.ShowColumns;
          let hidecol = JSON.parse(data.column)[0].Client.HideColumns
        

       //   this.grid.showColumns(showcol);
          this.grid.hideColumns(hidecol);
       
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Client.Pagesize

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
        if (element.column == 'QP Name') {

          const column1 = this.grid.getColumnByField('qPname'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Age') {

          const column1 = this.grid.getColumnByField('age'); // get the JSON object of the column corresponding to the field name

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

          const column1 = this.grid.getColumnByField('status_Name'); // get the JSON object of the column corresponding to the field name

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
    this.arraycol[0].Client.Columns = this.ColumnArray;
    this.arraycol[0].Client.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.http.savecolumwidth(this.columnchange).subscribe((data: any) => {
      console.log("get column in save")
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
    console.log("change column  size save")
    this.SaveColumnwidth();
  }
}
