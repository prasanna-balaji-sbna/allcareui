import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GlobalComponent } from 'src/app/global/global.component';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { ServiceEvaluationService } from './service-evaluation.service';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter } from '@syncfusion/ej2-grids';
import { searchfilterDetails } from '../zip-code/zip-code.model';
import { GridComponent, DataStateChangeEventArgs, PageSettingsModel, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { ServiceEvaluation, getServiceEvalBO, WhereCondition, functionpermission,columnWidth,ColumnChangeBO } from './service-evaluation.model';
import { DateService } from 'src/app/date.service';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { GetHTTPService } from './service-eval-table.service';
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-service-evaluation',
  templateUrl: './service-evaluation.component.html',
  styleUrls: ['./service-evaluation.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceEvaluationComponent implements OnInit {
  clientarrayDropDown: any = [];
  @ViewChild('grid') public grid: GridComponent;
  YESORNOList: any = [];
  getCLientErr: any = "";
  Startperiod: any = 0;
  Endperiod: any = 0;
  OrderType: any = "descending";
  SearchColumn: any = "FirstName";
  SortColum: any = "Ages";
  isDesc: boolean = false;
  SearchText: string = '';
  pageitems: number = 20;
  p: number = 1;
  ClientArray:ServiceEvaluation[];
  clientId: any;
  public height = '220px';
  datalength:number=0
  ////////////////////////////////////////////////////////////////
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  filter: IFilter;  
  Filter_drop: searchfilterDetails;
  newEvaluationForm:FormGroup 
  ServiceEvaluation:ServiceEvaluation=new ServiceEvaluation()
  isClientSearch: boolean = false;
  TotalCount: number;
  TotalCount_byId: number;
  clientId_ClientSelect: any=0;
  cliName: any;
  isSelect: boolean = false;
  period: any;
  clientNotes: any;
  itemById: boolean = false;
  clientId_by: any;
  serviceId: any;
  ClientChild: any = [];
  getCLientErrChild: any = '';
  newintakeform: boolean = false;
  getServiceEvalBO:getServiceEvalBO=new getServiceEvalBO()
  public dropdata: string[]  ;
  SaveErr: any = "";
  saveWithDate:boolean=false
  fp:functionpermission;
////////////////////////////////
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];

  ///////////////////////////////////date picker Options ///////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
   disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true,
    height:'30px'
  };
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  initialPage: PageSettingsModel;
  filterOptions: FilterSettingsModel;
  public filterSettings: object;
  public pageSizes: number[] = [10,15,20,50,100,250]; 
  ages:number
  formatOptions: object;
  constructor(public http: HttpClient, private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
  private ref: ChangeDetectorRef,public global: GlobalComponent,  public toastrService: ToastrService,private datepipe: DatePipe,public dateservice: DateService, public general: generalservice,public httpService: ServiceEvaluationService) {
    //   ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
      this.data=gethttp;
   
      this.newEvaluationForm = this.formBuilder.group({
        clientId: ['',Validators.required],
        reviewDate: ['',Validators.required],
        callDate: ['',Validators.required],
        isAnsweredCall: [''],
        isPCAPresent:[''],
        notes: [' ']
      });
     }

  ngOnInit(): void {
    this.toolbar = ['ColumnChooser']; 
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.fp=new functionpermission();
    this.filepermissionget();
    this.filterSettings = { type: 'Menu',
   };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};

    this.getClient()
    // this.gettoltaliteam();
    this.getyesOrNo()
    // this.getTotalCount()
    this.getServiceFilter()
    // this.getColumnwidth();

  }
  type:string="";
  public dataStateChange(state): void {
  console.log("Stats chage",state);    
  this.type = (state.action.requestType).toString();
  if(this.type!="filterchoicerequest"){
    if ((state.sorted || []).length) {
      this.getServiceEvalBO.orderColumn = state.sorted[0].name;
      this.getServiceEvalBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
    }   
   }
  
  if(this.type == "filtering" && state.action.action!="clearFilter"){
    console.log(state.action.currentFilterObject.field)
    if(state.action.currentFilterObject.field=="isPCAPresent"||state.action.currentFilterObject.field=="isAnsweredCall")
    {
      console.log(state.action.currentFilterObject.value)
      if(state.action.currentFilterObject.value=="Yes")
      {
        this.getServiceEvalBO.value="true"
      }
      else  if(state.action.currentFilterObject.value=="No")
      {
        this.getServiceEvalBO.value="false"
      }
      else{
        this.getServiceEvalBO.value="";
      }

      
    }
    else{
      this.getServiceEvalBO.value=state.action.currentFilterObject.value.toString();
    }
      this.getServiceEvalBO.field=state.action.currentFilterObject.field;
      this.getServiceEvalBO.matchCase=state.action.currentFilterObject.matchCase;
      this.getServiceEvalBO.operator=state.action.currentFilterObject.operator;
  //    this.getServiceEvalBO.value=state.action.currentFilterObject.value.toString();
  }
  else{
    if(this.type == "filtering" && state.action.action=="clearFilter"){
      this.getServiceEvalBO.field="firstName";
      this.getServiceEvalBO.matchCase=false;
      this.getServiceEvalBO.operator="startswith";
      this.getServiceEvalBO.value="";
      this.getServiceEvalBO.type="string";
    }
  }
  this.getServiceEvalBO.agencyId=parseInt(this.global.globalAgencyId);
  this.getServiceFilter();
  if (this.type == "paging" && state.action.name == "actionBegin") {
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].ServiceEvaluation.Pagesize!=state.take)
      {
        this.arraycol[0].ServiceEvaluation.Pagesize = state.take
        this.SaveColumnwidth();
      // }

    }
  
  }
  }

}
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

  
    var count = 0;
    var count1 = 0;
    if (args.columns.length > 0) {
if(this.arraycol.length >0){
this.arraycol[0].ServiceEvaluation.ShowColumns.forEach(old => {
  showarr.forEach(element => {
    if (old == element) {
      count1 = count1 + 1;
    }
  });

});

this.arraycol[0].ServiceEvaluation.HideColumns.forEach(old => {
  hidearr.forEach(element => {
    if (old == element) {
      count = count + 1;
    }
  });

});

if (this.arraycol[0].ServiceEvaluation.ShowColumns.length != count1 || this.arraycol[0].ServiceEvaluation.HideColumns.length != count) {
  this.arraycol[0].ServiceEvaluation.ShowColumns = showarr;
  this.arraycol[0].ServiceEvaluation.HideColumns = hidearr;
  this.SaveColumnwidth();
}
}
   
     
    }
  }

  this.getServiceEvalBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
  this.getServiceEvalBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
  this.conditionlist=[];
  if(args.requestType==="filtering" && args.action==="filter"){
    args.columns.forEach(element => {
      this.conditionlist.push(element.properties);
      console.log("args type",this.conditionlist);
    }); 
  } 
  if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
{
  this.getServiceEvalBO.type=args.columnType
  console.log(this.getServiceEvalBO.type);
  
  console.log( this.getServiceEvalBO)
}
}
//========================================//
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
//=====================================================//
  getClient() {

    // let url = "api/Client/GetClientForServiceEvaluation?";
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.httpService.getClientDropdown(params).subscribe((data: any = []) => {
      this.clientarrayDropDown = data;
      console.log("clientarrayDropDown",this.clientarrayDropDown);
      
      this.clientarrayDropDown.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      })
    },
      (err: HttpErrorResponse) => {
        this.getCLientErr = "";
        this.getCLientErr = err.error;
        if (this.getCLientErr != "") {
          setTimeout(function () {
            this.getICD10CodesErr = "";
          }.bind(this), 8000);
        }
      })
  }
  //////////////////////////////////Search///////////////////////////////////////////////////////
  onSearch() {
    this.isClientSearch = true;
    // this.gettoltaliteam();
    // this.getTotalCount();
  // this.getServiceEvalBO.field=this.clientId_ClientSelect
  console.log(this.clientId);
  console.log(this.ages);
  console.log(this.period);
  this.getServiceEvalBO.startperiod=this.period
  // this.getServiceEvalBO.value=this.period;
  this.getServiceEvalBO.clientId=this.cliName
  this.getServiceFilter()
// this.gettoltaliteam()

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  Refresh() {
    this.isClientSearch = false;
    this.clientId = 0;
    this.clientId_ClientSelect = 0;
    this.cliName = '';
    this.SearchText = '';
    this.period = '';
    this.Startperiod = 0;
    this.Endperiod = 0;
    this.isSelect = false;
    this.getServiceEvalBO.field="firstName";
    this.getServiceEvalBO.matchCase=false;
    this.getServiceEvalBO.operator="startswith";
    this.getServiceEvalBO.value="";
    this.getServiceEvalBO.type="string";
    this.getServiceEvalBO.pageitem=10;
    this.getServiceEvalBO.currentpageno=1;
    this.grid.pageSettings.currentPage=1;
    this.grid.pageSettings.pageSize=10;
   // this.gettoltaliteam();
    this.isClientSearch = false;
   // this.getTotalCount();
    this.getServiceFilter()
    

  }
  onActionBegin(args) { 
    
  }
 
  // ////////////////////Show Column Chooser//////////////////////////

  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
   ////////////////////////////////////Get Api Fun//////////////////////////////////

  SelectPeriod(value) {

    this.getServiceEvalBO.startperiod=this.Startperiod = 30;
    this.getServiceEvalBO.endperiod=this.Endperiod = +value + 30;
  this.ages=value
  console.log(this.ages);

  }
  /////////////////////////////////////////////////get total count////////////////////////////////////
 

  getTotalCount() {
    let url = "api/ServiceEvaluation/GetServiceEvaluationCount?";
    let params = new URLSearchParams();
    this.clientId = this.clientId == undefined ? 0 : this.clientId;
    params.append("SearchColumn", this.SearchColumn);
    params.append("SearchText", this.SearchText);
    params.append("clientId", this.clientId);
    params.append("agencyId", this.global.globalAgencyId);
    params.append("Startperiod", this.Startperiod);
    params.append("Endperiod", this.Endperiod);
    this.http.get(url + params).subscribe((data: any) => {
      this.TotalCount = data;
      console.log("total",data);
      
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getCLientErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getCLientErr = JSON.stringify(err.error);

      }

      if (this.getCLientErr != "") {
        setTimeout(() => {
          this.getCLientErr = "";
        }, 8000)
      }

    })
  }
  /////////////////////////////////////////////////get total item/////////////////////////////////////
   gettoltaliteam() {
     // this.getTotalCount();
     let params = new URLSearchParams();
     this.clientId = this.clientId == undefined ? 0 : this.clientId;
     // params.append("AgencyId", this.agencyId.toString());
     params.append("SearchColumn", this.SearchColumn);
     params.append("SearchText", this.SearchText);
     params.append("Pageitem", this.pageitems.toString());
     params.append("Currentpageno", this.p.toString());
     params.append("OrderColumn", this.SortColum);
     params.append("OrderType", this.OrderType);
     params.append("clientId", this.clientId);
     params.append("agencyId", this.global.globalAgencyId);
     params.append("Startperiod", this.Startperiod);
     params.append("Endperiod", this.Endperiod);
 
     this.httpService.gettoltaliteam(params).subscribe((data: any) => {
 
       this.ClientArray = data;
       console.log("ClientArray",data);
       
 
       let myDate: any = new Date();
       this.ClientArray.forEach(element => {
        element.name=element.lastName+", "+element.firstName;

         if (element.phone != null) {

          //  element.phone = this.phoneNoFormat.getPhoneNumber(element.phone);
          //  element.phone = this.phoneNoFormat.phoneNoToFormat(element.phone);
 
 
         }
         element.callDate = element.callDate != null ? new Date(element.callDate).toLocaleDateString() : null;
         element.reviewDate = element.reviewDate != null ? new Date(element.reviewDate).toLocaleDateString() : null;
         // element.ages =element.callDate != null ?  myDate.valueOf()  - element.callDate.valueOf():null;
         if (element.reviewDate == "1/1/1") {
           element.reviewDate = "";
         }
         if (element.isAnsweredCall == true) {
          //  element.isAnsweredCall = "Yes";
         }
         else if (element.isAnsweredCall == false) {
          //  element.isAnsweredCall = "No";
         }
 
       })
 
     }, (err: HttpErrorResponse) => {
 
       this.getCLientErr = "";
       this.getCLientErr = JSON.stringify(err.error);
 
       if (this.getCLientErr != "") {
         setTimeout(() => {
           this.getCLientErr = "";
         }, 8000)
       }
 
     })
   }
   //////////////////////////////////////////Client select////////////////////////////////////////////////////
   ClientSelect() {
    this.clientId_ClientSelect = this.cliName;
    this.clientId = this.cliName;
    // this.SearchText =this.SearchText;
    // this.SearchColumn = "ClientId";
    if (this.cliName != undefined) {
      this.isSelect = true;
    }
    else {
      this.isSelect = false;
    }

  }
  ///////////////////////////////////////////////// Date Change Fun///////////////////////////////////////////////
  newdates(event, names) {
    if (names == "inputchage") {
    
      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
       
          this.ServiceEvaluation.reviewDate = val1;
      } 
    }
    if (names == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        
          this.ServiceEvaluation.reviewDate  = val1;
        
      }
    }
    }
