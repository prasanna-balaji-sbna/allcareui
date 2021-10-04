import { Component, OnInit, TemplateRef, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { parse, stringify } from 'querystring';
import { GlobalComponent } from "../../global/global.component";
import { IMyDpOptions } from 'mydatepicker';
import { DateService } from '../../date.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DataStateChangeEventArgs, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Sorts, DataResult } from '@syncfusion/ej2-angular-grids';
import { GroupPayorService } from './group-payor-service.service';
import { GroupPayorServiceTableBO, sortingObj, grp, filters, GetGroupPayorServiceBO, WhereCondition, functionpermission, columnWidth, ColumnChangeBO } from './group-payor-service.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogUtility, Tooltip } from '@syncfusion/ej2-angular-popups';
import { url } from 'inspector';
import { Observable } from 'rxjs';
import { GetHTTPService } from '../group-payor-service/group-payor-servicetable.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonHttpService } from 'src/app/common.service';

declare var $:any;

@Component({
  selector: 'app-group-payor-service',
  templateUrl: './group-payor-service.component.html',
  styleUrls: ['./group-payor-service.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupPayorServiceComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;



  filterOptions: FilterSettingsModel;
  private UtilComponent: any;


  // filter: IFilter;
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  // Filter_drop: searchfilterDetails;
  searchText:any="";
  searchColumn:any="groupName";
  // filterItems: {
  //    'Group','Payor','Service',
  //   'Net Rate',
  //   'Service Location',
  //   'Facility Name',
  //  'Facility Address1',
  //  'Facility ID',
  //   'Billing Unit',
   
  // };
  public sortColumn:any="id";
  public orderType:any="asc";
  public isDesc:any=false;
  SearchText: string = ''; 
  SearchColumn: { [key: string]: string } = {'groupName': 'Group'};
  ///////////////-===================Table initializations==========// 
  togglebool:boolean=false
  pageSize:any=20;
  perPage:any=20;
  currentPage:any=1;
  totalPage:any;
  pagshort: sortingObj = new sortingObj(); 
  GroupPayorService: GroupPayorServiceTableBO = new GroupPayorServiceTableBO();
  GroupPayorServiceArray: GroupPayorServiceTableBO[];
  grp:grp=new grp;
  billingUnit: any=[];
  billingUnit1:any=[];
  groupUnit:any[];
  // fp: functionpermission ;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
   // disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true,
    height:'30px'
  };
  SearchColum: string = 'groupName';

  Filter_Group: string = '';
  Filter_Payor: string = '';
  filter_service:string='';
  filter_billingUnitLid:string='';
  filter_name:string='';
  filter_FacilityId:string=''

  groupPayerForm:FormGroup;
  payerLst: any;
  groupLst:any;
  providerList:any;
  exampleFlag:boolean= false;
  Allservice:any=[];
  servicedata:any=[];
  AllPayerLst:any=[];
  payorEnable:boolean;
  Addgrpser:boolean=false;
  updategrpser:boolean=false;
  TotalCount: number;  
  filter:filters=new filters();
  filterSelect:any;
  valuechange:any = [];
  showErrorAlert:boolean=false
  deleteError: any="";
  deleteAlert: boolean=false;
  ListSendBO:GetGroupPayorServiceBO = new GetGroupPayorServiceBO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  public pageSizes: number[] = [10,15,20,50,100,250]; 

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
 
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
// ===================================Other initialization===================//
//======================================new try====================//
public data: Observable<DataStateChangeEventArgs>;
public state: DataStateChangeEventArgs;
initialPage: PageSettingsModel;
public filterSettings: object;
fp: functionpermission ;
stateList:any=[]
  constructor(public router:Router,@Inject(GetHTTPService) public gethttp:GetHTTPService,public dateservice:DateService, private modalService: NgbModal, private datepipe: DatePipe,public http: HttpClient,public httpService:GroupPayorService,public toastrService: ToastrService,
    public global:GlobalComponent, private formBuilder: FormBuilder,private ngxService:NgxUiLoaderService,
    private ref: ChangeDetectorRef,public commonhttp: CommonHttpService) {
     


      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.groupPayerForm = this.formBuilder.group({
     
        agencyId: [this.global.globalAgencyId] ,
        icd10:  [''] ,
        isIcd10FromClient:[true],
        groupId: [0,Validators.required],
        groupName:  [''] ,
        payorName:  [''] ,
        groupPayorId: [0,Validators.required],
        masterServiceId: [0,Validators.required],
        serviceDescription:  [''] ,
        billingUnitLid: [0,Validators.required],
        serviceName:  [''] ,
        billingUnit:  [''] ,
        netRate: ['',Validators.required] ,
        unitrate: ['',Validators.required] ,
        hCPCCode:  [''] ,
        callTypeID: [''] ,
        unitMultiplier: [''] ,
        billIndividually:  [''] ,
        revCode:  [''] ,
        providerLid: [''] ,
        companyIdentifier:[true] ,
        g2id:  [''] ,
        nPI:  [''] ,
        companyName:  [''] ,
        name:  [''] ,
        address1:  [''] ,
        address2:  [''] ,
        city:  [''] ,
        state:  [''] ,
        zipCode:  [''] ,
        facilityID:  [''] ,
        serviceLoc:  ['',Validators.required] ,
        pharm:  [''] ,
        homeVisit:  [''] ,
        rateChangeDate:  [null] ,
        oldUCRate: [''] ,
        oldNetRate: [''] ,
        // waiverFlag:[true] 
      });

     }
     ngOnInit() {
      this.commonhttp.getJSON().subscribe(data => {
       
        this.stateList=data;
    });
      this.conditionlist.push(new WhereCondition());
      this.toolbar = ['ColumnChooser'];
      this.fp=new functionpermission();
      this.filepermissionget();
      this.filterSettings = { type: 'Menu' };
      this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 

      this.SearchColumn.key = 'groupName';
      this.SearchColumn.value = 'Group';
      this.toolbar = ['ColumnChooser'];

      this.groupPayerForm.get('groupPayorId').disable()

       this.getTotalCount();
       this.getGroup();
       this.getService();
       this.getBillingStatus()
       this.getProviderDropDown();
       this.getAllpayer();
       this.getPayorTotalItem();
      //  this.getColumnwidth();


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
         this.ListSendBO.field="groupName";
         this.ListSendBO.matchCase=false;
         this.ListSendBO.operator="startswith";
         this.ListSendBO.value="";
       }
     } if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].GrouppayorService.Pagesize!=state.take)
        {
          this.arraycol[0].GrouppayorService.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        

      }
    
    }
    }
     this.ListSendBO.agencyID=this.global.globalAgencyId;
     this.getPayorTotalItem();
   }
     showtable(){
   
      this.updategrpser=false;
      this.Addgrpser=false;
    }
    getCount()
    {
      this.getPayorTotalItem()
      this.getTotalCount()
    }

   
    ///////////////////////////////////////////////////////////////////////////////////////
