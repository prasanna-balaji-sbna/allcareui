
import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { searchfilterDetails } from '../zip-code/zip-code.model';
import { LovService } from './lov.service';
import { LovBO, sortingObj, lovDropdown, lovReturnBO, GetListBO, WhereCondition, functionpermission,columnWidth,ColumnChangeBO } from './lov.model';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GetHTTPService } from '../lov/lovtable.service';
import { Observable } from 'rxjs';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-inputs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
// import * as $ from 'jquery' 
declare var $: any;
@Component({
    selector: 'app-lov',
    templateUrl: './lov.component.html',
    styleUrls: ['./lov.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush
  })
export class LovComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  /////===============Main functionality initialisation=====================///
 
  LovArray:LovBO[];
  lov: LovBO = new LovBO();
  LovSelectList:lovDropdown[]
  list:lovDropdown=new lovDropdown();
  ListSendBO:GetListBO = new GetListBO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ///////////////=============Form initialization==========//

  /////////////===================Filters ==========//
  filterItems: { [key: string]: string } = {
    'lovCode': 'LovCode',
    'lovName': 'LovName',
     
    
  };
  fp: functionpermission;
  SearchText: string = ''; 
  SearchColumn: { [key: string]: string } = { 'lovCode': 'LovCode' };
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  // initialPage: object;
  filterOptions: FilterSettingsModel;
  filter: IFilter;  
  Filter_drop: searchfilterDetails;
  TotalCount: number;  
  lovForm:FormGroup
  pagshort: sortingObj = new sortingObj(); 
  // pagshort: sortingObj = new sortingObj(); 
  ////////////////========Functionlity initializations==========//    
  ModelType: string = 'edit';
  valuechange:any = [];
  public filterSettings: object;
  
  selectedItems = [];
  isSubmitted:boolean=false;
  public customerForm:FormGroup;
  profileImage:any;
  validationMessages:Object;
  ListSelected:boolean=false;
  cancelConfirm: boolean;
  // ListValue:number
  changeCount:number=0;
  showErrorAlert: boolean;
  ///////////////-===================Table initializations==========// 
//  public data: Observable<DataStateChangeEventArgs>;
  public pageSizes: number[] = [10,15,20,50,100,250]; 
  initialPage: PageSettingsModel;
  clientview:boolean=false;
     //============================Data manager===============================//
     public isinitialLoad: boolean = false; 
     // ===================================Other initialization===================//
     //======================================new try====================//
     public data: Observable<DataStateChangeEventArgs>;
     public state: DataStateChangeEventArgs;
//  Filter_drop: searchfilterDetails;
 ////////////////========Functionlity initializations==========//    
  constructor(public http: HttpClient, private formBuilder: FormBuilder,private ref: ChangeDetectorRef,
    public global: GlobalComponent, public httpService: LovService, public toastrService: ToastrService, public general: generalservice,@Inject(GetHTTPService) public gethttp:GetHTTPService,) {
      
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
    
      this.lovForm = this.formBuilder.group({
      lovCode: ['',Validators.required],
      lovName: ['',Validators.required],
      lovValue:[''],
      orderby:['',Validators.required],

    });
   

  }
  type:string="";
  public dataStateChange(state): void {
  console.log("Stats chage",state);    
  this.type = (state.action.requestType).toString();
  if(this.type!="filterchoicerequest"){
    if ((state.sorted || []).length) {
      this.ListSendBO.orderColumn = state.sorted[0].name;
      this.ListSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
    }   
   }
  if(this.type == "filtering" && state.action.action!="clearFilter"){
      this.ListSendBO.field=state.action.currentFilterObject.field;
      this.ListSendBO.matchCase=state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator=state.action.currentFilterObject.operator;
      this.ListSendBO.value=state.action.currentFilterObject.value.toString();
  }
  else{
    if(this.type == "filtering" && state.action.action=="clearFilter"){
      this.ListSendBO.field="lovCode";
      this.ListSendBO.matchCase=false;
      this.ListSendBO.operator="startswith";
      this.ListSendBO.value="";
      this.ListSendBO.type="string";
    }
  }
  this.ListSendBO.agencyID=parseInt(this.global.globalAgencyId);
  this.getLovFill();

  if (this.type == "paging" && state.action.name == "actionBegin") {
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].Lov.Pagesize!=state.take)
      {
        this.arraycol[0].Lov.Pagesize = state.take
           console.log( "save page size")
        this.SaveColumnwidth();
      // }

    }
  
  }
  }

}

  // //////////////////////////////////////////////
  ngOnInit(): void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.fp=new functionpermission();
    this.filepermissionget();
    this.filterSettings = { type: 'Menu',
   };
   this.SearchColumn.key="lovCode"
   this.SearchColumn.value="LovCode"
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    // this.getLovFill();
    // this.getTotalCount()
    this.getStatus()
    this.getColumnwidth(); 
  } 

  public onActionComplete(args) { 
    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
  {
    this.ListSendBO.type=args.columnType
    console.log(this.ListSendBO.type);
    
    console.log( this.ListSendBO)
  }
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
     
      this.arraycol[0].Lov.ShowColumns.forEach(old => {
        showarr.forEach(element => {
          if (old == element) {
            count1 = count1 + 1;
          }
        });

      });
    
      this.arraycol[0].Lov.HideColumns.forEach(old => {
        hidearr.forEach(element => {
          if (old == element) {
            count = count + 1;
          }
        });

      });
      console.log(count, count1, "count");
      console.log(this.arraycol[0].Lov.HideColumns.length, this.arraycol[0].Lov.HideColumns.length, "length");


 
      if (this.arraycol[0].Lov.ShowColumns.length != count1 || this.arraycol[0].Lov.HideColumns.length != count) {
        this.arraycol[0].Lov.ShowColumns = showarr;
        this.arraycol[0].Lov.HideColumns = hidearr;

        console.log(this.arraycol, "arraycol");

       this.SaveColumnwidth();

        //this.SaveColumnwidth();

      }
    }
  }
  }  
  
  change(args: ChangeEventArgs) {
    console.log("ChangeEventArgs",args);    
    this.initialPage = { currentPage: args.value};
}
  // ////////////////////Show Column Chooser//////////////////////////

  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  // ////////////////////Get LOV table Data//////////////////////////

