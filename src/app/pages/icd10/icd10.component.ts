
// import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { Component, OnInit, ViewChild, ElementRef,Input,EventEmitter,Output, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { sortingObj, functionpermission, GetICD10BO, WhereCondition,ICD10List,columnWidth,ColumnChangeBO, filterpair } from '../icd10/icd10.model';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { ICD10Service } from './icd10.service';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import {  PageSettingsModel, SearchSettingsModel, ToolbarItems, QueryCellInfoEventArgs} from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { IMultiSelectSettings, IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import { TemplateRef } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons, NgbModalOptions,} from '@ng-bootstrap/ng-bootstrap';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { GetHTTPIcdService } from './icd10table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
declare var $:any;
@Component({
  selector: 'app-icd10',
  templateUrl: './icd10.component.html',
  styleUrls: ['./icd10.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ICD10Component implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  // title = 'ng-bootstrap-modal-demo';
  // closeResult: string;
  // modalOptions:NgbModalOptions = {
  //   size: 'sm', windowClass: 'modal-xs',container: '.session-modal-container'
  // };

  @Input() ICD10input:string;
  @Output() dataFromICD10=new EventEmitter<number>();
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions:NgbModalOptions = {
    size: 'sm', windowClass: 'modal-xs',container: '.session-modal-container'
  };

  

  // private UtilComponent: any;

 /////===============Main functionality initialisation=====================///
icd10Array: ICD10List[];
icd10: ICD10List = new ICD10List();
confirmCancel:boolean

ColumnArray: columnWidth[]
 columnchange: ColumnChangeBO = new ColumnChangeBO();
 id: number = 0;
 arraycol: any = [];
 ///////////////=============Form initialization==========//
 icd10Form: FormGroup;
 
 SearchText: string = ''; 
SearchColumn:{ key: string,value: string } ={
        
  key: 'Code',value: 'Code',
  

 };

SearchColumns:string ='Code';


 ///////////////-===================Table initializations==========// 
//  public data: Observable<DataStateChangeEventArgs>;

 dropInstance: DropDownList;  
 public searchSettings: SearchSettingsModel;
 public toolbar: ToolbarItems[]; 
 initialPage: PageSettingsModel;
 filterOptions: FilterSettingsModel;
clientview:boolean=false;
 
 filter: IFilter;  
//  Filter_drop: searchfilterDetails;
 TotalCount: number;  
 pagshort: sortingObj = new sortingObj(); 
 ////////////////========Functionlity initializations==========//    
 ModelType: string = 'edit';
 fp: functionpermission;
/////////////===================Filters ==========//
EmployeeTypeList: [{ key: string, value: string }];
filterItems:filterpair[]=[]
 SearchTextICD:string="";
 pageNOIcd: number = 1;
 getICD10CodesErr: any = '';


 columnsSettings: IMultiSelectSettings = {
   enableSearch: true,
   checkedStyle: 'checkboxes',
   buttonClasses: 'fa fa-cog btn blue-btn btn-lg text-white',
   dynamicTitleMaxItems: 0,
   displayAllSelectedText: false,
   fixedTitle:false,
 
 };
 
 columns: IMultiSelectOption[] = [

  { id: 'ID', name: 'ID' },
  { id: 'Code', name: 'Code' },
  { id: 'ICD10 Level', name: 'ICD10 Level' },
  { id: 'ICD10 Description', name: 'ICD10 Description' },
  { id: 'Actions', name: 'Actions' },

  
 
];
public filterSettings: object;

public pageSizes: number[] = [10,15,20,50,100,250]; 
//============================Data manager===============================//
public isinitialLoad: boolean = false; 
// ===================================Other initialization===================//
//======================================new try====================//
public data: Observable<DataStateChangeEventArgs>;
public state: DataStateChangeEventArgs;
// columnsSelected: string[] = ['ID', 'Code', 'ICD10 Level', 'ICD10 Description','Actions'];
// columnsList: string[] = [ 'ID','Code', 'ICD10 Level', 'ICD10 Description','Actions'];
ICD10List: any;
cancelConfirm: boolean;
valuechange: any=[];
  deleteError: any="";
  deleteAlert: boolean=false;
  saveError:any="";
  saveAlert:boolean=false
  ListSendBO:GetICD10BO = new GetICD10BO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();

 constructor(public http: HttpClient, private formBuilder: FormBuilder,private modalService: NgbModal,@Inject(GetHTTPIcdService) public gethttp:GetHTTPIcdService,
 private ref: ChangeDetectorRef,  public global: GlobalComponent, public httpService: ICD10Service, public toastrService: ToastrService, public general: generalservice) {
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
 
    this.data=gethttp;
  this.icd10Form = this.formBuilder.group({
    code: ['', Validators.required],
    icD10Level: [''],
    icD10Description: [''],

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
  this.ListSendBO.value=state.action.currentFilterObject.value;
}
else{
if(this.type == "filtering" && state.action.action=="clearFilter"){
  this.ListSendBO.field="code";
  this.ListSendBO.matchCase=false;
  this.ListSendBO.operator="startswith";
  this.ListSendBO.value="";
}
if (this.type == "paging" && state.action.name == "actionBegin") {
  if( this.arraycol.length!=0)
  {
    if(this.arraycol[0].ICD10.Pagesize!=state.take)
    {
      this.arraycol[0].ICD10.Pagesize = state.take
         console.log( "save page size")
      this.SaveColumnwidth();
    

  }

}
}
}
this.getIcd10Codes();
}
  ngOnInit(): void {

   
    
    this.filterItems=[{key:'Code',value: 'Code'},
    {  key:'ICD10Level',value:'ICD10 Level'},
    {   key:'ICD10Description',value:'ICD10 Description'}];;
    // val.forEach(element => {
    //    this.filterItems.push(element)
    // });
  //   console.log(this.filterItems)
    this.SearchColumn.key='Code';
    this.SearchColumn.value='Code';
    if(this.ICD10input=="client")
    {
      this.clientview=true;
    }
    console.log(this.filterItems)
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.fp=new functionpermission();
    this.filepermissionget();
    this.filterSettings = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    this.getIcd10Codes();
 
    console.log(this.SearchColumn)
    // this.getTotalCount();
    // this.getColumnwidth();
    
  }

  change(args: ChangeEventArgs) {
    console.log("ChangeEventArgs",args);    
    this.initialPage = { currentPage: args.value};
}
  onActionBegin(args) { 
    
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

        this.arraycol[0].ICD10.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].ICD10.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].ICD10.ShowColumns.length != count1 || this.arraycol[0].ICD10.HideColumns.length != count) {
          this.arraycol[0].ICD10.ShowColumns = showarr;
          this.arraycol[0].ICD10.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }
  } 
  
  setDefaultValue(event) {
  
    this.SearchText = "";
    if (this.SearchColumn == undefined)
    {
      this.SearchColumn = {
        
       key: 'Code',value: 'Code',
       

      };
    }
    else
    {
      this.SearchColumn.value= this.filterItems.filter(f=>f.key==event)[0].value
    }
  }
//////////////////////////////// Search ,refresh and pagination Function////////////////////////////////////////////
  onKeydown(event) {
    if (event.key === "Enter") {
      this.Search();
    }
  }
  Search() {
    this.pagshort.currentPgNo = 1;
    // this.geticd10()
    this.ListSendBO.field=this.SearchColumn.key
    this.ListSendBO.value=this.SearchText
    this.getIcd10Codes();
    this.getTotalCount();



  }
  Refresh() {   
    this.SearchText = "";
    this.SearchColumn.key = 'Code';
    this.SearchColumn.value='Code';
    this.ListSendBO.field='Code'
    this.ListSendBO.value=''
    this.pagshort = new sortingObj();  
    this.getIcd10Codes();
    this.getTotalCount();
    this.geticd10()



  }
  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getIcd10Codes();
    this.getTotalCount();



  }
  // /////////////////////////////////////////////////////////////////
  pageItemsChage(pageitems) {
    this.pagshort.itemperpage = pageitems;
    this.getIcd10Codes();
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

  /////////////////////////////////get icd10 list data////////////////////////////////////
  geticd10() {
  
    this.httpService.sendGetRequest().subscribe((data: ICD10List[]) => {
    this.icd10Array = data;
    console.log(data);
      
     
    })
  }
  /////////////////////////////////get icd10 Create and edit data////////////////////////////////////

  IcdCreateupdate(type: string) {
    if (type == 'new') {
      this.ModelType = 'new';
      this.icd10Form.reset();
      this.icd10 = new ICD10List();
    }
    else {
      this.ModelType = 'edit';
    
    }
this.valueschanges()
  }
  /////////////////////////////////get icd10 Total Count///////////////////////////////////
  
  getTotalCount() {
    let url = "api/ICD10/GetICD10List_Count?";
    let params = new URLSearchParams();      
    params.append("SearchColumn",this.SearchColumns);
    params.append("SearchText", this.SearchText);
       this.http.get(url+params).subscribe((data: any) => {
      this.TotalCount = data; 
      console.log("total",data);
     this.initialPage.totalRecordsCount=data;

           
    }, (err:HttpErrorResponse) => {
      }
 
       )
    }
    
  /////////////////////////////////get icd10 with filter////////////////////////////////////
 
    //  getIcd10Codes() {
      
    //   // let url = "api/ICD10/GetICD10ListFilter?";
    //   let params = new URLSearchParams();
    //   params.append("SearchColumn",this.SearchColumn.key);
    //   params.append("SearchText", this.SearchText);
    //   params.append("Pageitem", this.pagshort.itemperpage.toString());
    //   params.append("Currentpageno", this.pagshort.currentPgNo.toString());
    //   params.append("OrderColumn", "ID");
    //   params.append("OrderType", "ascending");
    //   this.httpService.getIcdList(params).subscribe((data: ICD10List[]) => {
    //     this.icd10Array=data
    //    console.log(data);
    //    this.getTotalCount();
      
    //   }
    //   )}
    getIcd10Codes() {
      // this.ListSendBO.userId=this.global.userID;
      this.gethttp.execute(this.ListSendBO); 
      let count=0;
      this.data.subscribe((data:any)=>{
        count=count+1
        if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
      })   
      console.log(" this.gethttp.",this.data);
    }
  
  /////////////////////////////////Save and Update ICD10////////////////////////////////////

      SaveOrUpdateIcd10() {
        console.log(this.icd10Form.value);
      let url = "api/ICD10/SaveICD10";
        
        var saveList:ICD10List = JSON.parse(JSON.stringify(this.icd10));
       
        this.http.post(url,saveList).subscribe((data: number) => {
          console.log("====save update=========", data);

          if (data) {
            //====================== sucess message =============
            if (this.ModelType == 'new') {
              saveList.id = data;

              // this.icd10Array.push(saveList);
              this.getTotalCount()
              this.getIcd10Codes()
              this.geticd10()
              this.toastrService.success('ICD10 code has been saved successfully','ICD10 Saved')
          document.getElementById('openModal1').click();
 
            }
            else if (this.ModelType == 'edit') {
              this.getTotalCount()
              this.getIcd10Codes()
              this.geticd10()
              this.toastrService.success('ICD10 code has been updated successfully','ICD10 Updated',)
              document.getElementById('openModal1').click();

         
            } 
          }
        },(err:HttpErrorResponse) => {
          console.log("err.error", err.error);
        
          // document.getElementById('deletemodal').click();
       
             if(err)
             {
           
               this.saveError=err.error;
               console.log("err.error", this.saveError);
               this.saveAlert=true
             }
             else{
               this.saveError= JSON.stringify(err.error);
              console.log("err.error",err.error);
              
             }
           
             if (this.saveError!= "") {
               console.log("this.error",this.saveError);
               
               setTimeout(() => {
                 this.saveError = "";
                 this.saveAlert=false
               }, 5000)
             }
           }
           )
          
      }
    ////////////////////////////Delete ICD10/////////////////////////////
    deleteIcd10() {
    
        let url = "api/ICD10/DeleteICD10?";
        let params = new URLSearchParams();
        params.append("ICD10Id",this.icd10.id.toString());
        this.http.delete(url + params).subscribe((data: any) => {
          
      console.log(data);
      this.getTotalCount()
      this.getIcd10Codes()
      this.geticd10()
        this.toastrService.success("ICD10 code has been deleted successfully","ICD10 Deleted")
        document.getElementById('openModal2').click();
           
        }
        ,(err:HttpErrorResponse) => {
          console.log("err.error", err.error);
        
          document.getElementById('openModal2').click();
       
             if(err)
             {
           
               this.deleteError=err.error;
               console.log("err.error", this.deleteError);
               this.deleteAlert=true
             }
             else{
               this.deleteError= JSON.stringify(err.error);
              console.log("err.error",err.error);
              
             }
           
             if (this.deleteError!= "") {
               console.log("this.error",this.deleteError);
               
               setTimeout(() => {
                 this.deleteError = "";
                 this.deleteAlert=false
               }, 5000)
             }
           }
           )
      
      
  }
  icdDetails(icd: ICD10List) {
    this.icd10 = icd;
    console.log(icd);
    this.icd10= JSON.parse(JSON.stringify(icd));
    
  }
  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "Code");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
      console.log('data',data);
    });
  }
  //////////////////////////////////value change///////////////////////////////////////