// getPayorTotalItem()
// {
//   // let url="api/GroupPayorServiceTable/getPayorTotalItem?";
//     let param=new URLSearchParams();

//     param.append("Group",this.grp.Group.toString())
//     param.append("Payor",this.grp.Payor.toString())
//     param.append("Service",this.grp.Service.toString())
//     param.append("Billing",this.grp.Billing.toString())
//     param.append("FacilityName",this.grp.FacilityName)
//     param.append("FacilityId",this.grp.FacilityId)
//     param.append("SearchColumn", this.SearchColumn.key);
//     param.append("SearchText", this.SearchText);
//     param.append("agency",this.global.globalAgencyId)
//     param.append("sortColumn",this.pagshort.shortcolumn)
//     param.append("orderType",this.pagshort.shortType)
//     param.append("totalPage",this.pagshort.itemperpage.toString())
//     param.append("currentPage",this.pagshort.currentPgNo.toString())
//     this.httpService.getPayorTotalItem(param).subscribe((data:GroupPayorServiceTableBO[])=>{
//       this.GroupPayorServiceArray=data;
//       console.log("GroupPayorServiceArray",this.GroupPayorServiceArray);

//    });
// } 
	



show() {
    this.grid.columnChooserModule.openColumnChooser();
  }

clearfilter()
{
  this.filter.groupId='0';
  this.filter.groupPayorId='0';
  this.filter.service='0';
  this.filter.name="";
  this.filter.FacilityId="";
  this.filter.billingUnitLid='0';
}
datajson:any;
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

      this.arraycol[0].GrouppayorService.ShowColumns.forEach(old => {
        showarr.forEach(element => {
          if (old == element) {
            count1 = count1 + 1;
          }
        });

      });

      this.arraycol[0].GrouppayorService.HideColumns.forEach(old => {
        hidearr.forEach(element => {
          if (old == element) {
            count = count + 1;
          }
        });

      });
      console.log(count, count1, "count");


      if (this.arraycol[0].GrouppayorService.ShowColumns.length != count1 || this.arraycol[0].GrouppayorService.HideColumns.length != count) {
        this.arraycol[0].GrouppayorService.ShowColumns = showarr;
        this.arraycol[0].GrouppayorService.HideColumns = hidearr;
        this.SaveColumnwidth();
      }
    }
  }
} 