//   getLov(){
//     console.log("val",this.list.value);
    
//     let url="api/LOV/GetLovListFilter?";  
//     let params = new URLSearchParams();
//     params.append("ListId",this.list.value);
//     params.append("SearchColumn", this.SearchColumn.key);
//     params.append("SearchText", this.SearchText);
//     params.append("Pageitem", this.pagshort.itemperpage.toString());
//     params.append("Currentpageno", this.pagshort.currentPgNo.toString());
//     params.append("OrderColumn", this.pagshort.shortcolumn);
//     params.append("OrderType", this.pagshort.shortType);
//     params.append("AgencyId", this.global.globalAgencyId);
//     this.http.get(url+params).subscribe((data:any)=>{
//       this.LovArray=data;
//       console.log(this.LovArray);
      
//     })
// }

getLovFill() {
  let listId=parseInt(this.list.value)
  console.log(this.global.globalAgencyId);
  
  this.ListSendBO.agencyID=parseInt(this.global.globalAgencyId)
  this.ListSendBO.listId=listId
  this.gethttp.execute(this.ListSendBO); 
  let count=0;   
  this.data.subscribe((data:any)=>{
    count=count+1
    if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
  })

  //this.getColumnwidth()

  console.log(" this.gethttp.",this.data);
}
  // ////////////////////Get Select dropdown//////////////////////////

getStatus(){
  this.httpService.sendGetRequest().subscribe((data: any) => {
  this.LovSelectList=data;
  console.log("lov",data);
 
  })
   
}
  // //////////////////GEt list Value////////////////////////////

getlistValue(list)

{
  if(list==undefined)
  {
    this.LovArray=[]
    console.log(this.LovArray);
    
  }
  else{
    console.log("list",list);
    // this.getLov()
    this.ListSelected=true
  this.getLovFill()
  this.getTotalCount()


  }

}
  // ///////////////////Total Count Function///////////////////////////

getTotalCount() {
  console.log(this.list.value);
  
  let url="api/LOV/GetLovCount?";
  let params=new URLSearchParams();
  params.append("ListId",this.list.value);
  params.append("SearchColumn",this.ListSendBO.field);
  params.append("SearchText", this.ListSendBO.value);
  this.http.get(url+params).subscribe((data: any) => {
    this.TotalCount = data;
    console.log("total",data);
    
  })

}
  // //////////////////Add And Edit Function////////////////////////////

