import { Component, OnInit, TemplateRef, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IMyDpOptions, } from 'mydatepicker';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { GlobalComponent } from "../../global/global.component";
import { FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DataStateChangeEventArgs, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Sorts, DataResult } from '@syncfusion/ej2-angular-grids';
import { GroupPayorsService } from './group-payor.service';
import { GroupPayorList,functionpermission, getMappedCompanyBO, GroupPayorCompanyMappingBO, GetGroupPayorBO, WhereCondition, sortingObj, GetListBO,columnWidth,ColumnChangeBO } from './group-payor.model';
import { ToastrService } from 'ngx-toastr';
// import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { stringify } from 'querystring';
import { element } from 'protractor';
import { catchError } from 'rxjs/operators';
import { PhoneNumberFormatService } from 'src/app/phoneNumberFormat.service ';
import { Observable } from 'rxjs/Observable';
import { GetHTTPService } from './grouptable.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { CommonHttpService } from 'src/app/common.service';
declare var $:any;

@Component({
  selector: 'app-group-payor',
  templateUrl: './group-payor.component.html',
  styleUrls: ['./group-payor.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupPayorComponent implements OnInit {
  // EJS

  @ViewChild('grid') public grid: GridComponent;

  filterOptions: FilterSettingsModel;
  // grid: GridComponent;
  // filterOptions: FilterSettingsModel;
  filter: IFilter;
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];

  ////////////////////////date picker///////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };
/////////////////Main Functionlity///////////////////////////////////
  GroupPayorArray: GroupPayorList[];
  GroupPayor:GroupPayorList=new GroupPayorList();
  companyMappedArray:getMappedCompanyBO[];
  GroupPayorCompanyMapping:GroupPayorCompanyMappingBO=new GroupPayorCompanyMappingBO()
  getMappedCompanyBO:getMappedCompanyBO=new getMappedCompanyBO()
  GroupPayorCompanyMappingNew:GroupPayorCompanyMappingBO;
  I837: any = [];
  P837: any = [];
  TransDiag: any = [];
  isUpdate: boolean = false;
  NewGroupPayer: boolean = false;
  AddGrp: boolean = false;
  GroupForm: FormGroup;
  GroupFormUpdate: FormGroup;
  CompanyGroup:FormGroup;
  format: any = [];
  filterSelect: string = '';
  SearchColum: string = 'GroupName';
  OrderColumn: string = 'GroupName';
  SearchText: string = '';
  OrderType: string = 'asc';
  TotalCount: number;
  isDesc: boolean = false;
  p: number = 1;
  pageitems: number = 20;
  Filter_Group: string = '';
  Filter_Payor: string = '';
  fp: functionpermission;
  ICDForm :FormGroup;
  enableTab: boolean = false; 
  companyList:any=[];
  GroupPayorlist: any = [];
  companycreate:boolean= false;
  valuechange: any = [];
  public statusList: any = [];
  PayerFilter: any = [];
  ListI837: any = '';
  GroupId: any;
  error: any="";
  showErrorAlert: boolean=false;
  deleteError:any="";
  deleteAlert:boolean=false;
  comAlert:boolean=false;
  comError:any=""
  ListSendBO:GetListBO = new GetListBO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  pagshort: sortingObj = new sortingObj();
  radio:boolean=false;
  saveButton:boolean=false
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
stateList:any=[]
  constructor(private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,public http: HttpClient,public httpService:GroupPayorsService,public toastrService: ToastrService,public phone: PhoneNumberFormatService,
     public global: GlobalComponent,private ref: ChangeDetectorRef,public commonhttp: CommonHttpService) {

      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
       ////////////////////////////Add and edit group payor form//////////////////
      this.GroupForm = this.formBuilder.group({
        Group: new FormControl('', Validators.required),
        Payor: new FormControl('', Validators.required),
        Billingfullname: new FormControl(''),
        Address1: new FormControl(''),
        Address2: new FormControl(''),
        City: new FormControl(''),
        State: new FormControl(''),
        Zip: new FormControl(''),
        Phonenumber: new FormControl(' ',[Validators.minLength(14), Validators.maxLength(14)]),
        PayorEmail: new FormControl('', Validators.email),
        BillType: new FormControl(''),
        BillingPayorID: new FormControl('', Validators.required),
        MC: new FormControl(''),
        ExcelLid: new FormControl(''),
        format: new FormControl(''),
        InsID: new FormControl('',Validators.required),
        IInsID: new FormControl(''),
        Trans: new FormControl(''),
        ATYPICAL: new FormControl(''),
        // ICD10: new FormControl(''),
        // PullIcd10: new FormControl(''),
        Waiverflag: new FormControl(''),
  
  
      });
     /////////////////////Add and Update Company Form//////////////////////////////////
      // this.co_list = new Companymodel();
      this.CompanyGroup = this.formBuilder.group({
        providerNo: new FormControl(" ", Validators.required),
        companyFEIN:new FormControl (" ",[ Validators.required,Validators.minLength(9), Validators.maxLength(9)]),
        claim_Filling_Ind:new FormControl ("	", Validators.required),
        taxCode_MANo:new FormControl(" "),
        taxCode_MCNo:new FormControl(" "),
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
  
    this.getCompany();
    this.getGroupPayor();
    this.getBillingStatus();
    this.getI837();
    this.getP837();
    // this.getTransDiag();
    this.getformat();
    this.getTotalCount();
    this.getStatusLov();

    this.fp = new functionpermission();
    this.filepermissionget();
      // this.getMappedCompanyList()
      // this.getColumnwidth();
  }
  type:string="";
  public dataStateChange(state): void {
 // console.log("Stats chage",state);    
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
      this.ListSendBO.field="payorName";
      this.ListSendBO.matchCase=false;
      this.ListSendBO.operator="startswith";
      this.ListSendBO.value="";
    }
  }
  if (this.type == "paging" && state.action.name == "actionBegin") {
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].Grouppayor.Pagesize!=state.take)
      {
        this.arraycol[0].Grouppayor.Pagesize = state.take
           console.log( "save page size")
        this.SaveColumnwidth();
      

    }
  
  }
  }
  this.ListSendBO.agencyID=this.global.globalAgencyId;
  this.getGroupPayor();
}

  onActionBegin(args) { 
    
  }
  // public onActionComplete(args) { 
  //   this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
  //   this.ListSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
  //   this.conditionlist=[];
  //   if(args.requestType==="filtering" && args.action==="filter"){
  //     args.columns.forEach(element => {
  //       this.conditionlist.push(element.properties);
  //       console.log("args type",this.conditionlist);
  //     }); 
  //   } 
    
  // } 
  public onActionComplete(args) { 
    console.log(args)
    console.log(this.grid)
    console.log(this.grid.pagerModule.pagerObj.currentPage)
     this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
     this.ListSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    
     if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
     {
       this.ListSendBO.type=args.columnType
       console.log( this.ListSendBO)
     }
     console.log( this.ListSendBO)
     console.log( this.grid)
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

        this.arraycol[0].Grouppayor.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Grouppayor.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Grouppayor.ShowColumns.length != count1 || this.arraycol[0].Grouppayor.HideColumns.length != count) {
          this.arraycol[0].Grouppayor.ShowColumns = showarr;
          this.arraycol[0].Grouppayor.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }
    }