///////////////////////////////////////// Call date ///////////////////////////////////////////////////
newdates1(event, names) {
  if (names == "inputchage") {
  
    let val = this.dateservice.inputFeildchange(event);
    if (val != undefined) {
      let val1 = this.dateservice.inputFeildchange(event);
     
        this.ServiceEvaluation.callDate = val1;
    } 
  }
  if (names == "datechagned") {
    let val = this.dateservice.Datechange(event);
    if (val != undefined) {
      let val1 = this.dateservice.Datechange(event);
      
        this.ServiceEvaluation.callDate  = val1;
      
    }
  }
  }
   
////////////////////////////////yes/No list////////////////////////////////////////
getyesOrNo() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "YESORNO");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {

    this.YESORNOList = data;

    data.forEach(element => {
      if (element.Value == "Yes") {
        element.Key = true;
      }
      else if (element.Value == "No") {
        element.Key = false;
      }

    });
    this.dropdata=data.map(e=>e.Value);
    
    // this.YESORNOList.push({ Key: 0, Value: "All" });

  },
    (err: HttpErrorResponse) => {

      this.getCLientErr = "";
      this.getCLientErr = JSON.stringify(err.error);

      if (this.getCLientErr != "") {
        setTimeout(() => {
          this.getCLientErr = "";
        }, 8000)
      }

    })
}
//////////////////////////////////// Close Modal Function ////////////////////////////////////////////////////
Close()
{
  document.getElementById('OpenModal1').click()
  this.newEvaluationForm.reset();
  this.ServiceEvaluation=new ServiceEvaluation()
}

  //////////////////////////////////// Service Evaluation SAVE API Fun////////////////////////////////

  SaveOrUpdateService() {
    let url = 'api/ServiceEvaluation/SaveServiceEvaluation';
    var listParam:ServiceEvaluation = JSON.parse(JSON.stringify(this.ServiceEvaluation));
    let calldate = this.ServiceEvaluation.callDate;
    let reviewDate = this.ServiceEvaluation.reviewDate;
    listParam.clientId =this.ServiceEvaluation.clientId;
    listParam.reviewDate=new Date(new Date(this.ServiceEvaluation.reviewDate).toLocaleDateString() + " "+ "00:00:000" + " " + "GMT").toISOString(),
    listParam.callDate=new Date(new Date(this.ServiceEvaluation.callDate).toLocaleDateString() +" "+ "00:00:000" + " " + "GMT").toISOString(),
    console.log(listParam);
    if(listParam.notes==null)
    {
      listParam.notes=""
    }

      if (((this.ServiceEvaluation.reviewDate != null && this.ServiceEvaluation.reviewDate != "") &&
     (this.ServiceEvaluation.callDate != null && this.ServiceEvaluation.callDate != ''))
     && new Date(this.ServiceEvaluation.reviewDate ) > new Date(this.ServiceEvaluation.callDate)) {
       this.SaveErr ="";
       this.ServiceEvaluation.reviewDate = reviewDate!= null ? new Date(reviewDate).toLocaleDateString():null;
       this.ServiceEvaluation.callDate = new Date(calldate).toLocaleDateString();
     this.SaveErr ="Call date must be larger than review date"; 
     if (this.SaveErr != "") {
       setTimeout(function () {
        this.saveWithDate=true
         this.SaveErr = "";
       }.bind(this), 8000);
     }
   }

  else {
    this.http.post(url,listParam).subscribe((data: any) => {
    this.toastrService.success('Saved SuccessFully')
     console.log("data",data);
     this.newEvaluationForm.reset();
     this.ServiceEvaluation=new ServiceEvaluation()
     document.getElementById('OpenModal1').click()
    //  this.getItemBy(listParam.clientId)
     this.getServiceFilter()
     this.getTotalCount()
     this.ServiceEvaluation.id = data;
    //  this.ClientChild.push(data) 
  }
  )
  }
   
  }
 //////////////////////////////////datechanged event/////////////////////////////
 dateFormateyyyyMMdd(date){
  console.log("date format",date.formatted);
  if(date.formatted!=null)
  {
    let day = date.formatted.substring(0,2);
    let month = date.formatted.substring(3,5);
    let year = date.formatted.substring(6,10);
    let days=+day;
    let months=+month;
    let years=+year;

    let newDate = new Date();
    newDate.setDate(days);
    newDate.setMonth(months-1);
    newDate.setFullYear(years);
    console.log(newDate);
    return this.datepipe.transform(newDate,"yyyy-MM-dd")
  }
}
/////////////////////////////////////////// new evalutaion/////////////////////////////////////
CreateServiceEvaluation(client) {
  this.newEvaluationForm.reset();
  // this.newclient = {
  //   clientId: '',
  //   reviewDate: '',
  //   callDate: '',
  //   isAnsweredCall: '',
  //   notes: '',
  // };
 
  // this.dialogService.open(value);
  // this.valueschanges();
  //console.log(client);
  this.ServiceEvaluation=new ServiceEvaluation();
  console.log(client)
  
  console.log();
  
}
EditServiceEvaluation(client:ServiceEvaluation)