addOrEditLov(type: string) {
  if (type == 'new') {
    this.ModelType = 'new';
    this.lovForm.reset();
    this.lov = new LovBO();
  }
  else {
    this.ModelType = 'edit';
  
  }
this.valueschanges()
}
  // //////////////////Save and Update data ////////////////////////////
  loading: boolean;
  error: string;
  lovErr:any='';

SaveOrUpdateLov()
{
  let url = "api/LOV/SaveLov";

  console.log(this.list.value);
 
    console.log(this.lovForm.value);
    
    var saveList:LovBO = JSON.parse(JSON.stringify(this.lov));
    saveList.listId=parseInt(this.list.value)
    // if(this.ModelType == 'new')
    // {
      // this.LovArray.forEach(element=>
      //   {
      //     if(element.orderby===this.lovForm.get('orderby').value)
      //     {
      //       this.toastrService.error('Order NO. Already Existed',  )
      //     }
      //     if(element.lovCode===this.lovForm.get('lovCode').value)
      //     {
      //       this.toastrService.error('Code Already Existed')
      //     }
      //   })
    // }
   
  
    this.http.post(url,saveList).subscribe((data: number) => {
      console.log("====save update=========", data);

      if (data) {
        //====================== success message =============
        if (this.ModelType == 'new') {
          saveList.id = data;
          // this.LovArray.push(saveList);
          this.getLovFill()
          this.getTotalCount()
          this.toastrService.success('Saved Successfully')
          document.getElementById('openModal1').click();
          // $('modal').modal('hide')

        }
        else if (this.ModelType == 'edit') {
          this.getLovFill()
          this.getTotalCount()
          this.toastrService.success('Updated Successfully')
          document.getElementById('openModal1').click();

     
        } 
      }
    },(err:HttpErrorResponse) => {
    
 

      if(err)
      {
    
        this.error=err.error;
        console.log("err.error",this.error);
        this.showErrorAlert=true
      }
      else{
        this.error= JSON.stringify(err.error);
       console.log("err.error",err.error);
       
      }
    
      if (this.error != "") {
        console.log("this.error",this.error);
        
        setTimeout(() => {
          this.error = "";
          this.showErrorAlert=false
        }, 5000)
      }
    })
    
    
    
}

  // ////////////////////Delete table Row //////////////////////////

deletelov() {
  // let url = "api/LOV/DeleteLov?";
  let params = new URLSearchParams();
  params.append("LovId",this.lov.id.toString());
  this.httpService.deleteLov( params).subscribe((data: any) => {
console.log(data);
this.getLovFill()
this.getTotalCount()
  this.toastrService.success("Lov has been Deleted Successfully")
  document.getElementById('openModal2').click();
     
  }
  )
}

// ///////////////////Get ID for delete///////////////////////////

lovdelete(data) 
{
  this.lov.id=data;
  console.log(data);
  
}
  // ////////////////Get Details for edit//////////////////////////////

lovDetails(data:LovBO)
{
  this.lov=data;
  this.lov=JSON.parse(JSON.stringify(data));
 
  console.log(data);
  
  
}
  // /////////////////Search And Refresh Functions/////////////////////////////

setDefaultValue() {
  console.log("this.SearchColumn", this.SearchColumn);
  this.SearchText = "";
  if (this.SearchColumn == undefined)
    this.SearchColumn = {
      
      'lovCode': 'LovCode',

    };
}
onKeydown(event) {
  if (event.key === "Enter") {
    this.Search();
  }
}
Search() {
  this.pagshort.currentPgNo = 1;
  this.ListSendBO.field=this.SearchColumn.key
  this.ListSendBO.value=this.SearchText
  this.getLovFill()
  this.getTotalCount();
}
Refresh() {   
  this.SearchText = "";
 // this.SearchColumn.key = '';
 this.ListSelected=false;
 this.SearchColumn.key="lovCode"
 this.SearchColumn.value="LovCode"
  this.ListSendBO.field='lovCode'
  this.ListSendBO.value=''
  this.list.value='';
  this.filterItems={
    'lovCode': 'LovCode',
    'lovName': 'LovName',  
  };
  this.pagshort = new sortingObj(); 

  this.grid.pageSettings.currentPage=1;
  this.getLovFill()
  this.getTotalCount();
}
paginationChange(event) {
  this.pagshort.currentPgNo = event;
  this.getLovFill()
  this.getTotalCount();

}
pageItemsChage(pageitems) {
  this.pagshort.itemperpage = pageitems;
  this.getLovFill()
  this.getTotalCount();
 

}
actionHandler(args) {
  if (args.requestType == "sorting") {
    console.log(args.direction + ' ' + args.columnName);
  }
  else if (args.requestType == "filtering") {
    console.log(args.currentFilterObject.operator + ' ' + args.currentFilterObject.value + ' ' + args.currentFilteringColumn);
  }
}