reset_filter()
{
  this.radio=false

}
  //////////////////Assign Company/////////////////////////////////
  assigncompanyTable() {

    this.GroupPayorCompanyMapping.taxCode_MANo = null;
    this.GroupPayorCompanyMapping.taxCode_MCNo = null;
    this.GroupPayorCompanyMapping.claim_Filling_Ind=null
    this.GroupPayorCompanyMapping.companyFEIN=null

    // this.dialogService.open(assignCompany);
    // this.isUpdate = true;
    this.getMappedCompanyList();
    this.valueschanges();
  }
////////////////////////////////Show table view after Cancel click///////////////////////////////
  showtable() {

    this.isUpdate = false;
    this.AddGrp = false;
  }
  addcoldialog(popoverCol: TemplateRef<any>) {
    // this.dialogService.open(popoverCol);
  }
  multitemp(multiride: TemplateRef<any>) {
    // this.dialogService.open(multiride)
  }

  updatemulti(multi: TemplateRef<any>) {
    // this.dialogService.open(multi)
  }
///////////////////get group payor table list////////////////////////////////////
  // getGroupPayor() {
  //   // let url = "api/GroupPayor/GetGroupPayorFilterList?";
  //   let params = new URLSearchParams();
  //   params.append("SearchColumn", this.SearchColum);
  //   params.append("SearchText", this.SearchText);
  //   params.append("OrderColumn", this.OrderColumn);
  //   params.append("OrderType", this.OrderType);
  //   params.append("Pageitem", this.pageitems.toString());
  //   params.append("Currentpageno", this.p.toString());
  //   params.append("AgencyId", this.global.globalAgencyId);
  //   this.httpService.getGroupPayorList( params).subscribe((data:GroupPayorList[]) => {
  //     this.GroupPayorArray = data;
  //     console.log("data",data);
      
  //     this.GroupPayorArray.forEach(element => {
  //       if (element.phoneNumber != null) {
  //         // element.phone = this.phone.getPhoneNumber(element.phone);
  //         // element.phone = this.phone.phoneNoToFormat(element.phone);
  //       }
  //     })

  //   })
  // }
  getGroupPayor() {

    var agencyId=parseInt(this.global.globalAgencyId)

    console.log(this.ListSendBO.agencyID);
    
    this.ListSendBO.agencyID=agencyId;
    this.gethttp.execute(this.ListSendBO);
    let count=0;
    this.data.subscribe((data:any)=>{
      count=count+1;
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
    })    
    console.log(" this.gethttp.",this.data);
    

  }
  /////////////////////////Filter Functions/////////////////////////////////
  onKeydown(event, filter) {
    if (event.key === "Enter") {
      this.p = 1;
      this.Search(filter);
      this.getGroupPayor();
      this.getTotalCount();
    }
  }
  
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  selected_filter(filter) {
    this.SearchColum = filter;
  }
  change_group(event) {
    this.Filter_Group = event.target.value;
    this.SearchText = event.target.value;
  }

  Search(filter) {
    console.log(filter);
    console.log(this.filterSelect);
    
    this.ListSendBO.field=this.filterSelect
    console.log(this.ListSendBO.field);


    if (filter == this.Filter_Group) {
      // this.SearchText = this.Filter_Group;

     this.ListSendBO.value=this.Filter_Group;

    }
    else if (filter == this.Filter_Payor) {
      // this.SearchText = this.Filter_Payor;
      // this.Filter_Group = '';
     this.ListSendBO.value=this.Filter_Payor;

    }

    this.getGroupPayor();
    this.getTotalCount();

  }
  ////////////////////////
  getStatusLov() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");    
    params.append("agencyId",this.global.globalAgencyId);
    params.append("userId", this.global.userID);

    let url = "api/LOV/getLovDropDown?"
    this.http.get(url + params).subscribe((data: any) => {
      this.statusList = data;
      
      
    }, err => {
      ////alert("err");
    })
  }
  CompanyPhoneFormat(event){
    // this.co_list.phone=this.phone.getPhoneNumberFormat(this.co_list.phone);
  }
  CompanyFaxFormat(event){
    // this.co_list.fax=this.phone.getPhoneNumberFormat(this.co_list.fax);
  }
