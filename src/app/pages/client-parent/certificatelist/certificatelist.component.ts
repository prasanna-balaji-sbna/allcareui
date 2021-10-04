import { Component, OnInit,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonHttpService } from 'src/app/common.service';
import { ClientHttpService } from '../client-parent.service';
import { generalservice } from 'src/app/services/general.service';
import { FormBuilder } from '@angular/forms';
import { GlobalComponent } from 'src/app/global/global.component';
import { CertificationListBO, ClientCertificationBO, editcertificate,functionpermission} from '../client-parent.model';
import { DataStateChangeEventArgs, FilterSettingsModel, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ColumnChangeBO, columnWidth } from '../../list/list.model';
import { Observable } from 'rxjs';
import { clienttserivce } from '../clientservice';


@Component({
  selector: 'app-certificatelist',
  templateUrl: './certificatelist.component.html',
  styleUrls: ['./certificatelist.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificatelistComponent implements OnInit {
  
  @ViewChild('grid') public grid: GridComponent;
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  LCertificationList: ClientCertificationBO[];
  fp:functionpermission=new functionpermission()
  deletecertificate:number=0;
  initialPage: object;
  public formatOptions: object;
  
  public data: Observable<DataStateChangeEventArgs>;
  ICD10List: [{ Key: string, Value: string }];

  ListBO: CertificationListBO = new CertificationListBO();

  filterOptions: FilterSettingsModel;
  @Output()  DatafromCertificate=new EventEmitter<editcertificate>();
  EditOptions:editcertificate=new editcertificate();
  constructor(public toastrService: ToastrService,public http: HttpClient, public datepipe: DatePipe, public commonhttp: CommonHttpService, public ClientService: ClientHttpService, public general: generalservice,
    private formBuilder: FormBuilder, public global: GlobalComponent, private ref: ChangeDetectorRef,@Inject(clienttserivce) public clienttserivce: clienttserivce,) {
     this.data= clienttserivce;
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
     }

  ngOnInit(): void {
    //console.log("call from client")
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    //this.getICD10List();
    this.getClientCertificationList();
    this.getpermission();
    let pag=JSON.parse(this.global.globalColumn.column)[0].Certification.Pagesize;
    this.initialPage = { pageSizes: ['10', '15', '20', '50', '100', '250'], pageSize: pag };
    this.ListBO.pageitem=pag;

   
  }
 //==================================get certification list========================//
 getClientCertificationList() {
  this.ListBO.clientId = this.global.clientId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());
let val=0
    this.clienttserivce.executeCertification( this.ListBO)
    
    this.data.subscribe((datas:any) => {console.log(datas,"data");
    val++;
    this.LCertificationList = datas.result;
    if(datas!=null&& datas!=undefined&&val==1)
    {
      this.getColumnwidth();
    }
   //console.log(data)
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
  //======================================get permission==========================================================//
  getpermission() {
    let params = new URLSearchParams();
 
    params.append("pagecode", "Client");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.ClientService.getClientpermission(params).subscribe((data: any) => {

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
  //============================Add client======================//
  AddCertificate(modalType:string,data){
   //console.log(data);
   //console.log(modalType)
    if(modalType=='new'){
      this.EditOptions.isEdit=true;
      this.EditOptions.type='new';
      this.EditOptions.clientId=this.global.clientId
      this.EditOptions.certificateId=0;
      this.DatafromCertificate.emit(this.EditOptions);
    }
    if(modalType=='edit')
    {
      this.EditOptions.certificateId=data.id;
      this.EditOptions.type='edit';
      this.EditOptions.isEdit=true;
      this.EditOptions.clientId=this.global.clientId
      this.EditOptions.clientcertifcateData=JSON.parse(JSON.stringify(data));
     
      //this.EditOptions.clientcertifcateData.icD10PrimaryId=this.ICD10List.filter(i => i.Value == this.EditOptions.clientcertifcateData.icD10PrimaryId)[0].Key.toString();
      this.DatafromCertificate.emit(this.EditOptions);
    }
    if(modalType=='delete')
    {
      
        this.EditOptions.certificateId=data.id;
        this.EditOptions.type='delete';
        this.EditOptions.clientId=this.global.clientId
        this.EditOptions.isEdit=true;
        this.EditOptions.clientcertifcateData=data;
        this.DatafromCertificate.emit(this.EditOptions);
      
    }
}
 //===================================Get COmmon Icd10=========================//
 getICD10List() {
  this.commonhttp.getICD10().subscribe((data: any = []) => {
   
    this.ICD10List = data;
    this.ICD10List.forEach(element => {
      element.Value = element.Value;
      element.Key = element.Key.toString();
    })
  })
}

// =================================== data change event=====================///////
// public dataStateChange(state): void {
//    console.log("Stats chage", state);
//   let type = (state.action.requestType).toString();
//   //  console.log(this.type);

//   this.getClientCertificationList();

//   if (type == "paging" && state.action.name == "actionBegin") {
//     this.SaveColumnwidth();
//   }
// }
 // ==============================================================================

 getColumnwidth() {
  this.ClientService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);
    if(data!=null&&data!=undefined)
      {
        this.global.globalColumn=data;
      }
    // console.log(JSON.parse(data.column)[0].Agency.ShowColumns.toString(), "show");
    console.log(this.grid, "grid");
    console.log(this.arraycol, "this.arraycol ");

    this.ColumnArray = JSON.parse(data.column)[0].Certification.Columns;
  
    //  this.grid.refreshColumns();

    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Certification.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Start Of Care') {

        const column = this.grid.getColumnByField('socDate'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }
      if (element.column == 'Start Date') {

        const column1 = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'End Date') {

        const column = this.grid.getColumnByField('endDate'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }
      if (element.column == 'Company') {

        const column = this.grid.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }
      if (element.column == 'ICD10(Primary)') {

        const column = this.grid.getColumnByField('icD10PrimaryIdCode'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }
      if (element.column == 'NPI') {

        const column = this.grid.getColumnByField('npi'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }
      if (element.column == 'Physician') {

        const column = this.grid.getColumnByField('physician'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();

      }

      if (element.column == 'Clinic') {

        const column = this.grid.getColumnByField('clinic'); // get the JSON object of the column corresponding to the field name
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


  });
}
SaveColumnwidth() {
  this.arraycol[0].Certification.Columns = this.ColumnArray;
  this.arraycol[0].Certification.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.ClientService.savecolumwidth(this.columnchange).subscribe((data: any) => {

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

 //========================= evnt change =====================================================================//
 public dataStateChange(state): void {
  console.log("Stats chage",state);    
  let val = (state.action.requestType).toString();
  if (val != "filterchoicerequest") {
    if ((state.sorted || []).length) {
      this.ListBO.orderColumn = "CompanyName";
      this.ListBO.orderType = 'asc';
      console.log(this.ListBO,"Evaluation=====");
      
    }
  }
  if (this.ListBO.type == "date") {
    //console.log(state.action.currentFilterObject.value)
    this.ListBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.ListBO.field = state.action.currentFilterObject.field;
  }
  // else {
  //   this.ListBO.value = state.action.currentFilterObject.value;
  //   this.ListBO.field = state.action.currentFilterObject.field;
  // }
  if (val == "filtering" && state.action.action != "clearFilter") {
    this.ListBO.field = state.action.currentFilterObject.field;
    this.ListBO.matchCase = state.action.currentFilterObject.matchCase;
    this.ListBO.operator = state.action.currentFilterObject.operator;
    this.ListBO.value = state.action.currentFilterObject.value;
  }
  else {
    if (val == "filtering" && state.action.action == "clearFilter") {
      this.ListBO.field = "CompanyName";
      this.ListBO.matchCase = false;
      this.ListBO.operator = "contains";
      this.ListBO.value = "";
      this.ListBO.type = "string"
      this.ListBO.clientId = this.global.clientId;
    }
  }
  if (val == "paging" && state.action.name == "actionBegin") {
    // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Certification.Pagesize!=state.take)
        {
          this.arraycol[0].Certification.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
  this.getClientCertificationList();
}

  /////////////////////////////Action Begin ////////////////////////////////////////////////////////

  public onActionComplete(args) {
    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.ListBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.ListBO.type = args.columnType
      console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    console.log(this.ListBO)

  }
}