{
 //console.log(this.ServiceEvaluation.id);
 this.ServiceEvaluation= new ServiceEvaluation();
//this.ServiceEvaluation=client
// console.log(client);
// console.log(this.clientId_ClientSelect);
// this.ServiceEvaluation= JSON.parse(JSON.stringify(client));
// setTimeout(() => {
//   this.ServiceEvaluation.reviewDate = new Date(client.reviewDate).toLocaleDateString()
//   this.ServiceEvaluation.callDate = new Date(client.callDate).toLocaleDateString()

// }, 400);
if (this.clientId_ClientSelect != 0) {
  this.ServiceEvaluation.clientId = this.clientId_ClientSelect;
}
if (client.clientId != 0) {
  this.ServiceEvaluation.clientId = client.clientId;
}
console.log(this.ServiceEvaluation);

if (this.ServiceEvaluation.reviewDate == "") {
  client.reviewDate = new Date()//
  
}
if (this.ServiceEvaluation.callDate == null) {
  client.callDate = new Date()
  
}


}
showIntakeData() {
  this.newintakeform = true;
}
////////////////////////////////////////////Notes view/////////////////////////////////////////////////////
notesParticularCLi(client) {
  this.clientNotes = client.notes;
  // this.dialogService.open(notes);
}
///////////////////////////////////////////////// previous data ////////////////////////////////////////////////////
ShowPreviousCli(client:ServiceEvaluation) {
  // this.dialogService.open(showNotes);
console.log("clientid",client.clientId);
console.log("clientid",client);

  this.serviceId = client.id;
  this.getItemBy(client.clientId);
  this.getTotalCountById(client.clientId);
  this.clientId_by = client.clientId;
  this.itemById = true;
  console.log();
  

}
 //////////////////////////Get Service Evaluation By Client Id//////////////////////////

 getItemBy(client) {
   // this.getTotalCount();
  //  console.log(clientID);
  this.clientId_by = this.clientId_by == undefined ? 0 : this.clientId_by;
  console.log("clientid",client );
  
   let params = new URLSearchParams();
  //  clientID = clientID == undefined ? 0 : clientID;
   let url = "api/ServiceEvaluation/GetServiceEvaluationById?";
   // params.append("AgencyId", this.agencyId.toString());
   params.append("SearchColumn", this.getServiceEvalBO.field);
   params.append("SearchText", this.getServiceEvalBO.value);
   params.append("Pageitem", this.getServiceEvalBO.pageitem.toString());
   params.append("Currentpageno", this.getServiceEvalBO.currentpageno.toString());
   params.append("OrderColumn", this.getServiceEvalBO.orderColumn);
   params.append("OrderType", this.getServiceEvalBO.orderType);
   params.append("clientId", client );
   params.append("agencyId", this.global.globalAgencyId);
   params.append("Id", this.serviceId);
   this.http.get(url + params).subscribe((data: any) => {
     this.ClientChild = data;
     console.log("ClientChild",data);
    //  this.getTotalCountById()
     this.ClientChild.forEach(element => {
       element.callDate = element.callDate != null ? new Date(element.callDate).toLocaleDateString() : null;
       element.reviewDate = element.reviewDate != null ? new Date(element.reviewDate).toLocaleDateString() : null;
       element.isAnsweredCall= element.isAnsweredCall!=null? element.isAnsweredCall==true?"yes":"No":null;
       element.isPCAPresent= element.isPCAPresent!=null? element.isPCAPresent==true?"yes":"No":null;
     });
   }, (err: HttpErrorResponse) => {

     this.getCLientErrChild = "";
     this.getCLientErrChild = JSON.stringify(err.error);

     if (this.getCLientErrChild != "") {
       setTimeout(() => {
         this.getCLientErrChild = "";
       }, 8000)
     }

   })
 }
  ////////////////////////Total Count By CLient Id//////////////////////////

  getTotalCountById(client) {
    this.clientId_by = this.clientId_by == undefined ? 0 : this.clientId_by;
    console.log("clientid-total",client);
    
    let url = "api/ServiceEvaluation/GetServiceEvaluationById_Count?";
    let params = new URLSearchParams();
    params.append("SearchColumn", this.getServiceEvalBO.field);
    params.append("SearchText", this.getServiceEvalBO.value);
    params.append("clientId", client);
    params.append("agencyId", this.global.globalAgencyId);
    params.append("Id", this.serviceId);
    this.http.get(url + params).subscribe((data: any) => {
      this.TotalCount_byId = data;
      console.log(" this.TotalCount_byId",data);
      
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.getCLientErr = JSON.stringify(err.error.errors);
      }
      else {
        this.getCLientErr = JSON.stringify(err.error);

      }

      if (this.getCLientErr != "") {
        setTimeout(() => {
          this.getCLientErr = "";
        }, 8000)
      }

    })
  }
  ///////////////////////////////////////print/////////////////////////////////////////////
  getServiceFilter() {
    
    // let listId=parseInt(this.list.value)
    this.getServiceEvalBO.startperiod=parseInt(this.Startperiod)
    console.log(this.global.globalAgencyId);
    this.getServiceEvalBO.agencyId=parseInt(this.global.globalAgencyId)
    this.getServiceEvalBO.clientId=this.clientId
    this.gethttp.execute(this.getServiceEvalBO); 
    let count=0
    this.data.subscribe((data:any)=>{console.log(data.count)
      count= count+1
      if(data!=null&& data!=undefined &&count==1 )
    {
      this.getColumnwidth();
    }
      this.datalength=data.count
    })   
    console.log(" this.gethttp.",this.data);
  }
  //////////////////////////////// Function Permission ///////////////////////////////////////
  filepermissionget() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermission?";
    params.append("pagecode", "ServiceVerification");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
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
     
    )
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
    
    this.ColumnArray = JSON.parse(data.column)[0].ServiceEvaluation.Columns;

  
  //  this.grid.refreshColumns();

  let showcol = JSON.parse(data.column)[0].ServiceEvaluation.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].ServiceEvaluation.HideColumns
    

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
    
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].ServiceEvaluation.Pagesize

      this.ColumnArray.forEach(element => {

        if (element.column == 'Client name') {

          const column = this.grid.getColumnByField('firstName'); // get the JSON object of the column corresponding to the field name
         
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Phone') {

          const column1 = this.grid.getColumnByField('phone'); // get the JSON object of the column corresponding to the field name
         
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Age(in days') {

          const column2 = this.grid.getColumnByField('ages'); // get the JSON object of the column corresponding to the field name
        
          column2.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Last call date') {

          const column3 = this.grid.getColumnByField('callDate'); // get the JSON object of the column corresponding to the field name
         
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Last call status') {

          const column3 = this.grid.getColumnByField('isAnsweredCall'); // get the JSON object of the column corresponding to the field name
       
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Last reviewed date') {

          const column3 = this.grid.getColumnByField('reviewDate'); // get the JSON object of the column corresponding to the field name
         
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Last reviewed by') {

          const column3 = this.grid.getColumnByField('reviewedBy'); // get the JSON object of the column corresponding to the field name
         
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'PCA Employee Present') {

          const column3 = this.grid.getColumnByField('isPCAPresent'); // get the JSON object of the column corresponding to the field name
         
          column3.width = element.width;

          this.grid.refreshHeader();
        }

        else if (element.column == 'Actions') {

          const column4 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          
          column4.width = element.width;
          this.grid.refreshHeader();

        }

      });


  });
}

SaveColumnwidth() {
  
  this.arraycol[0].ServiceEvaluation.Columns = this.ColumnArray;
  this.arraycol[0].ServiceEvaluation.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
} 