///////////////////Update Company///////////////////////////////////
  updateCom(Co_list) {
    
    this.GroupPayorCompanyMapping = Co_list;
    this.companycreate = false;
    // this.newCo = false;
    // this.updateCO = true;
    // this.dialogService.open(newcompanyConfiguration);
  }
  ///////////////////Delete Company///////////////////////////////////
  DeleteCom(Co_list) {
    
    this.GroupPayorCompanyMapping = Co_list;
    // this.newCo = false;
    // this.updateCO = true;
    // this.dialogService.open(newcompanyConfiguration);
  }
  /////////////////////////save company details/////////////////////////
  saveCompany(list) {
    console.log(this.GroupPayorCompanyMapping.id,);
    
    list=JSON.parse(JSON.stringify(list)); 
    list.agencyId = this.global.globalAgencyId;
    list.statusLid = parseInt(list.statusLid);
    // list.companyId=parseInt(list.companyId)
    // list.providerNo = parseInt(list.providerNo);
    let url = "api/GroupPayorCompanyMapping/SaveGroupPayorCompanyMapping";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    };
    console.log(list);
    console.log(this.companycreate);
    
    // console.log(this.co_list.id);
    let obj ;
    if(this.companycreate==true)
    {
      // obj = list.id
      obj = {
        companyId: this.GroupPayorCompanyMapping.id,
        groupPayorId: this.GroupPayor.id,
        companyFEIN: list.companyFEIN,
        claim_Filling_Ind: list.claim_Filling_Ind,
        providerNo:list.providerNo,
        taxCode_MANo:list.taxCode_MANo,
        taxCode_MCNo:list.taxCode_MCNo

      }
    console.log("add",list);
    console.log(obj);
    // console.log(this.mapCompanyList.id);


    }
    else{
      
      obj = list;
      console.log("save",list);
      
       
    }
 
    this.http.post(url, JSON.stringify(obj), httpOptions).subscribe((data: any = []) => {
     
        // this.co_list.id=data;
        list.id = data;
      document.getElementById('openModal4').click()
      this.companycreate=false
      this.toastrService.success('Company has been updated successfully','Company Updated')
          // ref.close();
          // this.toastrService.show(
          //   'Company has been updated successfully!',
          //   'Company updated', { status }), 3000;
            
    this.getMappedCompanyList();
      
    },(err:HttpErrorResponse) => {

      if(err)
      {
    
        this.comError=err.error;
        console.log("err.error",this.comError);
        this.comAlert=true
      }
      else{
        this.comError= JSON.stringify(err.error);
       console.log("err.error",err.error);
       
      }
    
      if (this.comError != "") {
        console.log("this.comError",this.comError);
        
        setTimeout(() => {
          this.comError = "";
          this.comAlert=false
        }, 5000)
      }
    })
  }



