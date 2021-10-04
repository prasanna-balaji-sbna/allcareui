import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, ViewChild, Inject } from '@angular/core';
import { AuthListBO, EditDetailsAuthorization, functionpermission } from '../client-parent.model';
import {ClientHttpService} from '../client-parent.service';
import{returnClientAuthorization} from '../client-parent.model'
import {GlobalComponent } from '../../../global/global.component';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DataUtil } from '@syncfusion/ej2-data'; 
import { generalservice } from 'src/app/services/general.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../list/list.model';
import { clienttserivce } from '../clientservice';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-client-authorization',
  templateUrl: './client-authorization.component.html',
  styleUrls: ['./client-authorization.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientAuthorizationComponent implements OnInit {
  fp:functionpermission=new functionpermission()
  @Output() EventToEditAuth = new EventEmitter<EditDetailsAuthorization>();
  EditOptions:EditDetailsAuthorization=new EditDetailsAuthorization();
  clientAuthList:returnClientAuthorization[];

  @ViewChild('grid') public grid:GridComponent;
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];

  filterOptions: FilterSettingsModel;
  initialPage: object;
  public data: Observable<DataStateChangeEventArgs>;
  ListBO: AuthListBO= new AuthListBO();
  constructor(public http:ClientHttpService,public global:GlobalComponent,private ref: ChangeDetectorRef,@Inject(clienttserivce) public clienttserivce: clienttserivce,) { 
this.data= clienttserivce;
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);

  }
  formatOptions:object;
  ngOnInit(): void {
    this.getpermission()
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};
    this.getAuthrization();
    let pag=JSON.parse(this.global.globalColumn.column)[0].Authorization.Pagesize;
    this.initialPage = { pageSizes: ['10','15','20', '50','100','250'], pageSize: pag }
    this.filterOptions = { type: 'Menu' };
    this.ListBO.pageitem=pag;

  }
  //============================Add client======================//
  AddAuthorization(modalType:string,data){
   // console.log(modalType)
    if(modalType=='new'){
      this.EditOptions.isEdit=true;
      this.EditOptions.type='new';
      this.EditOptions.ClientId=this.global.clientId
      this.EditOptions.AuthorizationId=0;
      this.EventToEditAuth.emit(this.EditOptions);
    }
    if(modalType=='edit')
    {
      this.EditOptions.AuthorizationId=data.id;
      this.EditOptions.type='edit';
      this.EditOptions.isEdit=true;
      this.EditOptions.ClientId=this.global.clientId
      this.EditOptions.AuthorizationData=data;
      this.EventToEditAuth.emit(this.EditOptions);
    }
    if(modalType=='delete')
    {
      
        this.EditOptions.AuthorizationId=data.id;
        this.EditOptions.type='delete';
        this.EditOptions.ClientId=this.global.clientId
        this.EditOptions.isEdit=true;
        this.EditOptions.AuthorizationData=data;
        this.EventToEditAuth.emit(this.EditOptions);
      
    }
}
ngOnChanges(changes: SimpleChanges) {
  // debugger;
  let f = changes;
//  console.log(f);
}
getAuthrization(){
 
  this.ListBO.clientId = this.global.clientId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());
let count=0
    this.clienttserivce.executeAuth( this.ListBO)
    
    this.data.subscribe((data:any) => {
 count++;

    this.clientAuthList=DataUtil.parse.parseJson(data.result);
    if(data!=null&& data!=undefined&&count==1)
    {
      this.getColumnwidth();
    }
    
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

getpermission() {
  let params = new URLSearchParams();
  let url = "api/functionpermisssion/getfunctionpermissionclient?";
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

// ==============================================================================

getColumnwidth() {
  this.http.getcolumwidth().subscribe((data: any) => {
    if(data!=null&&data!=undefined)
      {
        this.global.globalColumn=data;
      }
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Authorization.Columns;
console.log(this.ColumnArray,"columnarray");


    // this.grid.columns.forEach(col => {
    //   this.arraycol[0].Client.HideColumns.forEach(element => {
    //     if (col.headerText == element) {
    //       col.visible = false;
    //     }

    //   });
    // });
    //  this.grid.refreshColumns();

    // this.grid.showColumns(JSON.parse(data.column)[0].Client.ShowColumns);
    // this.grid.hideColumns(JSON.parse(data.column)[0].Client.HideColumns);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Authorization.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Start Date') {

        const column = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'End Date') {

        const column1 = this.grid.getColumnByField('endDate'); // get the JSON object of the column corresponding to the field name
        
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Company Name') {

        const column1 = this.grid.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
      
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Payor Name') {

        const column1 = this.grid.getColumnByField('payorName'); // get the JSON object of the column corresponding to the field name
       
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Insurance Number') {

        const column1 = this.grid.getColumnByField('insuranceNo'); // get the JSON object of the column corresponding to the field name
     
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Service Agreement#') {

        const column1 = this.grid.getColumnByField('serviceAgreementNo'); // get the JSON object of the column corresponding to the field name
       
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Service Code') {

        const column1 = this.grid.getColumnByField('serviceCode'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Description') {

        const column1 = this.grid.getColumnByField('serviceDescription'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Total units') {

        const column1 = this.grid.getColumnByField('totalUnits'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Units Used') {

        const column1 = this.grid.getColumnByField('unitsUsed'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Units Remaining') {

        const column1 = this.grid.getColumnByField('unitsRemaining'); // get the JSON object of the column corresponding to the field name
    
        column1.width = element.width;

        this.grid.refreshHeader();
      }
    
       if (element.column == 'Actions') {

        const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });

}
SaveColumnwidth() {
  this.arraycol[0].Authorization.Columns = this.ColumnArray;
  this.arraycol[0].Authorization.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.http.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
      this.ListBO.orderColumn = "companyName";
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
      this.ListBO.field = "companyName";
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
        if(this.arraycol[0].Authorization.Pagesize!=state.take)
        {
          this.arraycol[0].Authorization.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
  this.getAuthrization();
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
