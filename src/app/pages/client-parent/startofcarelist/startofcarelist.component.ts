import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { GlobalComponent } from 'src/app/global/global.component';
import { ClientSOC, StartOfCareBO, EditSOCDetails, functionpermission, SOCListBO } from '../client-parent.model';
import { DataStateChangeEventArgs, FilterSettingsModel } from '@syncfusion/ej2-grids';
import { GridComponent, IFilter, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { ClientHttpService } from '../client-parent.service';
import { DataUtil } from '@syncfusion/ej2-data'; 
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../list/list.model';
import { Observable } from 'rxjs';
import { clienttserivce } from '../clientservice';
@Component({
  selector: 'app-startofcarelist',
  templateUrl: './startofcarelist.component.html',
  styleUrls: ['./startofcarelist.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartofcarelistComponent implements OnInit {
  //================================Array list=====================//
  Lsoclist:ClientSOC[];
  //===============================Filter options===================//
  fp:functionpermission=new functionpermission()
  filterOptions: FilterSettingsModel;
  initialPage: object;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;
  deleteId:number;

  public data: Observable<DataStateChangeEventArgs>;
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ListBO:SOCListBO= new SOCListBO();
  //====================================general initializations===========================//
  public formatOptions: object;
  //====================================Emit event===============================//
  @Output() EventToEditSOC = new EventEmitter<EditSOCDetails>();
  EditOptions:EditSOCDetails=new EditSOCDetails();
  constructor(public global:GlobalComponent,public httpservice:ClientHttpService,public toastrService:ToastrService,private ref: ChangeDetectorRef, @Inject(clienttserivce) public clienttserivce: clienttserivce) {
    this.data= clienttserivce;
  //   ref.detach();
  //   setInterval(() => {
  //     this.ref.detectChanges();
  //   }, 100);
   }

  ngOnInit(): void {
    this.filterOptions = { type: 'Menu' };
    this.filter = {
      type: 'Excel'
    };   
    let pag=JSON.parse(this.global.globalColumn.column)[0].Startofcare.Pagesize;
    this.initialPage = { pageSizes: ['10','15', '20', '50','100','250'], pageSize: pag };
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};
    this.ListBO.pageitem=pag;
    this.getSOClist();
   // console.log("child data")
    this.getpermission()
  }

  //=======================================Get soc list===============================//
  getSOClist(){
    let SOCparams = new URLSearchParams();
    this.ListBO.clientId = this.global.clientId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());

    this.clienttserivce.executeSOC( this.ListBO)
   // this.
   let count=0
    this.data.subscribe((datas:any) => {
    count++;
    console.log(count)
      this.Lsoclist=DataUtil.parse.parseJson(datas.result); 
    //  console.groupCollapsed(datas.result) 
      if(datas!=null&& datas!=undefined&&count==1)
      {
        this.getColumnwidth();
      }
    });
  }

  //=======================================Create/update modal soc list===============================//
  AddStartofcare(modalType:string){
    if(modalType=='new'){
      this.EditOptions.isEdit=true;
      this.EditOptions.isEditSOC=false;
      this.EventToEditSOC.emit(this.EditOptions);
    }
    if(modalType=='edit'){
      this.EditOptions.isEdit=true;
      this.EditOptions.isEditSOC=true;
      this.EventToEditSOC.emit(this.EditOptions);
    }
    if(modalType=='delete')
    {
      this.EditOptions.isEdit=true;
      
      this.EditOptions.type="delete";
      this.EventToEditSOC.emit(this.EditOptions);
    }

}
//=============================================Datatoedit======================//
Datatoedit(data:StartOfCareBO){
this.EditOptions.clientSOCData=data;
this.EditOptions.clientId=data.clientId;
}
getpermission() {
  let params = new URLSearchParams();

  params.append("pagecode", "Client");
  params.append("roleId", this.global.roleId);
  params.append("agencyId", this.global.globalAgencyId)
  this.httpservice.getClientpermission(params).subscribe((data: any) => {

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
  this.httpservice.getcolumwidth().subscribe((data: any) => {
    if(data!=null&&data!=undefined)
    {
      this.global.globalColumn=data;
    }
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Startofcare.Columns;

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

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Startofcare.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Start Of Care') {

        const column = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Company') {

        const column1 = this.grid.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
        
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Discharge') {

        const column1 = this.grid.getColumnByField('dischargeStatus'); // get the JSON object of the column corresponding to the field name
      
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Discharge Date') {

        const column1 = this.grid.getColumnByField('dischargeDate'); // get the JSON object of the column corresponding to the field name
       
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Discharge Status Code') {

        const column1 = this.grid.getColumnByField('dischargeCode'); // get the JSON object of the column corresponding to the field name
     
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
  this.arraycol[0].Startofcare.Columns = this.ColumnArray;
  this.arraycol[0].Startofcare.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpservice.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
        if(this.arraycol[0].Startofcare.Pagesize!=state.take)
        {
          this.arraycol[0].Startofcare.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
  this.getSOClist();
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