getPayorTotalItem()
{
  // console.log(this.filter.service);
  
  // let url="api/GroupPayorServiceTable/getPayorTotalItem?";
  //   let param=new URLSearchParams();
  //   param.append("Group",this.filter.groupId)
  //   param.append("Payor",this.filter.groupPayorId)
  //   param.append("Service",this.filter.service)
  //   param.append("Billing",this.filter.billingUnitLid)
  //   param.append("FacilityName",this.filter.name)
  //   param.append("FacilityId",this.filter.FacilityId)
  //   param.append("agency",this.global.globalAgencyId)
  //   param.append("sortColumn",this.sortColumn)
  //   param.append("orderType",this.orderType)
  //   param.append("totalPage",this.perPage)
  //   param.append("currentPage",this.currentPage)
  //   this.http.get(url+param).subscribe((data:any)=>{
  //     this.GroupPayorServiceArray=data;
  //     console.log(this.GroupPayorServiceArray);
      
  //     this.datajson=JSON.stringify(data);
      
  //   });
  var agencyId=parseInt(this.global.globalAgencyId)
  console.log(this.ListSendBO.agencyID);
  this.ListSendBO.agencyID=agencyId;
  this.ngxService.start()
  this.gethttp.execute(this.ListSendBO);    
  console.log(" this.gethttp.",this.data);
  let count=0
  this.data.subscribe((data:any)=>{
    count=count+1
    if(data!=null&& data!=undefined &&count==1 )
    {
      this.getColumnwidth();
    }
console.log(data,"log");
data.result.forEach(element => {
  element.groupPayorId = element.groupPayorId.toString();
});

  })
 
}

getGroupPayor(){

  let params = new URLSearchParams();
 
  params.append("AgencyId", this.global.globalAgencyId);

  this.httpService.getGroupPayorServiceList(params).subscribe((data:any)=>{
    this.GroupPayorServiceArray=data;

    console.log("data",data);
   
  
  })
} 

test(value)
{
  console.log(value,"providerLid====");
  
}
getTotalCount() {

  let params = new URLSearchParams();  
  params.append("Group",this.filter.groupId)
  params.append("Payor",this.filter.groupPayorId)
  params.append("Service",this.filter.service)
  params.append("Billing",this.filter.billingUnitLid)
  params.append("FacilityName",this.filter.name)
  params.append("FacilityId",this.filter.FacilityId)
  // params.append("SearchColumn", this.SearchColumn.key);
  // params.append("SearchText", this.SearchText);
  params.append("agency",this.global.globalAgencyId)
 
     this.httpService.getgroupPayorTotal(params).subscribe((data: any) => {
    this.TotalCount = data; 
    console.log("total",data);
    this.getPayorTotalItem();
  
  })
}