///////////////////////////////////Billing Status Dropdown///////////////////////////////////
  getBillingStatus() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "GROUP");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.http.get(url + params).subscribe((data: any) => {
      this.GroupPayorlist = data;
      this.GroupPayorlist.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      });


    });
  }
///////////////////////////// sorting And pagination/////////////////////////////////////
  sorting(sort) {

    this.OrderColumn = sort;
    if (this.isDesc == true) {
      this.OrderType = "desc";
    }
    if (this.isDesc == false) {
      this.OrderType = "asc";
    }
    this.getGroupPayor();


  }

  paginationChange(event) {
    this.p = event;
    this.getGroupPayor();
    this.getTotalCount();

  }
  pageItemsChage(pageitems) {
    this.pageitems = pageitems;
    this.getGroupPayor();
    this.getTotalCount();

  }
/////////////////////////////////////////refresh////////////////////////////////////////
  refresh() {
    this.pageitems = 20;
    this.OrderType = "asc";
    this.filterSelect = '';
    this.SearchText = '';
    this.Filter_Group = '';
    this.Filter_Payor = '';
    this.p = 1;
    this.ListSendBO.field="payorName"
    this.ListSendBO.value=''

    this.getGroupPayor();
    this.getTotalCount();

  }
///////////////////////////////Total count of group payor/////////////////////////////////////
  getTotalCount() {
    // let url = "api/GroupPayor/GetGroupPayorFilterList_Count?";
    let params = new URLSearchParams();
    params.append("SearchColumn", this.SearchColum);
    params.append("SearchText", this.SearchText);
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getPayorTotalItem(params).subscribe((data: any) => {
      this.TotalCount = data;
      console.log('total',data);
      
    })
  }

///////////////////////////// get list of Company Details////////////////////////
  getCompany() {
    let url = "api/Company/getCompanyPayorList?";
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.http.get(url + params).subscribe((data: getMappedCompanyBO[]) => {
      this.companyList = data;
      console.log("getCompany",data);
    })
  }
/////////////////////////// Assign Company //////////////////////////////////
  assignCompanyPayor() {
    console.log("yes");  
    console.log("mapCompanyList",this.GroupPayorCompanyMapping.id);
    console.log("providerNo",stringify(this.CompanyGroup.get('providerNo').value));
    console.log("groupPayorId",this.GroupPayor.id);
    
    let url = "api/GroupPayorCompanyMapping/SaveGroupPayorCompanyMapping";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    };
    let obj = {
      companyId: this.GroupPayorCompanyMapping.id,
      groupPayorId: this.GroupPayor.id,
      providerNo:stringify(this.CompanyGroup.get('providerNo').value)
    }
    
    
    this.http.post(url, JSON.stringify(obj), httpOptions).subscribe((data: any = []) => {

      this.getMappedCompanyList();
      console.log(data);
      
      // ref.close();
    //   this.toastrService.show(
    //     'Company has been mapped successfully!',
    //     'Company mapped', { status }), 3000;

    })
  }
//////////////////////////////Company map List///////////////////////////////
  getMappedCompanyList() {
    console.log(this.GroupPayor.id);
    
    let params = new URLSearchParams();
    params.append("grouppayorId",this.GroupPayor.id.toString());
    this.httpService.getCompanyItem(params).subscribe((data: any) => {
      
        this.companyMappedArray = data;

      console.log("companyMappedArray",data);
    })
  }
