import { Component, OnInit, ViewChild, TemplateRef, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { ToastrService } from 'ngx-toastr';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { searchfilterDetails } from '../zip-code/zip-code.model';
import { ImportreturnBO, Invoice835BO, ImportBO, GetListBO, WhereCondition, returnimport835 } from './import.model';
import { Observable } from 'rxjs';
import { GetHTTPImportService } from './import-table.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
import {ImportService} from './import.service';
declare var $:any;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('pdflist') pdflist;
////////////////////// Variable for Import ///////////////////////////////////////////
  fileToUpload: any = "";
  selectedFileName: any = "";
//===================== Grid View Declarations ========================================//
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  filterOptions: FilterSettingsModel;
  filter: IFilter;  
  Filter_drop: searchfilterDetails;
//===================== local var ========================================//
  Report83: any;
  pageitems: number = 20;
  p: number = 1;
  TotalCount: number;
  Importarray: ImportreturnBO[];
  getErr: any = "";
  downloadarray: any = [];
  Report835: any;
  onDOCFileChangedErr: any = ""
  Importreturn:ImportreturnBO=new ImportreturnBO()
  filepath: string;
  viewFiles:boolean=false
  Import: ImportBO=new ImportBO() ;
  serviceLineDetail:any;
  public pageSizes: number[] = [10,15,20,50,100,250]; 
  initialPage: PageSettingsModel;
  clientview:boolean=false;
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  public filterSettings: object;
  ListSendBO:GetListBO = new GetListBO();

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  constructor(public http: HttpClient,public global: GlobalComponent,  public httpService: ImportService ,public toastrService: ToastrService,@Inject(GetHTTPImportService) public gethttp:GetHTTPImportService,
  private ref: ChangeDetectorRef) { 
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
  this.data=gethttp;
  }
  ngOnInit(): void {
    // this.SearchColumn.key = 'lovCode';
    // this.SearchColumn.value = 'LovCode';
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    // this.fp=new functionpermission();
    // this.filepermissionget();
    this.filterSettings = { type: 'Menu',
   };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    // this.getImportarray()
    this.getTotalCount()
    this.getImportFilter()
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
      this.ListSendBO.field="fileName";
      this.ListSendBO.matchCase=false;
      this.ListSendBO.operator="startswith";
      this.ListSendBO.value="";
      this.ListSendBO.type="string";
    }
  }
  this.ListSendBO.agencyID=parseInt(this.global.globalAgencyId);
  this.getImportFilter();
  if (this.type == "paging" && state.action.name == "actionBegin") {
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].Import.Pagesize!=state.take)
      {
        this.arraycol[0].Import.Pagesize = state.take
           console.log( "save page size")
        this.SaveColumnwidth();
      // }

    }
  
  }
  }
}
////////////////////////////// Action Complete Functionn /////////////////////////////////////
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
    this.arraycol[0].Import.ShowColumns.forEach(old => {
      showarr.forEach(element => {
        if (old == element) {
          count1 = count1 + 1;
        }
      });
  
    });
  
    this.arraycol[0].Import.HideColumns.forEach(old => {
      hidearr.forEach(element => {
        if (old == element) {
          count = count + 1;
        }
      });
  
    });
    console.log(count, count1, "count");
  
  
    if (this.arraycol[0].Import.ShowColumns.length != count1 || this.arraycol[0].Import.HideColumns.length != count) {
      this.arraycol[0].Import.ShowColumns = showarr;
      this.arraycol[0].Import.HideColumns = hidearr;
      this.SaveColumnwidth();
    }
  }
    
    }
  }
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
  
} 
////////////////////////////// File uPload /////////////////////////////////////

  onFileChanged(file) {
    // this.fileToUpload.fileName=file.item(0).name;
    console.log(this.filepath)
    console.log(file);
    this.fileToUpload = file.item(0);
    this.selectedFileName = file.item(0).name;
    console.log(this.selectedFileName);
 // const file = event.target.files[0];
    // $('.custom-file-input').on('change', function () {
    //   let fileName = $(this).val().split('\\').pop();
    //   console.log(fileName);
    //   $(this).siblings('.custom-file-label').addClass("selected").html(fileName);
    // });
    
  }
  ////////////////////////////// Save importFile/////////////////////////////////////

  onDOCFileChanged() {
    // this.fileToUpload = files.item(0);
    this.Importreturn.fileName=this.fileToUpload.name
    this.selectedFileName = this.fileToUpload.name;
    console.log(this.fileToUpload);
    console.log(this.fileToUpload.name);
    console.log(this.Importarray);
    let body = new FormData();
    body.append('Filepath', this.fileToUpload);
   console.log("body",body);  
    let url = "api/Import/SaveImport";
    this.http.post(url, body).subscribe(
      (data: returnimport835) => {

        this.Report835 = data.invoice;
        console.log(  this.Report835)
        console.log(  data.invoice)
     if(  data.invoice !=null)
     {
       console.log("inside if")
       this.viewFiles=true
       document.getElementById("openModal1").click();
     }
        // this.dialog.open(temp);
        console.log(data);
        this.getImportFilter()
        if(data.error!=null&&data.error!=undefined&&data.error!="")
        {
          this.onDOCFileChangedErr = data.error;
          setTimeout(function () {
            this.onDOCFileChangedErr = "";
          }.bind(this), 8000);
        }
        this.toastrService.success(
          "File has been imported successfully",
          "File imported",
        ), 8000
       
      
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.onDOCFileChangedErr = "";
        this.onDOCFileChangedErr = err.error;
        if (this.onDOCFileChangedErr != "") {
          setTimeout(function () {
            this.onDOCFileChangedErr = "";
          }.bind(this), 8000);

        }
      }
    );
  }