applyFilter()
{
  this.ListSendBO.field=this.filterSelect
  if(this.filterSelect=="payorName")
  {
    this.ListSendBO.value=this.filter.groupPayorId
    let val=this.filter.groupPayorId!=undefined?this.filter.groupPayorId:'0';this.clearfilter();this.filter.groupPayorId=val}
  if(this.filterSelect=="Service")
  {let val= this.filter.service!=undefined?this.filter.service:'0';this.clearfilter();this.filter.service=val}
  if(this.filterSelect=="Group")
  {let val=this.filter.groupId!=undefined?this.filter.groupId:'0';this.clearfilter();this.filter.groupId=val}
  if(this.filterSelect=="Billing Unit")
  {let val=this.filter.billingUnitLid!=undefined?this.filter.billingUnitLid:'0';this.clearfilter();this.filter.billingUnitLid=val}
  if(this.filterSelect=="FacilityId")
  {let val= this.filter.FacilityId;this.clearfilter();this.filter.FacilityId=val}
  if(this.filterSelect=="Facilityname")
  {let val= this.filter.name;this.clearfilter();this.filter.name=val}
  // this.getGroupPayor();
  this.getTotalCount();
  // this.getPayorTotalItem();
}

deleteDetails(details)
{
  this.GroupPayorService.id=details;
  console.log(details);
}
deleteGroup() {
  let url = "api/GroupPayorServiceTable/DeleteGroupPayorServiceTable?";
 
  let params = new URLSearchParams();
  params.append("GroupId",this.GroupPayorService.id.toString());
  this.http.delete(url+params).subscribe((data: any) => {
  console.log(data);

  this.toastrService.error("Group Payor Service has been Deleted Successfully")
  document.getElementById('openModal2').click();
  this.getPayorTotalItem();
  // this.getGroupPayor();
  this.getTotalCount();  
  },(err:HttpErrorResponse) => {
    console.log("err.error", err.error);
  
 
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

//   ///////////////////////////
getGroup() {
   
  let url = "api/LOV/getLovDropDownByCode?";
  let params = new URLSearchParams();
  params.append("Code","GROUP");
  this.http.get(url+params).subscribe((data: any) => {
 console.log("LOV",data);
 // console.log(data);
  this.groupLst=data;
  
  
  }
  )}
  
  groupchange(id)
  {

    if(id==undefined)
    {
 
      console.log(this.payerLst);
      
    }
    else{
     
      this.groupPayerForm.get('groupPayorId').enable()

      this.getpayer(id)
    }
    console.log(id);
    
  }
  getpayer(groupId)
  {
    let url="api/GroupPayor/getpayerId?";
    let param=new URLSearchParams();
    param.append("groupId",groupId);
    param.append("AgencyId",this.global.globalAgencyId);
    this.http.get(url+param).subscribe((data:any)=>{
      console.log("payerLst",data);
     // let temp:any=[];
      this.payerLst=data;
    })
  }
  getAllpayer()
  {
 
    let param=new URLSearchParams();
    param.append("AgencyId",this.global.globalAgencyId);
    this.httpService.getAllpayer(param).subscribe((data:any)=>{
      console.log('allpayer',data);
      let temp:any=[];
      data.forEach(element => {
        temp={label:element.Value,value:element.Key.toString()}
        this.AllPayerLst.push(temp);
      });
      this.AllPayerLst=data;
    })
  }

getProviderDropDown() {
   
  let params = new URLSearchParams();
  params.append("Code","RENDERINGPROVIDER");
  this.httpService.getProviderDropDown(params).subscribe((data: any) => {
 // console.log("LOV",data);
 for(let i=0;i< data.length;i++)
 {
   data[i].value = parseInt(data[i].value);
   if(data[i].label === "RN NPI")
   {
     this.exampleFlag= true;
  
   }
 }
 console.log(data,"providerList===");
  this.providerList=data;
  
  
  },
    err => {
      // alert(err.error)
    });
}

 
  GrpCreateupdate(type:string) {
    if (type == 'new') {
   
      this.Addgrpser=true;
      this.updategrpser=false;
      this.groupPayerForm.reset();
      this.GroupPayorService = new GroupPayorServiceTableBO();
    }
    else if(type =='edit') {
      this.updategrpser=true;
      console.log(this.updategrpser);

    }
this.valueschanges()
  }
 
  
  selectgrpdetails(Details:GroupPayorServiceTableBO) {
    this.GroupPayorService = Details;
    console.log(Details,"update");
    this.GroupPayorService= JSON.parse(JSON.stringify(Details));
  //  new Promise((resolve,rejects)=>{
  //   resolve(this.groupchange(this.GroupPayorService.groupId))
   
  //  }).then( this.GroupPayorService.groupPayorId=JSON.parse(JSON.stringify(Details)).groupPayorId)

  
    // this.GroupPayorServiceArray.forEach(element => {
    //   element.groupPayorId=element.groupPayorId.toString()
      
    // });
  }

  getService()
  {
    
    let param=new URLSearchParams();
    param.append("AgencyId",this.global.globalAgencyId);
    this.httpService.getService(param).subscribe((data:any)=>{
      // console.log(data);
       this.Allservice=data;
       console.log("Allservice",this.Allservice);
       
      // let temp:any="";
      // data.forEach(element => {
        // temp={label:element.Value,value:element.Key.toString()}
        // this.Allservice.push(temp);
      // });
      // this.payerLst=data;
    })
  }
  serviceChange(service)
{console.log(service);

  if(service==undefined)
  {
    this.GroupPayorService.serviceDescription="";
  }
  else
  {
  //console.log(service);
  //console.log(this.servicedata);
  let url="api/MasterService/getDescription?";
  let param=new URLSearchParams();
  param.append("Id",service);
  this.http.get(url+param).subscribe((data:any)=>{
   data.forEach(element => {
    this.GroupPayorService.serviceDescription=element.serviceDescription;
    // this.GroupPayorService.billingUnit = element.billingUnit;
   });
    
});
  }
}

  getBillingStatus() {
   
    let url = "api/LOV/getLovDropDownByCode?";
    let params = new URLSearchParams();
    params.append("Code","BILLING");
    params.append("agencyId",this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.http.get(url+params).subscribe((data: any) => {
    //console.log("LOV","Code");
    console.log(data);
    this.billingUnit=data;
    
    },
      err => {
        // alert(err.error)
      });
  }
  newdates(event, names) {
    if (names == "inputchage") {
    
      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
       
          this.GroupPayorService.rateChangeDate = val1;
      } 
    }
    if (names == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        
          this.GroupPayorService.rateChangeDate = val1;
        
      }
    }
    }
 
//   /////////////////////////save Group payor Service////////////////////////
error:any=''
SaveOrUpdateGroupPayorService(){
  let url = "api/GroupPayorServiceTable/SaveGroupPayorServiceTable";

// var saveList:GroupPayorServiceTableBO = JSON.parse(JSON.stringify(this.GroupPayorService));
var saveList:any = JSON.parse(JSON.stringify(this.GroupPayorService));
 
console.log(saveList.id);
// saveList = JSON.parse(JSON.stringify(this.groupPayerForm.getRawValue()));
saveList.agencyId = parseInt(this.global.globalAgencyId);
saveList.groupId = parseInt(this.groupPayerForm.get('groupId').value);
saveList.groupPayorId = parseInt(this.groupPayerForm.get('groupPayorId').value);
saveList.masterServiceId = parseInt(this.groupPayerForm.get('masterServiceId').value);
saveList.callTypeID = parseInt(this.groupPayerForm.get('callTypeID').value);
saveList.providerLid = parseInt(this.groupPayerForm.get('providerLid').value);
saveList.billingUnitLid = parseInt(this.groupPayerForm.get('billingUnitLid').value);
saveList.companyIdentifier= Boolean(this.groupPayerForm.get('companyIdentifier').value);

console.log("service list===============",saveList);
if(saveList.rateChangeDate!=null)
{
  saveList.rateChangeDate=this.groupPayerForm.value.rateChangeDate.formatted?this.dateFormateyyyyMMdd(this.groupPayerForm.value.rateChangeDate.formatted):this.groupPayerForm.value.rateChangeDate;

}
this.http.post(url,saveList).subscribe((data: number) => {
      console.log("====save update=========", data);
      console.log('saveList',saveList);
      console.log(saveList.id);
      // this.showtable()
      // this.getPayorTotalItem()
      // this.toastrService.success('Service created Successfully')

      // this.getTotalCount();
      // // console.log(this.GroupPayorService.groupName);
      


   
        
        //====================== sucess message =============
        if (saveList.id == 0 || saveList.id == undefined) {
          saveList.id = data;
          // this.GroupPayorServiceArray.push(saveList);
          this.toastrService.success('Group Payor Service created Successfully')
          this.getPayorTotalItem();
          // this.getGroupPayor();
          this.getTotalCount();
          this.showtable()
        }
 
      
      else if(saveList.id != 0 && saveList.id != undefined)
      {

       console.log(data);
       this.getPayorTotalItem();
       this.showtable()

      this.toastrService.success('Group Payor Service Updated Successfully')

       this.getTotalCount();
      }
      this.payerLst=[];
},(err:HttpErrorResponse) => {
    
 

  if(err)
  {

    this.error=err.error;
    console.log("this.error.errors",err);
    this.showErrorAlert=true
  }
  else{
    this.error= JSON.stringify(this.error);
   console.log("this.error.errors",this.error);
   
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
  dateFormateyyyyMMdd(date:string){
    console.log(date);
      let day = date.substring(0,2);
      let month = date.substring(3,5);
      let year = date.substring(6,10);
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

    
 	

//   // //////////////////////Refresh///////////////////////////////////////


Refresh() {
    this.ListSendBO.field='groupName';
    this.ListSendBO.value = "";
    this.ListSendBO.pageitem=10;
    this.ListSendBO.currentpageno=1;
    this.filterSelect=''
    this.Filter_Payor=''
    this.filter_FacilityId=''
    this.filter_billingUnitLid=''
    this.filter_name=''
    this.filter_service=''
    this.Filter_Group=''
    // this.SearchColumn.key = 'CareCoordinatorName';
    // this.SearchColumn.value = 'Name';
    this.pagshort = new sortingObj();
    this.getPayorTotalItem();
    // this.getTotalCount();
  }

//   // /////////////////////////////////////////////////////////////
  pageItemsChage(pageitems) {
    this.pagshort.itemperpage = pageitems;
    this.getPayorTotalItem();
    this.getTotalCount()
    // this.getGroupPayor();




   }
   selected_filter(filter) {
    this.SearchColum = filter;
  }
////////////////////////////////////////////////////////////////////
search(filter) {
  console.log(filter);
  console.log(this.filterSelect);
  
  this.ListSendBO.field=this.filterSelect
  console.log(this.ListSendBO.field);

this.ListSendBO.value=filter
  
  this.getPayorTotalItem();
  // this.getTotalCount();
}

//   // // ///////////////////////////////////////////////////////////
  onKeydown(event,filter) {
    if (event.key === "Enter") {
      this.search(filter);
    }
  }
//   //////////////////////////////Set default value for searchcolumn////////////////////
  setDefaultValue() {
    console.log("this.SearchColumn", this.SearchColumn);
    this.SearchText = "";
    if (this.SearchColumn == undefined)
      this.SearchColumn = {
        'groupName': 'Group',
      };
  }
  

  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getPayorTotalItem();
    this.getTotalCount();

  }
  // /////////////////////////////////////////////////////////////////

  actionHandler(args) {
    if (args.requestType == "sorting") {
      console.log(args.direction + ' ' + args.columnName);
    }
    else if (args.requestType == "filtering") {
      console.log(args.currentFilterObject.operator + ' ' + args.currentFilterObject.value + ' ' + args.currentFilteringColumn);
    }
  }
  ////////////////////////////////get Zip code Function////////////////////////////////
  getzipcode() {

    let url1 = "api/Client/getZipcode?"
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.GroupPayorService.address1)
    myParams1.append("City", this.GroupPayorService.city)
    myParams1.append("State", this.GroupPayorService.state)
    // console.log("Im in");
    this.http.get(url1 + myParams1).subscribe((data: any) => {
      console.log("data.zip_Code", data.zipcode);
      this.GroupPayorService.zipCode = data.zipcode;
     console.log("data.zip_Code",  this.GroupPayorService.zipCode);
     
     
  })
  }

 //////////////////////////////////value change///////////////////////////////////////
 valueschanges() {
  this.valuechange = {
   Group: 0,
   Payor: 0,
   Service: 0,
   Description: 0,
   billingUnit: 0,
   netRate: 0,
   unitrate: 0,
   hcpcCode: 0,
   billIndividually: 0,
   revCode: 0,
   providerLid: 0,
   companyIdentifier: 0,
   g2id: null,
   npi: 0,
   companyName: 0,
   name: 0,
   address1: 0,
   address2: 0,
   city: 0,
   state: 0,
   zipCode: 0,
   facilityID: 0,
   serviceLoc: 0,
   pharm: 0,
   homeVisit: 0,
   callTypeID: 0,
   unitMultiplier: 0,
   rateChangeDate: 0,
   oldUCRate: 0,
   oldNetRate: 0,
   icd10: 0,
   icd10button: 0,
   isIcd10FromClient: 0,
  }
}
checkpopup(value) {
  if (value == "Group") {
    this.valuechange.Group++;
  }
  if (value == "Payor") {
    this.valuechange.Payor++;
  }
  if (value == "Service") {
   this.valuechange.Service++;
 }
 if (value == "Description") {
   this.valuechange.Description++;
 }
 if (value == "billingUnit") {
   this.valuechange.billingUnit++;
 }
 if (value == "netRate") {
   this.valuechange.netRate++;
 }
 if (value == "unitrate") {
   this.valuechange.unitrate++;
 } if (value == "hcpcCode") {
   this.valuechange.hcpcCode++;
 } if (value == "billIndividually") {
   this.valuechange.billIndividually++;
 }
 if (value == "revCode") {
   this.valuechange.revCode++;
 }
 if (value == "providerLid") {
   this.valuechange.providerLid++;
 }
 if (value == "companyIdentifier") {
   this.valuechange.companyIdentifier++;
 }
 if (value == "g2id") {
   this.valuechange.g2id++;
 }if (value == "npi") {
   this.valuechange.npi++;
 }
 if (value == "companyName") {
   this.valuechange.companyName++;
 }
 if (value == "name") {
   this.valuechange.name++;
 }
 if (value == "address1") {
   this.valuechange.address1++;
 }
 if (value == "address2") {
   this.valuechange.address2++;
 }
 if (value == "city") {
   this.valuechange.city++;
 } if (value == "state") {
   this.valuechange.state++;
 } if (value == "zipCode") {
   this.valuechange.zipCode++;
 } if (value == "facilityID") {
   this.valuechange.facilityID++;
 }
 if (value == "serviceLoc") {
   this.valuechange.serviceLoc++;
 }if (value == "pharm") {
   this.valuechange.pharm++;
 }if (value == "homeVisit") {
   this.valuechange.homeVisit++;
 }if (value == "callTypeID") {
   this.valuechange.callTypeID++;
 }if (value == "unitMultiplier") {
   this.valuechange.unitMultiplier++;
 }
 if (value == "rateChangeDate") {
   this.valuechange.rateChangeDate++;
 }
 if (value == "oldUCRate") {
   this.valuechange.oldUCRate++;
 }if (value == "oldNetRate") {
   this.valuechange.oldNetRate++;
 }if (value == "icd10") {
   this.valuechange.icd10++;
 }if (value == "icd10button") {
   this.valuechange.icd10button++;
 }
 if (value == "isIcd10FromClient") {
   this.valuechange.isIcd10FromClient++;
 }

 console.log(this.valuechange);
 

}
 //////////////////////////////////Close POPUP///////////////////////////////////////

cancel() {

 
  
  if (this.valuechange.Group > 1 || this.valuechange.Payor > 1|| this.valuechange.Service > 1
   || this.valuechange.Description > 1|| this.valuechange.billingUnit > 1|| this.valuechange.netRate > 1
     || this.valuechange.hcpcCode > 1|| this.valuechange.billIndividually > 1|| this.valuechange.revCode > 1
     || this.valuechange.companyIdentifier > 1|| this.valuechange.g2id > 1|| this.valuechange.npi > 1
     || this.valuechange.companyName > 1|| this.valuechange.name > 1|| this.valuechange.address1 > 1|| this.valuechange.address2 > 1
     || this.valuechange.city > 1|| this.valuechange.state > 1|| this.valuechange.zipcode > 1|| this.valuechange.facilityID > 1
     || this.valuechange.serviceLoc > 1|| this.valuechange.pharm > 1|| this.valuechange.homeVisit > 1|| this.valuechange.callTypeID > 1
     || this.valuechange.unitMultiplier > 1|| this.valuechange.rateChangeDate > 1|| this.valuechange.oldUCRate > 1|| this.valuechange.oldNetRate > 1
    //  || this.valuechange.icd10 > 0 || this.valuechange.icd10button > 0|| this.valuechange.isIcd10FromClient > 0
     ) {


    $('#CloseModal').modal({
      show: true,
      zIndex:1000000
  })


// document.getElementById('CloseModal').click();

  }
  else {
    
    this.showtable();
    this.getPayorTotalItem()
    this.payerLst=[];
  }
   
  }
  cancelYes()
  {
    this.showtable()
    this.getPayorTotalItem()
    document.getElementById('openModal1').click()
    this.payerLst=[];
  }
  ///////////////////////////////////////////////////////////////////////////
  filepermissionget(){
    let params = new URLSearchParams();
    let url="api/functionpermisssion/getfunctionpermission?";
    params.append("pagecode","GroupPayorService" );
    params.append("roleId", this.global.roleId);
    this.http.get(url + params).subscribe((data: any) => {
      if (data != null) {
        this.fp = data;
    }
    else {
      this.fp = new functionpermission();
    }
  },
    (err:HttpErrorResponse) => {
     this.fp=new functionpermission();
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


    this.ColumnArray = JSON.parse(data.column)[0].GrouppayorService.Columns;

   
    this.grid.columns.forEach(col => {
      this.arraycol[0].GrouppayorService.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
  //  this.grid.refreshColumns();
 
this.grid.showColumns(JSON.parse(data.column)[0].GrouppayorService.ShowColumns);
this.grid.hideColumns(JSON.parse(data.column)[0].GrouppayorService.HideColumns);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].GrouppayorService.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Group') {

        const column = this.grid.getColumnByField('groupName'); // get the JSON object of the column corresponding to the field name
   //     column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Payor') {

        const column1 = this.grid.getColumnByField('payorName'); // get the JSON object of the column corresponding to the field name
     //   column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Service') {

        const column2 = this.grid.getColumnByField('serviceName'); // get the JSON object of the column corresponding to the field name
     //   column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Net Rate') {

        const column3 = this.grid.getColumnByField('netRate'); // get the JSON object of the column corresponding to the field name
     //   column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Service Location') {

        const column4 = this.grid.getColumnByField('serviceLoc'); // get the JSON object of the column corresponding to the field name
     //   column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Facility Name') {

        const column5 = this.grid.getColumnByField('name'); // get the JSON object of the column corresponding to the field name
       // column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Facility Address1') {

        const column5 = this.grid.getColumnByField('address1'); // get the JSON object of the column corresponding to the field name
      //  column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Facility ID') {

        const column6 = this.grid.getColumnByField('facilityID'); // get the JSON object of the column corresponding to the field name
      //  column6.headerText = element.column;
        column6.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Billing Unit') {

        const column7 = this.grid.getColumnByField('billingUnit'); // get the JSON object of the column corresponding to the field name
      //  column7.headerText = element.column;
        column7.width = element.width;

        this.grid.refreshHeader();
      }
      
      else if (element.column == 'Actions') {

        const column8 = this.grid.getColumnByUid('Actions'); // get the JSON object of the column corresponding to the field name
      //  column8.headerText = element.column;
        column8.width = element.width;
        this.grid.refreshHeader();

      }
    }); 


  });
}
SaveColumnwidth() {
  this.arraycol[0].GrouppayorService.Columns = this.ColumnArray;
  this.arraycol[0].GrouppayorService.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}
/////////////////////////////////////////////////////////