////////////////////////Select Company///////////////////////////////////////////////

  selectCompany(event,selectedData) {
    console.log(event.target.checked);
    
    console.log(selectedData.checked);
    
document.getElementById('companymodal').click()
this.GroupPayorCompanyMapping = selectedData;
this.companycreate = true;

selectedData.checked=false
  }

 ////////////////////////////get Payor Dropdown///////////////////////////////
  
  getGroupPayor_dropdown() {
    let url = "api/GroupPayor/GetGroupPayorList?"; 
    let params = new URLSearchParams();
     params.append("AgencyId", this.global.globalAgencyId);
    this.http.get(url+params).subscribe((data: any) => {
      this.PayerFilter = data;
    })
  }
  /////////////////////////////get i837 Dropdown//////////////////////////
  getI837() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "I837");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);

    this.http.get(url + params).subscribe((data: any) => {

      this.I837 = data;
      this.I837.forEach(element => {
        element.label = element.Value;
        element.value = element.Key.toString();
      });

    },
      (err: HttpErrorResponse) => {
        this.ListI837 = "";
        this.ListI837 = JSON.stringify(err.error);

        if (this.ListI837 != "") {
          setTimeout(() => {
            this.ListI837 = "";
          }, 8000)
        }
      });
  }
 //////////////////////// number only input for zipcode///////////////////// 
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
 //////////////////////// getP837 dropdown///////////////////// 
  
  getP837() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "I837");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.http.get(url + params).subscribe((data: any) => {

      this.P837 = data;

    },
      (err: HttpErrorResponse) => {
        if (err.error.errors) {
          this.ListI837 = JSON.stringify(err.error.errors);
        }
        else {
          this.ListI837 = JSON.stringify(err.error);

        }

        if (this.ListI837 != "") {
          setTimeout(() => {
            this.ListI837 = "";
          }, 8000)
        }
      });
  }

 ////////////////////////group payor create and edit///////////////////// 

 
  GrpCreateupdate(type:string) {
   
    if (type == 'new') {
      this.AddGrp=true;
      this.GroupForm.reset();
      this.enableTab = false;
     
      this.GroupPayor = new GroupPayorList();
      // this.isUpdate=false;
      this.companyMappedArray=null

  
  
    }
    else if(type =='edit') {
      this.isUpdate=true;
      this.getMappedCompanyList()
      console.log(this.isUpdate);
      this.enableTab = true;
      this.AddGrp=false;


    }
this.valueschanges()
  }

 

  selectgrpdetails(Details:GroupPayorList) {
    this.GroupPayor = Details;
    console.log(this.GroupPayor.id);
    console.log(Details);
    this.GroupPayor = JSON.parse(JSON.stringify(Details));

    
    // this.GroupPayorServiceArray.forEach(element => {
    //   element.rateChangeDate=element.rateChangeDate.toString()
      
    // });
  }
 ////////////////////////group payor save and Update///////////////////// 
 
  SaveOrUpdateGroupPayor() {
    var listParam:GroupPayorList = JSON.parse(JSON.stringify(this.GroupPayor));
    console.log("payorId",this.GroupPayor.payorId);
    listParam.i837PInsTypeLid = parseInt(this.GroupForm.get('InsID').value);
    listParam.groupLid = parseInt(this.GroupForm.get('Group').value)
    listParam.agencyId = parseInt(this.global.globalAgencyId);
   
    this.httpService.saveupdate(listParam).subscribe((data: any) => {
      this.enableTab=true
      console.log("this.AddGrp",this.AddGrp);
       console.log("this.isUpdate",this.isUpdate);
       
       if(this.isUpdate) {
        this.showtable();
        this.AddGrp=false;
        this.isUpdate=false
        console.log(this.isUpdate);
        this.GroupPayor.id = data.id;
        this.toastrService.success('Group payor has been updated successfully','Group Payor Updated')
        this.getGroupPayor();


      }
    
      else if(this.AddGrp)
       {
        this.GroupPayor.id = data.id;
        console.log(data);
        this.toastrService.success('Group payor has been saved successfully','Group Payor Saved')
        this.getGroupPayor();
        this.getTotalCount();
        this.isUpdate=true;

        // this.saveButton=true
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
        }, 3000)
      }
    })
  }

 //////////////////////// delete group payor///////////////////// 

  GroupDelete(listParam) {
    // this.dialogService.open(deleterec);
    this.GroupPayor.id = listParam.id;
    console.log(listParam);
    

  }

  deleteGroup() {
    let url = "api/GroupPayor/DeleteGroupPayor?";
    let params = new URLSearchParams();
    params.append("GroupId", this.GroupPayor.id.toString());
    this.http.delete(url+params).subscribe((data: any) => {
      // this.toastrService.show(
      //   "GroupPayor has been Deleted Successfully",
      //   "GroupPayor Deleted ",
      //   { status }), 8000
      // ref.close();
      this.toastrService.success('Group payor has been deleted successfully','Group Payor Deleted')

      this.getGroupPayor();
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
 
  
  deleteGroupCompanyMapping() {
    let url = "api/GroupPayorCompanyMapping/DeleteGroupPayorCompany?";
    let params = new URLSearchParams();
    params.append("CompanyId", this.GroupPayorCompanyMapping.id.toString());
    this.httpService.deleteCompanyMapping(params).subscribe((data: any) => {
      // this.toastrService.show(
      //   "GroupPayor has been Deleted Successfully",
      //   "GroupPayor Deleted ",
      //   { status }), 8000
      // ref.close();
      this.toastrService.error( "Mapped Company has been Deleted Successfully", "Mapped Company Deleted ")

      this.getMappedCompanyList();
    },(err:HttpErrorResponse) => {
   console.log("err.error", err.error);
 

      if(err)
      {
    
        this.error=err.error;
        console.log("err.error", this.error);
        this.showErrorAlert=true
      }
      else{
        this.error= JSON.stringify(err.error);
       console.log("err.error",err.error);
       
      }
    
      if (this.error!= "") {
        console.log("this.error",this.error);
        
        setTimeout(() => {
          this.error = "";
          this.showErrorAlert=false
        }, 5000)
      }
    }
    )


  }
 
////////////////////////////////value change event//////////////////////////////////  
 
    valueschanges() {
      this.valuechange = {
       Group: 0,
       Payor: 0,
       Billingfullname: 0,
       Address1: 0,
       Address2: 0,
       City: 0,
       State: 0,
       Phonenumber: 0,
       PayorEmail: 0,
       BillType: 0,
       BillingPayorID: 0,
       format: 0,
       InsID: 0,
       ATYPICAL: 0,
       Waiverflag:0,
       // ICD10:0,
       // PullIcd10:0
      }
    }
 checkpopup(value) {
   if (value == "Group") {
     this.valuechange.Group++;
   }
   if (value == "Payor") {
     this.valuechange.Payor++;
   }
   if (value == "Billingfullname") {
    this.valuechange.Billingfullname++;
  } if (value == "Address1") {
    this.valuechange.Address1++;
  } if (value == "Address2") {
    this.valuechange.Address2++;
  } if (value == "City") {
    this.valuechange.City++;
  } if (value == "State") {
    this.valuechange.State++;
  }if (value == "Phonenumber") {
    this.valuechange.Phonenumber++;
  }if (value == "PayorEmail") {
    this.valuechange.PayorEmail++;
  }if (value == "BillType") {
    this.valuechange.BillType++;
  }if (value == "BillingPayorID") {
    this.valuechange.BillingPayorID++;
  }if (value == "format") {
    this.valuechange.format++;
  }if (value == "InsID") {
    this.valuechange.InsID++;
  }if (value == "ATYPICAL") {
    this.valuechange.ATYPICAL++;
  }
  // if (value == "ICD10") {
  //   this.valuechange.ICD10++;
  // }
  if (value == "Waiverflag") {
    console.log(this.GroupPayor.waiverFlag);
    
    this.valuechange.Waiverflag++;
  }
  // if (value == "PullIcd10") {
  //   this.valuechange.PullIcd10++;
  //   console.log(this.GroupPayor.isIcd10FromClient);
  // }


 }


 cancel() {

   if (this.valuechange.Group > 0 || this.valuechange.Payor > 0|| this.valuechange.Billingfullname > 0
    || this.valuechange.Address1 > 0|| this.valuechange.Address2 > 0|| this.valuechange.City > 0
    || this.valuechange.State > 0|| this.valuechange.Phonenumber > 0|| this.valuechange.PayorEmail > 0|| this.valuechange.BillType > 0
    || this.valuechange.format > 0 || this.valuechange.BillingPayorID > 0 || this.valuechange.InsID > 0 || this.valuechange.ATYPICAL > 0
    // || this.valuechange.ICD10 > 1|| this.valuechange.PullIcd10 > 1
    || this.valuechange.Waiverflag > 0) {
    //  this.dialogService.open(closecar);
    $('#CloseModal').modal({
      show: true,
      zIndex:1000000
  })

}
else
     {
      this.showtable();
      this.getGroupPayor()
     }
    
   }

   cancelYes()
   {
     this.showtable()
     document.getElementById('openModal2').click()
     this.getGroupPayor()

     
   }
 check() {
   if (this.AddGrp) {
     if (this.GroupForm.valid) {
       this.SaveOrUpdateGroupPayor();
     }
   }
   else if (this.isUpdate) {
     if (this.GroupFormUpdate.valid) {
      this.SaveOrUpdateGroupPayor();
     }
   }
 }


  //////////////////// phone num format//////////////////////////////////
  formatPhoneNumber(event, phonenum) {
  console.log(event);
  
      if(event.which < 48 || event.which >57)
      {
        event.preventDefault();
      }
      this.GroupPayor.phoneNumber = this.phone.getPhoneNumberFormat(phonenum);
  
   
  }
 
  filepermissionget() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermission?";
    params.append("pagecode", "GroupPayor");
    params.append("roleId", this.global.roleId);
    this.http.get(url + params).subscribe((data: any) => {
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



getTransDiag() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "TRANSCODE");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {

    this.TransDiag = data;

  })
}
getformat() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "FORMAT");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {

    this.format = data;

  },
    (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.ListI837 = JSON.stringify(err.error.errors);
      }
      else {
        this.ListI837 = JSON.stringify(err.error);

      }

      if (this.ListI837 != "") {
        setTimeout(() => {
          this.ListI837 = "";
        }, 8000)
      }
    });
}
////////////////////////////// Function permission///////////////////////////////
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
    
    this.ColumnArray = JSON.parse(data.column)[0].Grouppayor.Columns;

    this.grid.columns.forEach(col => {
      this.arraycol[0].Grouppayor.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
  //  this.grid.refreshColumns();

 // this.grid.showColumns(JSON.parse(data.column)[0].Grouppayor.ShowColumns);
  this.grid.hideColumns(JSON.parse(data.column)[0].Grouppayor.HideColumns);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
    
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Grouppayor.Pagesize

      this.ColumnArray.forEach(element => {

        if (element.column == 'Group') {

          const column = this.grid.getColumnByField('groupName'); // get the JSON object of the column corresponding to the field name
         // column.headerText = element.column;
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
        if (element.column == 'Address'){

          
          const column2 = this.grid.getColumnByField('addressLine1'); // get the JSON object of the column corresponding to the field name
        //  column2.headerText = element.column;
          column2.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'City'){

          
          const column3 = this.grid.getColumnByField('city'); // get the JSON object of the column corresponding to the field name
        //  column3.headerText = element.column;
          column3.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'State'){

          
          const column4 = this.grid.getColumnByField('state'); // get the JSON object of the column corresponding to the field name
         // column4.headerText = element.column;
          column4.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Zip'){

          
          const column5 = this.grid.getColumnByField('zip'); // get the JSON object of the column corresponding to the field name
         // column5.headerText = element.column;
          column5.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Phone number'){

          
          const column6 = this.grid.getColumnByField('phoneNumber'); // get the JSON object of the column corresponding to the field name
         // column6.headerText = element.column;
          column6.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Bill Type'){

          
          const column7 = this.grid.getColumnByField('defaultBillType'); // get the JSON object of the column corresponding to the field name
        //  column7.headerText = element.column;
          column7.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Payor ID'){

          
          const column8 = this.grid.getColumnByField('payorId'); // get the JSON object of the column corresponding to the field name
         // column8.headerText = element.column;
          column8.width = element.width;

          this.grid.refreshHeader();
        }
      
        else if (element.column == 'Actions') {

          const column9 = this.grid.getColumnByUid('Actions'); // get the JSON object of the column corresponding to the field name
        //  column9.headerText = element.column;
          column9.width = element.width;
          this.grid.refreshHeader();

        }

      });


  });
}
SaveColumnwidth() {
  this.arraycol[0].Grouppayor.Columns = this.ColumnArray;
  this.arraycol[0].Grouppayor.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}