////////////////////////////// Download Report/////////////////////////////////////

  kendopdfdownloadList() {
  //  this.pdflist.drawing.drawDOM
    this.pdflist.A4 = true,
      this.pdflist.portrait = true,
      this.pdflist.keepTogether = ".prevent-split",
      this.pdflist.scale = 0.8,
      this.pdflist.margin= { left: "0.6cm", top: "0.4cm", right: "0.6cm", bottom: "3cm" }
    // this.pdflist.template='<div class="kendofooter"><div style="float: right">Page  This is a header.</div>';
      // this.pdflist.forcePageBreak = ".page-break",
      this.pdflist.saveAs("837Report" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
  }
////////////////////////////// Pagination and Refresh ///////////////////////////////////

  paginationChange(event) {
    this.p = event;
    this.getImportarray();

  }
  pageItemsChage(pageitems) {
    this.pageitems = pageitems;
    this.getImportarray();
    this.getTotalCount();

  }
  Refresh()
  {
    this.fileToUpload = '';
    this.ListSendBO.field='fileName';
    this.ListSendBO.value=''
    this.selectedFileName=''
    this.getImportFilter();
    this.getTotalCount();
  }
//////////////////////////////IMportArray/////////////////////////////////////
  getImportarray() {
    // this.getTotalCount();
    let params = new URLSearchParams();
    let url = "api/Import/GetImport?";
    params.append("agencyId", this.global.globalAgencyId);
    params.append("Pageitem", this.pageitems.toString());
    params.append("Currentpageno", this.p.toString());
    this.http.get(url + params).subscribe((data: ImportreturnBO[]) => {
     this.Importarray=data
      console.log("file",data);

      // data.forEach(element => {
       
      //   // element.fileName="ssss"
        
      //   if (element.fileName != "" && element.fileName != null  && element.fileName != undefined) {
      //     this.Importarray.push(element);
          
      //   }
      // });

      console.log( this.Importarray);
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getErr = JSON.stringify(err.error);
      }
      if (this.getErr != "") {
        setTimeout(() => {
          this.getErr = "";
        }, 8000)
      }

    })
  }
//////////////////////////////Total Count /////////////////////////////////////

  getTotalCount() {
    // this.getTotalCount();
    let params = new URLSearchParams();
    let url = "api/Import/GetImportDataCount?";
    this.http.get(url + params).subscribe((data: any) => {
      this.TotalCount = data;
      console.log(data);
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getErr = JSON.stringify(err.error);
      }
      if (this.getErr != "") {
        setTimeout(() => {
          this.getErr = "";
        }, 8000)
      }
    })
  }
//////////////////////////////Download File /////////////////////////////////////

  downloadfile(data) {
    // this.getTotalCount();
    let params = new URLSearchParams();
    let url = "api/Import/GetImportFileDownload?";
    console.log();
    console.log(this.Importreturn.fileName);
    params.append("agencyId", this.global.globalAgencyId);
    params.append("FileName", data.fileName);
    params.append("FolderName",  data.folderName);
    this.http.get(url + params).subscribe((data: any) => {
      this.downloadarray = data; 
      console.log("downloadarray",data);
      if (data.length != 0) {
        data.forEach(element => {
          console.log(element.uploadurl);
          this.downloadImportFile(element.uploadurl);
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getErr = JSON.stringify(err.error);

      }
      if (this.getErr != "") {
        setTimeout(() => {
          this.getErr = "";
        }, 8000)
      }

    })
  }
////////////////////////////// View popup/////////////////////////////////////
  viewFile(data)
  {
  console.log(data);
    let params = new URLSearchParams();
    let url = "api/Import/GetInvoice835?";
    params.append("Claim_835Id",data.id);
    this.http.get(url + params).subscribe((data: any) => {
      this.Report835 = data;
      console.log("Report835",data);
   
      $('#viewmodal').modal({
        show: true,
        zIndex:1000000
    })
this.viewFiles=true
console.log(this.Report835.payorDetail.payorName);
console.log(this.Report835.patient_ClaimDetail.patient);
this.Report835.patient_ClaimDetail.forEach(element => {
  this.serviceLineDetail=element.serviceLineDetail
  console.log("serviceLineDetail",this.serviceLineDetail);
  
});
 }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getErr = JSON.stringify(err.error);

      }
      if (this.getErr != "") {
        setTimeout(() => {
          this.getErr = "";
        }, 8000)
      }

    })

  }
////////////////////////////// Download /////////////////////////////////////
downloadImportFile(file) {
    console.log(file);
    if (file != null) {
      window.open(file);
    }

  }
////////////////////////////// Show Column Chooser /////////////////////////////////////
show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
//////////////////////////////Get Import  Array with Filters /////////////////////////////////////
 getImportFilter() {
    // let listId=parseInt(this.list.value)
    console.log(this.global.globalAgencyId);
    this.ListSendBO.agencyID=parseInt(this.global.globalAgencyId)
    this.gethttp.execute(this.ListSendBO); 
    let count=0  
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
    }) 
    console.log(" this.gethttp.",this.data);
  }
//============================ tooltip For header ===================================//
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
///////////////////////////////////////////////

getColumnwidth() {
 
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Import.Columns;


    let showcol = JSON.parse(data.column)[0].Import.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Import.HideColumns
  

 //   this.grid.showColumns(showcol);
    this.grid.hideColumns(hidecol);
    //  this.grid.refreshColumns();

    
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Import.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Import Id') {

        const column = this.grid.getColumnByField('id'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'File Name') {

        const column1 = this.grid.getColumnByField('fileName'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });

}
SaveColumnwidth() {
 
  this.arraycol[0].Import.Columns = this.ColumnArray;
  this.arraycol[0].Import.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}