valueschanges() {
  this.valuechange = {
    code: 0,
    icD10Level: 0,
    icD10Description: 0,
 
  
  }
}

checkpopup(value) {
  if (value == "code") {
    this.valuechange.code++;
  }
  if (value == "icD10Level") {
    this.valuechange.icD10Level++;
  } if (value == "icD10Description") {
    this.valuechange.icD10Description++;
  } 
console.log("inc",this.valuechange);

}
// ///////////////////////Cancel modal popup//////////////////////////////////////////

cancel() {


if (this.valuechange.code > 1 || this.valuechange.icD10Level > 1 || this.valuechange.lovValue > 1 ||
  this.valuechange.icD10Description > 1)
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
// document.getElementById('CloseModal').click();

}
  
 else 
  {
    document.getElementById('modal').click();
// this.showtable()
  }
}
  cancelYes()
  {
    document.getElementById('openModal1').click();
    // $("#modal").modal("hide");
    document.getElementById('openModal3').click();
  
  }
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  /////////////////////////////////client value change//////////////////////////////////////////
  valueselect(data)
  {
    console.log(data)
    this.dataFromICD10.emit(data.id)
    this.clientview=false;
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

//   cancel()
//   {

//     console.log(this.icd10Form.touched);
//     if(this.icd10Form.touched==true)
//     {
// this.UtilComponent= DialogUtility.confirm({
//         title: 'Close',
//         content: "You Want To Close Without Save?",
//         okButton: {  text: 'OK', click: this.okClick.bind(this)},
//         cancelButton: {  text: 'Cancel', click: this.cancelClick.bind(this) },
//         showCloseIcon: true,
//         closeOnEscape: true,
//         animationSettings: { effect: 'Zoom', },
//         isModal:true,
//         zIndex:1000000,
//         cssClass:'modal-edialog'
   
//     });
      
//     }
// else if(this.icd10Form.touched==false)
//     {
//   document.getElementById('modal').click();
//     }
    
//   }
 
/////////////////////////////////////////////////////////
// private okClick(): void {
//   console.log(this.UtilComponent.hide());
//   this.UtilComponent.hide()
//   document.getElementById('modal').click();
 
// }

// private cancelClick(): void {
//  this.UtilComponent.hide();

// }
//  open(content) {
//   (<any>$("#ss").modal("show"));
//     console.log(this.cancelConfirm);
    
//     this.modalService.open(content,this.modalOptions).result.then((result) => {
//       this.closeResult = `Closed with: ${result}`;
//     }, (reason) => {
//       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//     });
    
//   }

//   private getDismissReason(reason: any): string {
//     if (reason === ModalDismissReasons.ESC) {
//       return 'by pressing ESC';
//     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//       return 'by clicking on a backdrop';
//     } else {
//       return  `with: ${reason}`;
//     }
//   }

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
    
    this.ColumnArray = JSON.parse(data.column)[0].ICD10.Columns;
    

    this.grid.columns.forEach(col => {
      this.arraycol[0].ICD10.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
  //  this.grid.refreshColumns();

  this.grid.showColumns(JSON.parse(data.column)[0].ICD10.ShowColumns);
  this.grid.hideColumns(JSON.parse(data.column)[0].ICD10.HideColumns);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
    
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].ICD10.Pagesize

      this.ColumnArray.forEach(element => {

        if (element.column == 'Code') {

          const column = this.grid.getColumnByField('code'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'ICD10 Level') {

          const column1 = this.grid.getColumnByField('icD10Level'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'ICD10 Description'){

          
          const column2 = this.grid.getColumnByField('icD10Description'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;

          this.grid.refreshHeader();
        }
      
        else if (element.column == 'Actions') {

          const column3 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          console.log(this.grid);
         // column3.headerText = element.column;
          column3.width = element.width;
          this.grid.refreshHeader();

        }

      });


  });
}
SaveColumnwidth() {
  
  this.arraycol[0].ICD10.Columns = this.ColumnArray;
  this.arraycol[0].ICD10.Pagesize = this.grid.pageSettings.pageSize;
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