//////////////////////////////////value change///////////////////////////////////////
valueschanges() {
  this.valuechange = {
    lovCode: 0,
    lovName: 0,
    lovValue: 0,
    orderby: 0,
  
  }
}

checkpopup(value) {
  if (value == "lovCode") {
    this.valuechange.lovCode++;
  }
  if (value == "lovName") {
    this.valuechange.lovName++;
  } if (value == "lovValue") {
    this.valuechange.lovValue++;
  } if (value == "orderby") {
    this.valuechange.orderby++;
  }
console.log("inc",this.valuechange);

}
// ///////////////////////Cancel modal popup//////////////////////////////////////////

cancel() {
  console.log(this.changeCount++); 
// if(this.lovForm.get('lovCode').dirty)
if (this.valuechange.lovCode > 1 || this.valuechange.lovName > 1 || this.valuechange.lovValue > 1 ||
  this.valuechange.orderby > 1)
 {

//  $('#openBtn').click(function(){

    $('#CloseModal').modal({
        show: true,
        zIndex:1000000
    })
  
//  })
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 10000000 + (1 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
// document.getElementById('openModal3').click();

}
  
 else 
  {
    document.getElementById('openModal1').click();
// this.showtable()
  }
}
   // ///////////////////Close Save and update & Close Popup///////////////////////////

cancelYes()
{

  document.getElementById('openModal1').click();
 document.getElementById('openModal3').click();

} 
////////////////////////////// Function Permission ////////////////////////////////////////
filepermissionget() {
  let params = new URLSearchParams();
  let url = "api/functionpermisssion/getfunctionpermission?";
  params.append("pagecode", "Lov");
  params.append("roleId", this.global.roleId);
  this.http.get(url + params).subscribe((data: any) => {
    console.log("data len", data != null);

    if (data != null) {
      this.fp = data;
      console.log("data", this.fp);
    }
    else {
      this.fp = new functionpermission();
    }
  },
    (err: HttpErrorResponse) => {
      this.fp = new functionpermission();
    })
}
//============================ tooltip For header ===================================//
headerCellInfo(args) { 

  const toolcontent = args.cell.column.headerText; 
  const tooltip: Tooltip = new Tooltip({ 
    content: toolcontent 
}); 
 tooltip.appendTo(args.node); 
 
}
onResize(args) {
  const column = this.grid.getColumnByField(args.column.field)
  column.width = args.column.width;
  console.log(this.ColumnArray);
  this.ColumnArray.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  this.SaveColumnwidth();
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
getColumnwidth() {
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Lov.Columns;
    console.log( "hello ",JSON.parse(data.column));


  
    let showcol = JSON.parse(data.column)[0].Lov.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Lov.HideColumns
  
    this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Lov.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'LovCode') {

        const column = this.grid.getColumnByField('lovCode'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'LovName') {

        const column1 = this.grid.getColumnByField('lovName'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'LovValue') {

        const column2 = this.grid.getColumnByField('lovValue'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Orderby') {

        const column3 = this.grid.getColumnByField('orderby'); // get the JSON object of the column corresponding to the field name
        column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column4 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        //column4.headerText = element.column;
        //column4.width = element.width;
        this.grid.refreshHeader();

      }
    });
  });
}
SaveColumnwidth() {
  this.arraycol[0].Lov.Columns = this.ColumnArray;
  this.arraycol[0].Lov.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();


    //this.getColumnwidth();


  });
}

}

