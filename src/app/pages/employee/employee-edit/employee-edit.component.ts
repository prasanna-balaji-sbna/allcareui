import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GlobalComponent } from '../../../global/global.component';
import { EmployeeService } from '../employee.service';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { DateService } from '../../../date.service';
import { RelationshipComponent } from '../../relationship/relationship.component'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Employee, IsViewEdit, PayRollInformation, OnboardList, returnonboard, zip, relationship, IsViewEditpayorequired, PayorRequiredID, IsViewEditpayrate, PayRateUnit, functionpermission } from '../emloyee.model';
import { DatePipe } from '@angular/common';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { generalservice } from 'src/app/services/general.service';
import { ListBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { element } from 'protractor';
import { CommonHttpService } from 'src/app/common.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeEditComponent implements OnInit {

  //////////////////////////////////////////Employee variables ////////////////////////////////////////////////////////////
  fp: functionpermission = new functionpermission;
  Employee: Employee;
  EmployeeDataForm: FormGroup;
  resetPass: FormGroup;
  ResetPassword: string
  passerror: boolean = false;
  user: string;
  password: string;
  relationenable: boolean = false;
  requireEVV: boolean = false;
  
  
  loading: boolean = false;
  enablerelation: boolean = false;
  employeevaluechange: boolean = false
  workHistryTable: [{ hiredate: string, terminatedate: string }] = [{ hiredate: null, terminatedate: null }];
  workhistryEnable: boolean = false;
  activeTab: string = "payor";
  public formatOptions: object;
  paryrateLst: PayRateUnit[];
  PayorRequiredArray: PayorRequiredID[]
  ///////////////////////////////////////////////Event Emitter///////////////////////////////////////////////////////////
  @Input() ViewEdit: IsViewEdit;
  @Output() isViewEdit = new EventEmitter<IsViewEdit>();
  @Output() valueChange = new EventEmitter();
  @Output() payratevalueChange = new EventEmitter();
  @Output() openservice = new EventEmitter();
  EmployeeRelation: relationship = new relationship();
  payoRequiredViewEdit: IsViewEditpayorequired = {
    isView: true, isEdit: false, isEditPayorRequired: false, employeeId: 0, payorRequiredId: 0, payorRequired:[] , payorActiotype: ''
  };
  payrateview: IsViewEditpayrate = {
    isView: true, isEdit: false, isEditPayorrate: false, employeeId: 0, payrateId: 0, payrate:[],
    payratetype: ''
  };
  //////////////////////////////////Table Intialize variable///////////////////////////////////////////////////////////////
  filterOptions: FilterSettingsModel;
  initialPage: object;
  grid: GridComponent;
  keygrid: GridComponent;
  filter: IFilter;
  //////////////////////////////////////Drop down variable/////////////////////////////////////////////////////////////////

  EmployeestatusList: [{ Key: number, Value: string }];
  EmployeeTypeList: [{ Key: number, Value: string }];
  WithHoldingList: [{ Key: number, Value: string }];
  GenderList: [{ Key: number, Value: string }];
  LocationList: [{ Key: number, Value: string }];
  PayCHeckType: [{ Key: number, Value: string }];
  disabilityLst: [{ Key: number, Value: string }];
  raceLst: [{ Key: number, Value: string }];
  jobLst: [{ Key: number, Value: string }];
  vetranDisabilityLst: [{ Key: number, Value: string }];
  /////////////////////////////////////////////view variable //////////////////////////////////////////////////////////////
  editEmployeeId: number = 0;
  isEditEmployee: boolean = false;
  isView: boolean = false;
  isEdit: boolean = false;
  isPayorRequiredEdit: boolean = false;
  isPayRateEdit: boolean=null ;
  Employeedata: Employee[];
  payrollList: PayRollInformation = new PayRollInformation();
  onboardLst: OnboardList[];
  isServiceCreate: boolean = false;
  isServiceUpdate: boolean = false;
  public masterServiceList: any = [];
  availableActivities = [];
  selectedActivities = [];
  servName: any;
  serviceData: any = [];
  servieenable: boolean = false;
  public setfield = {
    text: "Value"
  }
  ////////////////////////////////////////Date piker ////////////////////////////////////////////////////////////////////
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };

  public myDatePickerOptionsExpired: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    // disableSince: { year: new Date().getFullYear()-1, month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  public Keystatusoption: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  //////////////////////////////////file uplod variable///////////////////////////////////////////////////////////////
  selectedFile = null;
  selectedFileName: string = '';
  selectedindex: number = 0;
  onboardvaluechange: boolean = false;
  selected: boolean = false;
  onboardchange: boolean = false;
  stateList:any=[];
  ///////////////////////////////////////////////Constructor//////////////////////////////////////////////////////////////
  constructor(public EmployeeService: EmployeeService, private formBuilder: FormBuilder, public global: GlobalComponent, public general: generalservice,
    public dateservice: DateService, private datepipe: DatePipe, public toastrService: ToastrService, 
    private http: HttpClient,private ref: ChangeDetectorRef,public commonhttp: CommonHttpService) {
   
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      
      this.EmployeeDataForm = new FormGroup({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      EDob: new FormControl('', [Validators.required]),
      GenderLid: new FormControl('', [Validators.required]),
      StatusLid: new FormControl('', [Validators.required]),
      locationStatus: new FormControl(''),
      Street: new FormControl(''),
      MiddleName: new FormControl(''),
      Email: new FormControl('', [Validators.email]),
      Maritalstatus: new FormControl(''),
      Apt: new FormControl(''),
      Aka: new FormControl(''),
      Age: new FormControl(''),
      EmployeeTypeLid: new FormControl('', [Validators.required]),
      Phone1: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
      Phone2: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
      Zipcode: new FormControl(''),
      City: new FormControl(''),
      Steet: new FormControl(''),
      County: new FormControl(''),
      Umpi: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      Rnnpi: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      username: new FormControl(''),
      Password: new FormControl(''),
      RequireEVV: new FormControl(''),

    });
    this.resetPass = this.formBuilder.group({
      Password: ['', Validators.required]
    });
  }
  //////////////////////////////////////////////////Initial Setup///////////////////////////////////////////////////////

  ngOnInit() {
    this.commonhttp.getJSON().subscribe(data => {
    
      this.stateList=data;
  });
    this.getEmployeeType();
    this.getEmployeeStatus();
    this.getMaritialStatus();
    this.getGender();
    this.employeevalue();
    this.getpaycheck();
    this.getLocation();
    this.getDisablity();
    this.getJobType();
    this.getraceorethinicity();
    this.getVeteranDisablity();
    this.getpermission()
    this.filterOptions = { type: 'Excel' };
    this.filter = {
      type: 'Excel'
    };
  //public myDatePickerOptions: IMyDpOptions = {
    
    this.initialPage = { pageSizes: ['10', '20', '50'], pageSize: 10 }

    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    var doc=document.getElementById("fname");
    doc.focus();
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
    if (args.column.field != null) {
      if(args.data[args.column.field]!=null)
      {
      const tooltip: Tooltip = new Tooltip({
        content: args.data[args.column.field].toString(),
        position: 'RightCenter',


      }, args.cell as HTMLTableCellElement);
    }
  }
  }

  /////////////////////////////////////////////////Employee value set///////////////////////////////////////////////////

  employeevalue() {
    if (this.editEmployeeId != 0) {
      let val = this.ViewEdit.Employeedata;
      ////console.log(val);

      val.dob = this.datepipe.transform(val.dob, "MM/dd/yyyy");
      val.hiredate = this.datepipe.transform(val.hiredate, "MM/dd/yyyy");
      val.inactivedate = this.datepipe.transform(val.inactivedate, "MM/dd/yyyy");
      val.terminationdate = this.datepipe.transform(val.terminationdate, "MM/dd/yyyy");
      this.Employee = val;
      this.EmployeeDataForm.controls['EDob'].setValue({ formatted: val.dob })

      this.valueChange.emit(this.editEmployeeId);

      if (!val.requiredEVV) {
        this.EmployeeDataForm.controls['Password'].disable();
        this.EmployeeDataForm.controls['username'].disable();
      }
     

    }
    else {
      this.Employee = new Employee();
      this.Employee.id = 0;
      this.EmployeeDataForm.controls['Password'].disable();
      this.EmployeeDataForm.controls['username'].disable();
    }
  }

  /////////////////////////////////////////////////view change //////////////////////////////////////////////////////////

  ngOnChanges() {
    this.isEditEmployee = this.ViewEdit.isEditEmployee;
    this.isView = this.ViewEdit.isView;
    this.isEdit = this.ViewEdit.isEdit;
    this.editEmployeeId = this.ViewEdit.editEmployee;
    // this.Employeedata = this.ViewEdit.Employeedata;
  }

  //////////////////////////////////////////////get employee status/////////////////////////////////////////////////////

  getEmployeeStatus() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getEmployeeStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {

      this.EmployeestatusList = data;
      if (this.ViewEdit.editEmployee == 0) {
        this.Employee.statusLid = this.EmployeestatusList[0].Key
      }
    })

  }

  ///////////////////////////////////////////////get employee Type//////////////////////////////////////////////////////

  getEmployeeType() {
    let params = new URLSearchParams();
    params.append("Code", "EMPLOYEETYPE");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getEmployeeStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeTypeList = data;
      if (this.ViewEdit.editEmployee == 0) {
        this.EmployeeTypeList.forEach(element => {
          if (element.Value == "PCA Employee") {
            this.Employee.employeeTypeLid = element.Key;

          }
        });
      }
    })

  }

  ///////////////////////////////////////////////get Disablity//////////////////////////////////////////////////////

  getDisablity() {
    let params = new URLSearchParams();
    params.append("Code", "YESORNO");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getdisabilitylist(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.disabilityLst = data;
    })

  }

  ///////////////////////////////////////////////get VeteranDisablity//////////////////////////////////////////////////////

  getVeteranDisablity() {
    let params = new URLSearchParams();
    params.append("Code", "YESORNO");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getvetran(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.vetranDisabilityLst = data;
    })

  }

  ///////////////////////////////////////////////get job//////////////////////////////////////////////////////

  getJobType() {
    let params = new URLSearchParams();
    params.append("Code", "YESORNO");

    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getjoblist(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.jobLst = data;
    })

  }

  ///////////////////////////////////////////////get race//////////////////////////////////////////////////////

  getraceorethinicity() {
    let params = new URLSearchParams();
    params.append("Code", "RACEEHINICITY");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getracelst(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.raceLst = data;
    })

  }

  //////////////////////////////////////////////get Maritial Status ////////////////////////////////////////////////////

  getMaritialStatus() {
    let params = new URLSearchParams();
    params.append("Code", "WITHHOLDING");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getMaritialStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.WithHoldingList = data;
      //console.log(this.WithHoldingList);

    })

  }

  /////////////////////////////////////////////get Location ////////////////////////////////////////////////////////////

  getLocation() {
    let params = new URLSearchParams();
    params.append("Code", "LOCATION_STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getLocationr(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.LocationList = data;

    })

  }

  /////////////////////////////////////////////get Gender///////////////////////////////////////////////////////////////

  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.EmployeeService.getGender(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.GenderList = data;
    })

  }

  ///////////////////////////////////////////pay check Type////////////////////////////////////////////////////////////

  getpaycheck() {

    let url = "api/LOV/getLovDropDown?";
    let params = new URLSearchParams();
    params.append("Code", "PAYCHECKTYPE");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.EmployeeService.getPayCheckType(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.PayCHeckType = data;
    })
  }

  ////////////////////////////////////////////back function ////////////////////////////////////////////////////////////

  back() {
    this.isEdit = false;
    if (this.isView) {
      this.isView = false;

    }
    this.isViewEdit.emit({ isView: false, isEdit: false, isEditEmployee: false, editEmployee: 0, Employeedata: new Employee() })
  }

  ///////////////////////////////////////////Date piker function///////////////////////////////////////////////////////

  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'dob') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Employee.dob = val1;

        }
      }
      if (name == 'hiredate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Employee.hiredate = val1;
        }
      }
      if (name == 'inactivedate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Employee.inactivedate = val1;
        }
      }
      if (name == 'terminationdate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Employee.terminationdate = val1;
        }
      }
    }
    if (type == "datechagned") {
      if (name == 'dob') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Employee.dob = val1;
          this.calculateAge(this.Employee);
          this.EmployeeChange()
        }
      }
      if (name == 'hiredate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Employee.hiredate = val1;
          this.EmployeeChange()
        }
      }
      if (name == 'inactivedate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Employee.inactivedate = val1;
          this.EmployeeChange()
        }
      }
      if (name == 'terminationdate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Employee.terminationdate = val1;
          this.EmployeeChange()
        }
      }
    }
  }

  ////////////////////////////////////////OnBoard Date function////////////////////////////////////////////////////////

  onBoarddates(event, type, onboard,value) {
    if (type == "inputchage") {

      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
        if(value=='completedOn')
        {

          onboard.completedOn = val1
        }
        else if(value=='ExpiredOn')
        {

          onboard.expiredOn = val1
        }
        this.onboard();
      }

    }
    if (type == "datechagned") {

      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        // this.Employee.dob = val1; 
        if(value=='completedOn')
        {

          onboard.completedOn = val1
        }
        else if(value=='ExpiredOn')
        {

          onboard.expiredOn = val1
        }
        this.onboard();

      }

    }

    //console.log("date===========",onboard);
    
  }

  /////////////////////////////////////////evv switch function/////////////////////////////////////////////////////////

  onIsFollowUpChanged() {
    this.requireEVV = !this.requireEVV;
  }

  //////////////////////////////////////////Calculate Age/////////////////////////////////////////////////////////////

  calculateAge(emplList) {

    if (emplList.dob != "" && emplList.dob != undefined && emplList.dob != null) {
      var bdate = new Date(emplList.dob);

      if (emplList.dob != "") {
        var timeDiff = Math.abs(Date.now() - bdate.getTime());
        emplList.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

      }
    }
  }

  ///////////////////////////////////////SSN Input Validation////////////////////////////////////////////////////////

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  enablePayRate() {

  }
  ////////////////////////////////////get payroll information ////////////////////////////////////////////////////////

  GetPayRollDetail() {

    let payrollparams = new URLSearchParams();
    payrollparams.append("EmployeeID", this.editEmployeeId.toString());
    this.EmployeeService.getpayrollInfrom(payrollparams).subscribe((data: PayRollInformation) => {
      this.payrollList = data;
      //console.log(this.payrollList)
    });
  }
  ////////////////////////////////get onboard////////////////////////////////////////////////////////////////////////

  getOnboarddata() {

    let myparams = new URLSearchParams();

    myparams.append("agencyId", this.global.userID)
    myparams.append("EmployeeID", this.editEmployeeId.toString());
    myparams.append("type1",this.fp.onboardtype1.toString());
    myparams.append("type2", this.fp.onboardtype2.toString());
    this.EmployeeService.getOnBoard(myparams).subscribe((data: OnboardList[]) => {
      this.onboardLst = data;
      //console.log(this.onboardLst,"data========");
      
      this.onboardLst.forEach(element => {
        element.completedOn = this.datepipe.transform(element.completedOn, "MM/dd/yyyy");
        element.expiredOn= this.datepipe.transform(element.expiredOn, "MM/dd/yyyy");
      });
      
    });
  }
  /////////////////////////////file onchange/////////////////////////////////////////////////////////////////////////

  onFileChanged(file, i) {
    this.selectedFile = file.item(0);
    this.selectedFileName = this.selectedFile.name;

    this.selectedindex = i;
    this.onboardvaluechange = true;
    this.selected = true;

  }
  /////////////////////////////upload onboard file////////////////////////////////////////////////////////////////

  async onUploadFile(onboard, i) {
    //console.log(onboard);
    let val = onboard[i].onboardLid;

    const fd = new FormData();
    fd.append('OnboardLid', val);
    fd.append('agengyId', this.global.globalAgencyId);
    fd.append('onboardfile', this.selectedFile);
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "multipart/form-data",
    //   })
    // };
    //console.log(this.selectedFile);
    //console.log(this.selectedFile.name);
    let basevalue = await this.tobase64(this.selectedFile);
    let obj = {
      OnboardLid: val,
      agengyId: parseInt(this.global.globalAgencyId.toString()),
      Onboardfile: basevalue,
      filename: this.selectedFile.name
    }
    //console.log(obj);
    this.EmployeeService.uploadOnboard(obj).subscribe((data: returnonboard) => {
      onboard[i].fileName = data.fileName
      onboard[i].filePath = data.filePath
      onboard[i].containerName = data.containerName
      onboard[i].uploadurl = data.uploadurl


    });
  }

  //////////////////////////////download onboard file/////////////////////////////////////////////////////////////////

  downloadonboardFile(file) {
    //console.log(file);
    if (file != null) {
      window.open(file);
    }

  }

  ////////////////////////////Save Employee/////////////////////////////////////////////////////////////////////////

  saveEmployee(savedata) {
    this.loading = true;
    console.log(savedata);
this.global.globalemployeedata=new Employee();
this.global.globalemployee=0;


    let employeesave = JSON.parse(JSON.stringify(savedata))
    //console.log(new Date(employeesave.hiredate));
    //console.log(new Date(employeesave.inactivedate));
    //console.log(new Date(employeesave.terminationdate));
    if (new Date(employeesave.hiredate) != undefined && new Date(employeesave.inactivedate) != undefined && employeesave.hiredate != null
      && employeesave.inactivedate) {
      if (new Date(employeesave.hiredate).getTime() > new Date(employeesave.inactivedate).getTime()) {
        this.toastrService.error('Inactive Date shold greater than Hire date', 'Warning');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        return
      }
    }
    if (new Date(employeesave.inactivedate) != undefined && new Date(employeesave.terminationdate) != undefined && employeesave.inactivedate
      && employeesave.terminationdate) {
      if (new Date(employeesave.inactivedate).getTime() > new Date(employeesave.terminationdate).getTime()) {
        this.toastrService.error('Terminate Date shold greater than Inactive Date', 'Warning');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        return
      }
    }
    if (new Date(employeesave.hiredate) != undefined && new Date(employeesave.terminationdate) != undefined && employeesave.hiredate
      && employeesave.terminationdate) {
      if (new Date(employeesave.hiredate).getTime() > new Date(employeesave.terminationdate).getTime()) {
        this.toastrService.error('Terminate Date shold greater than Hire date', 'Warning');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        return
      }
    }
    //console.log(savedata);
    employeesave.dob = new Date(employeesave.dob + " " + "00:00:00" + " " + "GMT").toISOString();
    employeesave.inactivedate = employeesave.inactivedate != null ? new Date(employeesave.inactivedate + " " + "00:00:00" + " " + "GMT").toISOString() : null;
    employeesave.hiredate = employeesave.hiredate != null ? new Date(employeesave.hiredate + " " + "00:00:00" + " " + "GMT").toISOString() : null;
    employeesave.terminationdate = employeesave.terminationdate != null ? new Date(employeesave.terminationdate + " " + "00:00:00" + " " + "GMT").toISOString() : null;
    employeesave.statusLid = parseInt(this.Employee.statusLid.toString());
    employeesave.genderLid = parseInt(employeesave.genderLid.toString());
    employeesave.agencyId = parseInt(this.global.globalAgencyId);
    employeesave.phone1 = employeesave.phone1 != null ? this.general.reconverPhoneGoogleLib(employeesave.phone1) : null;
    employeesave.phone2 = employeesave.phone2 != null ? this.general.reconverPhoneGoogleLib(employeesave.phone2) : null;
    employeesave.statusLid = employeesave.statusLid != null ? parseInt(employeesave.statusLid) : null;
    employeesave.locationStatusLid = employeesave.locationStatusLid != null ? parseInt(employeesave.locationStatusLid.toString()) : null;
    employeesave.maritalStatus = employeesave.maritalStatusLid != null ? parseInt(employeesave.maritalStatusLid.toString()) : null;
    employeesave.employeeTypeLid = parseInt(employeesave.employeeTypeLid.toString());
    employeesave.disabilityLid = employeesave.disabilityLid != null ? parseInt(employeesave.disabilityLid.toString()) : null
    employeesave.raceEthnicityLid = employeesave.raceEthnicityLid != null ? parseInt(employeesave.raceEthnicityLid.toString()) : null
    employeesave.veteranDisabledLid = employeesave.veteranDisabledLid != null ? parseInt(employeesave.veteranDisabledLid.toString()) : null
    employeesave.primaryJobId = employeesave.primaryJobId != null ? parseInt(employeesave.primaryJobId.toString()) : null
    //console.log(employeesave);
    if (employeesave.id == 0 || employeesave.id == null) {
      employeesave.id = 0
      this.EmployeeService.saveEmployeedata(employeesave).subscribe((data: any) => {
        //console.log(data)
        this.Employee.id = data.employeeId;
        this.toastrService.success('Employee Created successfully', 'Employee Created');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.loading = false;
        this.employeevaluechange = false;
        this.editEmployeeId = data.employeeId;
      },(err:HttpErrorResponse)=>{
        this.toastrService.success(err.error, 'save error');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      })
    }
    else {
      this.EmployeeService.saveEmployeedata(employeesave).subscribe((data: any) => {
        this.Employee.id = data.employeeId;
        this.toastrService.success('Employee Updated successfully', 'Employee Updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.loading = false;
        this.back();
      },(err:HttpErrorResponse)=>{
        this.toastrService.success(err.error, 'save error');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      })
    }
  }

  //////////////////////save payroll//////////////////////////////////////////////////////////////////////////////

  SavePayrolldata() {

    this.payrollList.allCompanyPayrollID = this.payrollList.allCompanyPayrollID != null ? this.payrollList.allCompanyPayrollID : null;

    this.payrollList.employeeId = this.editEmployeeId;


    if (this.payrollList.id !== 0 && this.payrollList.id != null) {


      this.EmployeeService.savePayroll(this.payrollList).subscribe((data: number) => {
        this.payrollList.id = data;
        this.toastrService.success('Employee Payroll Infromation Updated successfully', 'Payroll Updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      });
    }
    else {
      this.EmployeeService.savePayroll(this.payrollList).subscribe((data: number) => {
        this.payrollList.id = data;
        this.toastrService.success('Employee Payroll Infromation created successfully', 'Payroll created');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      });
    }
  }

  //////////////////////////////save Onboard///////////////////////////////////////////////////////////////////////

  saveOnboardData() {

    this.onboardLst.forEach(element => {
      element.employeeId = this.editEmployeeId,
        //console.log(element.completedOn)
      element.completedOn = element.completedOn != null ? new Date(element.completedOn + " " + "00:00:00" + " " + "GMT").toISOString() : null;
      element.expiredOn = element.expiredOn != null ? new Date(element.expiredOn + " " + "00:00:00" + " " + "GMT").toISOString() : null;
      //console.log(element.completedOn)
    });

    if (this.onboardLst[0].id == 0) {
      this.EmployeeService.saveOnBoard(this.onboardLst).subscribe((data: number) => {
        this.onboardLst.forEach(element => element.completedOn = this.datepipe.transform(element.completedOn, "MM/dd/yyyy"))
        this.toastrService.success('Employee OnBoard created successfully', 'OnBoard created');
        document.getElementById("openOnboard").click()
        this.onboardchange = false
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);

        ;
      })
    }
    else {
      this.EmployeeService.saveOnBoard(this.onboardLst).subscribe((data: number) => {
        this.onboardLst.forEach(element => element.completedOn = this.datepipe.transform(element.completedOn, "MM/dd/yyyy"))
        document.getElementById("openOnboard").click()
        this.onboardchange = false;
        this.toastrService.success('Employee OnBoard Updated successfully', 'OnBoard Updated');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);

      })
    }

  }

  ////////////////////////////////////get Zip////////////////////////////////////////////////////////////////

  getZip() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.Employee.street)
    myParams1.append("City", this.Employee.city)
    myParams1.append("State", this.Employee.steet)
    this.EmployeeService.getZip(myParams1).subscribe((data: zip) => {
      this.Employee.county = data.county;
      this.Employee.zipcode = data.zipcode;
    });
  }

  ///////////////////////////////switch relation page/////////////////////////////////////////////////////////

  getrelation() {
    this.relationenable = true;
    this.EmployeeRelation = { Id: this.editEmployeeId, RelationType: 'Employee', type: "list" }

  }
  /////////////////////////////////open new relation////////////////////////////////////////////////

  createNewRelation() {
    this.EmployeeRelation = { Id: this.editEmployeeId, RelationType: 'Employee', type: "new" }
  }

  /////////////////////////////////////Event Emit from payor Reqired Id //////////////////////////////////////

  dataEmitfromChild(event: IsViewEditpayorequired) {
    console.log(event)
    // setTimeout(() => {
      this.isPayorRequiredEdit = event.isEdit;
      this.payoRequiredViewEdit = event;
    // }, 1000);


  }

  ///////////////////////////////////////Event Emit pay rate//////////////////////////////////////

  dataEmitfromPayrate(event: IsViewEditpayrate) {
    console.log(event)
    setTimeout(() => {
      this.isPayRateEdit = event.isEdit;
      this.payrateview = event;
    }, 1000);
console.log(this.payrateview,"payrate=======");


  }
  ///////////////////////////moniter Employee form value change///////////////////////////////////////

  EmployeeChange() {
    this.employeevaluechange = true;
    //console.log(this.employeevaluechange)


  }
  /////////////////////////close function////////////////////////////////////////////////////////////

  backfuction() {
    this.global.globalemployeedata=new Employee();
this.global.globalemployee=0;
    if (this.employeevaluechange == true) {
      document.getElementById('cancelmodal').click()

    }
    else {
      this.back();
    }
  }

  //////////////////////////phone validation////////////////////////////////////////////////////////////


  DemographicPhoneFormat1() {
    //console.log(this.Employee.phone1);

    this.Employee.phone1 = this.general.converPhoneGoogleLib(this.Employee.phone1);
  }
  DemographicPhoneFormat2() {
    this.Employee.phone2 = this.general.converPhoneGoogleLib(this.Employee.phone2);
  }
  ////////////////////get work histry/////////////////////////////////////////////
  getworkhistry() {
    this.workhistryEnable = true;
    //console.log(this.Employee)
    this.workHistryTable.forEach((element) => {
      element.hiredate = this.Employee.hiredate != null ? new Date(this.Employee.hiredate).toLocaleDateString() : null,
        element.terminatedate = this.Employee.terminationdate != null ? new Date(this.Employee.terminationdate).toLocaleDateString() : null
    })

    //console.log(this.workHistryTable)
  }
  /////////////////////////////////tab change///////////////////////////////////////////////////////////////
  tabchange(val) {
    this.activeTab = val;
    if(val=='payor')
    {
      this.isPayorRequiredEdit=false;
    }
    else
    {
      this.isPayorRequiredEdit=null;
    }
    if(val=='payrate')
    {
      this.isPayRateEdit=false
    }
    else
    {
      this.isPayRateEdit=null;
    }
  }
  /////////////////////////file to base64/////////////////////////////////////////////////////
  tobase64 = value => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = (e: any) => resolve(e.target.result);
    reader.onerror = error => reject(error);
  });
  ////////////////////////////////on board alert/////////////////////////////////////////////////////
  onboard() {
    this.onboardchange = true;
  }
  closeOnboard() {
    if (this.onboardchange == true) {
      document.getElementById("onboardalert").click()
    }
    else {
      document.getElementById("openOnboard").click()
    }

  }
  onboardclose() {
    document.getElementById("openOnboard").click()
  }
  getpermission() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermissionemployee?";
    params.append("pagecode", "Employee");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.EmployeeService.getEmployeepermission(params).subscribe((data: any) => {

      if (data != null) {
        this.fp = data;
//console.log(data,"fp======");

      }
      else {
        this.fp = new functionpermission();
      }
    },
      (err: HttpErrorResponse) => {
        this.fp = new functionpermission();
      })
  }
  switchchange() {

    if (this.Employee.requiredEVV) {
      this.EmployeeDataForm.controls['Password'].enable();
     
        this.EmployeeDataForm.controls['username'].enable();
    
    }
    else {
      this.EmployeeDataForm.controls['Password'].disable();
      this.EmployeeDataForm.controls['username'].disable();
    }
  }
  passvalid(event) {

    let str = event.target.value;
    let res;

    if (str.match(/[a-z]/g) && str.match(
      /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
          /[^a-zA-Z\d]/g) && str.length >= 8) {
      this.passerror = false;
    }
    else {
      this.passerror = true;
    }
  }
  //============================== Service ==================================================================//
  Service() {
    this.isServiceCreate = true;
    this.isServiceUpdate = false;
    // this.dialogService.open(Cliservice);
    this.getMappedServiceActivities();
    this.Createservice();
  }
  //=================================get service list ======================================================//
  MYEMPlooyee: any;
  getMappedServiceActivities() {
    // let url = "api/ClientServiceActivity/getMappedServiceData?";
    if (this.MYEMPlooyee == null || this.MYEMPlooyee == undefined) {
      this.MYEMPlooyee = this.editEmployeeId;
    } else {
      this.MYEMPlooyee = this.Employee.id;
    }
    let myparams = new URLSearchParams();
    myparams.append("EmployeeID", this.editEmployeeId.toString());
    this.EmployeeService.getServiceActivity(myparams).subscribe((data) => {
      this.serviceData = [];
      this.serviceData = data;
      console.log("serviceData", data);
      if (this.serviceData.length == 0) {
        this.servieenable = true;
      }
      else {
        this.servieenable = false;
      }

    },
      err => {

      })
  }
  Createservice() {
    this.servName = null;
    this.isServiceCreate = true;
    this.isServiceUpdate = false;
    // this.selectedActivities = [];
    // this.availableActivities = [];
    // let url = "api/MasterServiceActivity/getServiceData?";
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    // let url = "api/MasterService/masterServicedropdown"
    this.EmployeeService.getService(params).subscribe((data: any) => {
      this.masterServiceList = data;
      console.log("masterServiceList", data);
      this.masterServiceList.forEach(element => {
        element.label = element.masterServiceCode;
        element.value = element.id;
      })

    },
      (err: HttpErrorResponse) => {

      }

    )
  }
  //=================================================================================================//
  onServiceChange(serviceId) {
    //console.log(serviceId);
    if (serviceId != undefined) {
      this.getMappedActivities(serviceId);
    }
  }
  //==================================================================================================//
  getMappedActivities(MasterServiceId) {
    this.availableActivities = [];
    this.selectedActivities = [];
    let myparams = new URLSearchParams();
    myparams.append("ServiceId", MasterServiceId);
    myparams.append("EmployeeId", this.editEmployeeId.toString());
    myparams.append("AgencyId", this.global.globalAgencyId);
    this.EmployeeService.getMappedService(myparams).subscribe((data: any) => {
      //console.log("availableActivities", data);
      this.availableActivities = data.availableActivityPair;
      this.availableActivities.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      })
      this.selectedActivities = data.selectedAcitivityPair;
      this.selectedActivities.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      })
    },
      (err: HttpErrorResponse) => {

      }

    )
  }
  //=======================================Update Service Activity================================//

  ServiceErr: any = "";
  servicewarning: boolean = false;
  createMapping(servName, mapData) {
    mapData.forEach(element => {
      element.EmployeeId = this.editEmployeeId.toString(),
        element.MasterServiceActivityId
        = element.Key,
        element.id = 0
    });
    let url = "api/EmployeeServiceActivity/SaveEmployeeServiceActivity";
    this.http.post(url, mapData).subscribe((data: any) => {
      document.getElementById('configureService').click()
      this.toastrService.success(
        "Service has been configured successfully",
        "Service configured",
      ), 8000

      this.masterServiceList.forEach(element => {
        if (element.value == parseInt(servName)) {

          let obj = {
            masterServiceId: element.value,
            masterServiceName: element.label
          }
          // this.PEmpID = this.emplList.id;
          // this.getMappedServiceActivities(this.editEmployeeId.toString())
        }
      })



    }, (err: HttpErrorResponse) => {
      this.ServiceErr = "";
      this.ServiceErr = JSON.stringify(err.error);
      //this.servicewarning = true;
      setTimeout(() => {
        this.ServiceErr = "";
      }, 8000)
    })
  }
  serviceActivityErr: any = "";
  UpdateServiceActivity(mapData) {
    mapData.forEach(element => {
      element.EmployeeId = this.editEmployeeId,
        element.MasterServiceActivityId = element.Key,
        element.id = 0
    });
    if (mapData.length == 0) {
      mapData.push({ EmployeeId: this.editEmployeeId, MasterServiceId: parseInt(this.servName) });
    }
    let url = "api/EmployeeServiceActivity/updateServiceActivity";
    this.http.post(url, mapData).subscribe((data: any) => {
      document.getElementById('configureService').click()
      this.toastrService.success(
        "Service has been configured successfully",
        "Service configured",
      ), 8000
      // this.PEmpID = this.emplList.id;
      this.getMappedActivities(this.editEmployeeId)


    }, (err: HttpErrorResponse) => {
      this.ServiceErr = "";
      this.ServiceErr = JSON.stringify(err.error);

      setTimeout(() => {
        this.ServiceErr = "";
      }, 8000)
    })
  }
  //======================================== Edit Service =======================================//
  /////////////////////////////////editing the service mapped//////////////////////
  Editservice(MasterServiceId) {
    this.isServiceCreate = false;
    this.isServiceUpdate = true;
    // this.dialogService.open(serviceconfig);
    let url = "api/EmployeeServiceActivity/getServiceActivityList?";
    let myparams = new URLSearchParams();
    myparams.append("ServiceId", MasterServiceId);
    myparams.append("EmployeeId", this.editEmployeeId.toString());
    myparams.append("AgencyId", this.global.globalAgencyId);
    this.http.get(url + myparams).subscribe((data: any) => {
      this.availableActivities = data.availableActivityPair;
      this.availableActivities.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      })
      this.selectedActivities = data.selectedAcitivityPair;
      this.selectedActivities.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      })
    },
      (err: HttpErrorResponse) => {
      }

    )
  }
  //========================================================================================//
  ModalType: string;
  ActivityBool: boolean = false;
  ServiceActivityBool: boolean = false;
  CreateupdateServiceActivity(type: string) {
    //console.log("Modal Type==", this.ModalType);
    if (type == 'new') {
      this.ModalType = 'new';
      this.valuchangesServiceActivity();
      this.getMappedServiceActivities();
      // this.Createservice();
      this.ServiceActivityArray1.masterServiceId = null;
      this.ServiceActivityArray1.masterServiceId = 0;
      this.availableActivities = [];
      this.selectedActivities = [];
    } else {
      this.valuchangesServiceActivity();
      this.getMappedServiceActivities()
      // this.Createservice()
      this.ModalType = 'edit';
    }
  }
  selectdetailsservAct(data) {

    this.ServiceActivityArray1.masterServiceId = data.masterServiceId.toString();
  this.ServiceActivityArray1.masterServiceId = this.ServiceActivityArray1.masterServiceId.toString();
  this.ServiceActivityArray1.Id = data.employeeServiceActivityId;
  
  console.log("data==",this.ServiceActivityArray1);
    // this.ServiceActivityArray1.masterServiceId = data.masterServiceId;
    this.getActivityTypeSatus(parseInt(this.ServiceActivityArray1.masterServiceId))
  }
  valuchangesServiceActivity() {
    this.ServiceActivityBool = false;
  }
  openDialogServiceActivity() {
    //console.log("ServiceActivityBool", this.ServiceActivityBool);
    if (this.ServiceActivityBool == true) {
      document.getElementById('configureService').click();
    }
    else {
      // this.ServiceForm.markAsValid;
      // this.ServiceForm.markAsPristine;
      document.getElementById('ServiceActivitymodal').click();
    }
  }
  // selectActivityDetails(data: ClientServiceActivityBO){
  //   this.Activity = JSON.parse(JSON.stringify(data));
  // }

  ServiceActivityArray1: any = [];
  selectServiceActivityDetails(data) {
    this.ServiceActivityArray1 = JSON.parse(JSON.stringify(data));
    console.log(this.ServiceActivityArray1,"serviceactvity");
    
    this.getActivityTypeSatus(parseInt(this.ServiceActivityArray1.masterServiceId));
  }
  getActivityTypeSatus(serviceId) {
    let params = new URLSearchParams();
    params.append("serviceId", serviceId);
    params.append("EmployeeId",this.editEmployeeId.toString());
    params.append("AgencyId", this.global.globalAgencyId);
    this.EmployeeService.getMappedService(params).subscribe((data: any) => {
      //console.log("ServiceActivityArray data==", data);
      this.availableActivities = data.availableActivityPair;
      this.selectedActivities = data.selectedAcitivityPair;
    });
  }

  SaveOrUpdateServiceActivity(ServiceActivityArray1) {
    let url = "api/EmployeeServiceActivity/updateServiceActivity";
    ServiceActivityArray1.masterServiceId = Math.floor(Number(ServiceActivityArray1.masterServiceId));
    if (this.MYEMPlooyee == null || this.MYEMPlooyee == undefined) {
      this.MYEMPlooyee = this.global.employee_ID;
    } else {
      this.MYEMPlooyee = this.Employee.id;
    }
    if (this.selectedActivities.length != 0) {
      this.selectedActivities.forEach(element => {
        element.masterServiceId = ServiceActivityArray1.masterServiceId,
          // element.id = 0,
          element.masterServiceActivityId = element.Key,
          element.Id = ServiceActivityArray1.employeeServiceActivityId,
          element.employeeID = this.editEmployeeId
      });
    }
    else {
      this.selectedActivities.push({
        masterServiceId: ServiceActivityArray1.masterServiceId
      });
    }
    //console.log("selected activities", this.selectedActivities);
    this.http.post(url, this.selectedActivities).subscribe((data: any) => {
      //console.log("====save update=========", data);
      if (data) {
        this.valuchangesServiceActivity();
        //====================== sucess message =============
        if (this.ModalType == 'new') {
          this.toastrService.success('ServiceActivity Saved successfully', 'ServiceActivity Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          document.getElementById('configservice').click();
        } else {
          this.toastrService.success('ServiceActivity Updated successfully', 'ServiceActivity Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          document.getElementById('configservice').click();
        }
        this.getMappedServiceActivities();
        //  this.getServiceActivity();
      }
    }, (err: any) => {
      if (err) {
        //console.log("err.error", err.error);
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }
  ResetPasswrd(Status: string) {

    let myParams = new URLSearchParams();
    //console.log("Password=======", this.ResetPassword);
    // //console.log("userID=======",this.UserId);
    myParams.append("Userid", this.Employee.id.toString());
    myParams.append("password", this.ResetPassword);
    //console.log("Save Pwd data===", myParams);
    this.EmployeeService.ResetPassword(myParams).subscribe((data: any) => {
      //console.log("Data========", data);
      this.toastrService.success(
        'Password has been changed successfully!',
        'Password changed'), 8000;
      document.getElementById('ResetPwdmodal1').click();
      document.getElementById('Reset_Confirmation1').click();
      this.resetPass.reset();
    })
  }

  checkpopServiceActivity() {
    this.ServiceActivityBool = true;
  }
  //==================================Sub component edit changes============================//

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onKey(event, name) {
    
    if(name =='gender')
    {
      
//      var indx=parseInt(event.target.attributes.tabindex.value);
      var  elem = document.getElementById('dob');
           elem.focus()
        // for (var i=elems.length; i--;) {
        //   var tidx2 =parseInt( elems[i].getAttribute('tabindex'));
        
        //   if(indx==tidx2)
        //   {
        //     //console.log(elems[i].classList);
        //     elems[i].focus()
        //   }
        // }
    }
 

     
    if (name =='lastname') {
      console.log(event);
      var  elems = document.getElementsByTagName('input');
        for (var i=elems.length; i--;) {
          var tidx2 =parseInt( elems[i].getAttribute('tabindex'));
         
          if(elems[i].classList.contains("selection"))
          {
            console.log(elems[i].classList);
            elems[i].focus()
          }
        }
      }
     
    
   
  }
}

