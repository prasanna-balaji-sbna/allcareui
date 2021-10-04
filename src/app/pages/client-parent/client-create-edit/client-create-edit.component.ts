import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, Inject } from '@angular/core';
import {
  EditDetailsClient, ClientBO, EditDetailsAuthorization, EditSOCDetails, ClientCertificationBO, DocumentBO,
  ContactsBO, PhysicianBO, StartOfCareBO, ClientSOC, ClientReturnBO, sortingObj, carecoordinate,
  ClientCoordinatorRelationshipBO, relationship, getMappedCMDataBO, ClientCaseManagerRelationshipBO, LovBO,
  ClientNoteBO, type, functionpermission, ClientServiceActivityBO, editcertificate, getClient, GetClientEvaluation, GetClientCasemanager, GetClientCarecoordinator, GetClientNotes
} from '../client-parent.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from 'src/app/global/global.component';
import { ClientHttpService } from '../client-parent.service';
import { DataStateChangeEventArgs, FilterSettingsModel } from '@syncfusion/ej2-grids';
import { GridComponent, IFilter, SearchSettingsModel, ToolbarItems, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { generalservice } from 'src/app/services/general.service';
import { CommonHttpService } from 'src/app/common.service';
import { DatePipe } from '@angular/common';
import { DataUtil } from '@syncfusion/ej2-data';
import { IMyInputFieldChanged, IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ListBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ColumnChangeBO, columnWidth } from '../../icd10/icd10.model';
import { clienttserivce } from '../clientservice';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-client-create-edit',
  templateUrl: './client-create-edit.component.html',
  styleUrls: ['./client-create-edit.component.scss'],
  //  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCreateEditComponent implements OnInit {
  fp: functionpermission = new functionpermission()
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  initialPage: object;
  EvaluaionArray: any = []
  filterOptions: FilterSettingsModel;
  public formatOptions: object;
  contactvaluechange: boolean = false;
  careenable: boolean = false;
  caretype: string = ""
  caseenable: boolean = false;
  casetype: string = ""
  relation: relationship = new relationship()
  selectedFileName: string = ""
  ModalType: string;
  ActiveTab: string = "nav-soc"
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('gridEvaluation') public gridEvaluation: GridComponent;
  @ViewChild('gridcasemanager') public gridcasemanager: GridComponent;
  @ViewChild('gridcarecoordinator') public gridcarecoordinator: GridComponent;
  @ViewChild('griddocument') public griddocument: GridComponent;
  @ViewChild('gridnotes') public gridnotes: GridComponent;
  //=====================================Event emitter===================///
  @Input() DataFromList: EditDetailsClient = new EditDetailsClient();
  @Input() DataFromSOCEdit: EditSOCDetails = new EditSOCDetails();
  @Output() EventToEdit = new EventEmitter<EditDetailsClient>();
  @Input() DataFromCertificate = new EventEmitter<EditDetailsClient>();
  EditOptions: EditDetailsAuthorization = new EditDetailsAuthorization();
  EditSOCOptions: EditSOCDetails = new EditSOCDetails();
  EditCertificateoption: editcertificate = new editcertificate();
  //=================================Event Emitter variable===========================//
  ICD10value: string = "client";
  enableICD10: boolean = false;
  Activity: ClientServiceActivityBO = new ClientServiceActivityBO();
  LActivity: ClientServiceActivityBO[] = [];
  //==================================Array and list declaration=====================//
  Lclientlist: ClientBO[];
  ClientList: any = new ClientBO();
  LCertificationList: ClientCertificationBO[];
  ClientCertificationList = new ClientCertificationBO();
  ClientContactList: ContactsBO = new ContactsBO();
  Lsoclist: StartOfCareBO[] = [];
  carecoLst: carecoordinate[] = [];
  caseLst: getMappedCMDataBO[] = []
  DocumnetLst: DocumentBO[] = []

  passerror: boolean = false;
  documentList: DocumentBO = new DocumentBO();
  saveclientcare: ClientCoordinatorRelationshipBO = new ClientCoordinatorRelationshipBO();
  saveclientcase: ClientCaseManagerRelationshipBO = new ClientCaseManagerRelationshipBO();
  Notes: any = new ClientNoteBO();
  noteLst: ClientNoteBO[] = []
  type: type = new type();
  typelst: type[] = []
  typenumberAutoIcreament: number;
  isServiceCreate: boolean = false;
  isServiceUpdate: boolean = false;
  serviceData: any = [];
  public masterServiceList: any = [];
  servName: any = null;
  availableActivities: any = []
  selectedActivities = [];
  public height = '220px';
  //=====================================General initalizations=====================//
  statusList: [{ Key: number, Value: string }];
  locationList: [{ Key: number, Value: string }];
  genderList: [{ Key: number, Value: string }];
  conatactLiveWithList: [{ Key: string, Value: string }];
  conatactRelList: [{ Key: string, Value: string }];
  phoneCarrierList: [{ Key: number, Value: string }];
  companyList: [{ Key: number, Value: string }];
  ICD10List: [{ Key: string, Value: string }];
  CLientSOCList: [{ Key: string, Value: string }];
  DocumentName: any = [];
  ModelType: string = 'edit';
  email_form: FormGroup;
  typedropdown = []
  changevalue: boolean = false;
  relationenable: boolean = false;
  enablerelation: boolean = false;
  listId: number;
  previousTab: string = "";
  public formatOptions1: object
  //=============================Edit tabs==================================//
  EditAuthorization: boolean = false;
  EditSOC: boolean = false;
  Editcert: boolean = false;
  //====================================Datepicker options===================//
  today = new Date();
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };
  public myDatePickerOptionsDOB: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  //===============================Err initialisation=======================//
  saveorUpdatecertificationErr: string = "";
  ClientErrList: string[] = [];
  lovForm: FormGroup;
  Lov: LovBO = new LovBO();
  //=======================delete variable declaration=================================//
  deletecertificate: number;
  deletecareId: number;
  deletecaseId: number;
  deletedocId: number;
  deleteNoteId: number;
  public setfield = {
    text: "Value"
  }

  ColumnArray_Evaluation: columnWidth[]
  ColumnArray_care: columnWidth[]
  ColumnArray_case: columnWidth[]
  ColumnArray_clientnotes: columnWidth[]
  ColumnArray_documents: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
stateList:any=[]
dropdata:string[]=['Yes','No']
  public data: Observable<DataStateChangeEventArgs>;
  public datacase: Observable<DataStateChangeEventArgs>;
  public datacare: Observable<DataStateChangeEventArgs>;
  public datanotes: Observable<DataStateChangeEventArgs>;
  public datadocument: Observable<DataStateChangeEventArgs>;
  getClientEvaluation: GetClientEvaluation = new GetClientEvaluation();
  getClientCasemanager: GetClientCasemanager = new GetClientCasemanager();
  getClientCare: GetClientCarecoordinator = new GetClientCarecoordinator();
  getClientNotes: GetClientNotes = new GetClientNotes();
  getClientDocuments: GetClientCasemanager = new GetClientCasemanager();
  //=====================constructor=================================================/
  constructor(private ref: ChangeDetectorRef, public toastrService: ToastrService, public http: HttpClient, public datepipe: DatePipe, public commonhttp: CommonHttpService, public ClientService: ClientHttpService, public general: generalservice,
    private formBuilder: FormBuilder, public global: GlobalComponent, public router: Router, @Inject(clienttserivce) public clienttserivce: clienttserivce,) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
    this.email_form = this.formBuilder.group({
      Email: ['', Validators.email],
    });
    this.lovForm = this.formBuilder.group({

      Name: ['', Validators.required],



    });
    this.data = clienttserivce;
    this.datacase = clienttserivce;
    this.datacare = clienttserivce;
    this.datanotes = clienttserivce;
    this.datadocument = clienttserivce;

  }

  ngOnInit(): void {

    this.commonhttp.getJSON().subscribe(data => {
      
      this.stateList=data;
  });
    this.filterOptions = { type: 'Menu' };
    this.initialPage = { pageSizes: ['10', '20', '50', '100', '250'], pageSize: 10 };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.formatOptions1 = { type: 'date', format: 'MM/dd/yyyy HH:mm:ss' };
    //   console.log(this.DataFromList);
    this.global.clientId = this.DataFromList.clientId;
    this.EditOptions.ClientId = this.DataFromList.clientId;
    this.getpermission()
    this.getStatus();
    this.getLocation();
    this.getGender();
    this.getRelationStatus();
    this.getLiveWithStatus();
    this.getICD10List();
    this.relation.Id = this.global.clientId;
    this.relation.RelationType = 'Client'
  //  this.getColumnwidth();
    var doc=document.getElementById("fname");
    doc.focus();
    //  }
  }
  //================================tab function call=================================//
  getTabActiveData(Tabtocall) {

    //console.log(Tabtocall)
    //console.log(this.previousTab)
    this.ActiveTab = Tabtocall;
    if (Tabtocall != this.previousTab && this.previousTab == 'nav-contacts') {
      //console.log(this.contactvaluechange)
      if (this.contactvaluechange == true) {
        document.getElementById("opensavealert").click()
      }
    }
    if (Tabtocall == 'nav-certification') {
      //console.log("i'm here");

      //  this.getClientCertificationList();
      //    this.getStartofCareList();
      //     this.getCompanyList();
      // 

    }
    if (Tabtocall == 'nav-carecoordinators') {
      this.getclientCareLst()
    }
    if (Tabtocall == 'nav-casemanagers') {
      this.getclientCaseLst()
    }
    if (Tabtocall == 'nav-contacts') {
      this.getPhoneCarrierStatus()
      // this.getLiveWithStatus()
      // this.getRelationStatus()
      this.getClientContact()
    }
    if (Tabtocall == 'nav-evaluation') {
      this.getEvaluationArray()
    }
    this.previousTab = Tabtocall;
  }
  //========================================ng On changes====================//
  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
    //  console.log(f);
    this.ClientList = this.DataFromList.clientData;
    // console.log(this.ClientList)
    this.ClientList.dOB = this.datepipe.transform(this.ClientList.dOB, "MM/dd/yyyy");
    //console.log(this.ClientList.dOB)
    this.global.clientId = this.DataFromList.clientId;
    var doc=document.getElementById("fname");
    doc.focus();
    //console.log(this.ClientList)
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
  dataEmitfromChild(event: EditDetailsAuthorization) {
    //console.log("Incoming edit event", event);
    this.EditAuthorization = event.isEdit;
    this.EditOptions = event;
  }

  dataEmitfromChildSOC(event: EditSOCDetails) {
    //console.log("Incoming edit event", event);
    this.EditSOC = event.isEdit;
    this.EditSOCOptions = event;
  }

  EventfromSOCEdit(event: EditSOCDetails) {
    this.EditSOC = event.isEdit;
    this.EditSOCOptions = event;
  }
  //==================================Lov Call============================//

  getStatus() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.statusList = data;
      if (this.global.clientId == 0) {
        this.ClientList.statusLid = this.statusList.filter(s => s.Value == "Active")[0].Key
      }

    })
  }

  getLocation() {
    let params = new URLSearchParams();
    params.append("Code", "LOCATION_STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.locationList = data;
    })
  }


  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.genderList = data;
    })
  }

  getRelationStatus() {
    let params = new URLSearchParams();
    params.append("Code", "RELATIONSHIP");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: any) => {
      data.forEach(element => {
        element.Key = element.Key.toString();
      });
      this.conatactRelList = data;
      //  console.log(this.conatactRelList,"COntact list");

    })
  }

  getLiveWithStatus() {
    let params = new URLSearchParams();
    params.append("Code", "LIVEWITH");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: any) => {
      data.forEach(element => {
        element.Key = element.Key.toString();
      });
      this.conatactLiveWithList = data;
      //  console.log(this.conatactLiveWithList,"COntact list");
    })
  }

  getPhoneCarrierStatus() {
    let params = new URLSearchParams();
    params.append("Code", "PHONECARRIER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: any) => {
      this.phoneCarrierList = data;
    })
  }


  //======================close carecordinator========================================//
  closecarecoordinator() {
    document.getElementById('carecoordinator').click();
  }
  closecasemanager() {
    document.getElementById('casemanager').click();
  }
  //=================================Restrict text in text field======================//
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //==================================get certification list========================//
  getClientCertificationList() {
    let myParams = new URLSearchParams();
    //console.log(this.global.clientId)
    myParams.append("clientId", this.global.clientId.toString());
    this.ClientService.getCertificationList(myParams).subscribe((data: any = []) => {
      this.LCertificationList = data;
      //console.log(data)
    })
  }


  //=======================================Phone number format========================//
  DemographicPhoneFormat() {
    this.ClientList.phone1 = this.general.converPhoneGoogleLib(this.ClientList.phone1);
  }
  DemographicPhoneAltFormat() {
    this.ClientList.phone2 = this.general.converPhoneGoogleLib(this.ClientList.phone2);
  }
  EmergencyFormatPhone() {
    //console.log("emer phone", this.ClientContactList.emergencyPhone);

    this.ClientContactList.emergencyPhone = this.general.converPhoneGoogleLib(this.ClientContactList.emergencyPhone);
  }
  AlternateFormatPhone() {
    this.ClientContactList.emergencyAlternatePhone = this.general.converPhoneGoogleLib(this.ClientContactList.emergencyAlternatePhone);
  }
  GuardianFormatPhone() {
    this.ClientContactList.guardianPhone = this.general.converPhoneGoogleLib(this.ClientContactList.guardianPhone);
  }
  RPFormatPhone() {
    this.ClientContactList.responsiblePartyPhone = this.general.converPhoneGoogleLib(this.ClientContactList.responsiblePartyPhone);
  }
  //============================================Get zip code ==========================//
  getzipcodeClient() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ClientList.street)
    myParams1.append("City", this.ClientList.city)
    myParams1.append("State", this.ClientList.state)
    this.commonhttp.getZipCodeDetails(myParams1).subscribe((data: any) => {
      this.ClientList.zipCode = data.zipcode;
      this.ClientList.county = data.county
    })
  }


  getzipcodeEmergency() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ClientContactList.emergencySteet)
    myParams1.append("City", this.ClientContactList.emergencyCity)
    myParams1.append("State", this.ClientContactList.emergencyState)
    this.commonhttp.getZipCodeDetails(myParams1).subscribe((data: any) => {
      this.ClientContactList.emergencyZipCode = data.zipcode;
    })
  }

  getzipcodeAlternate() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ClientContactList.emergencyAlternateSteet)
    myParams1.append("City", this.ClientContactList.emergencyAlternateCity)
    myParams1.append("State", this.ClientContactList.emergencyAlternateState)
    this.commonhttp.getZipCodeDetails(myParams1).subscribe((data: any) => {
      this.ClientContactList.emergencyAlternateZipCode = data.zipcode;
    })
  }

  getzipcodeGuradian() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ClientContactList.guardianSteet)
    myParams1.append("City", this.ClientContactList.guardianCity)
    myParams1.append("State", this.ClientContactList.guardianState)
    this.commonhttp.getZipCodeDetails(myParams1).subscribe((data: any) => {
      this.ClientContactList.guardianZipCode = data.zipcode;
    })
  }

  getzipcodeRP() {
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.ClientContactList.responsiblePartySteet)
    myParams1.append("City", this.ClientContactList.responsiblePartyCity)
    myParams1.append("State", this.ClientContactList.responsiblePartyState)
    this.commonhttp.getZipCodeDetails(myParams1).subscribe((data: any) => {
      this.ClientContactList.responsiblePartyZipCode = data.zipcode;

    })
  }

  //===================================Get COmmon Icd10=========================//
  getICD10List() {
    this.commonhttp.getICD10().subscribe((data: any = []) => {
      this.ICD10List = data;
      this.ICD10List.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key.toString();
      })
      this.global.globalICD10List = this.ICD10List;
    })
  }
  //=========================================getcompany list=============================//
  getCompanyList() {
    let myParams = new URLSearchParams();
    // myParams.append("agencyId", this.global.globalAgencyId);
    myParams.append("agencyId", this.global.globalAgencyId);
    this.commonhttp.getCompany(myParams).subscribe((data: [{ Key: number, Value: string }]) => {

      this.companyList = data;
      this.companyList.forEach(element => {
        element.Value = element.Value;
        element.Key = element.Key;
      })
    })
  }

  //=========================================get soc date list=============================//
  getStartofCareList() {
    let myParams = new URLSearchParams();
    myParams.append("clientId", this.global.clientId.toString());
    this.commonhttp.getStartofCareListdate(myParams).subscribe((data: any = []) => {
      this.CLientSOCList = data;
      //console.log(this.CLientSOCList)
      this.CLientSOCList.forEach(element => {
        element.Value = this.datepipe.transform(element.Value, "M/d/yyyy");
        element.Key = element.Key.toString();
      })
    })
  }
  //==================================Lsoc list========================//
  getSOClist() {
    let SOCparams = new URLSearchParams();
    SOCparams.append("clientId", "1");
    this.ClientService.getClientSOClist(SOCparams).subscribe((data: StartOfCareBO[]) => {
      this.Lsoclist = data;
    });
  }
  //=================================Same as guardian ========================//
  sameAsGuardian(conList: ContactsBO) {

    if (conList.isSameAsGuardian == true) {

      this.ClientContactList.responsiblePartyName = conList.guardianName;
      this.ClientContactList.responsiblePartySteet = conList.guardianSteet;
      this.ClientContactList.responsiblePartyZipCode = conList.guardianZipCode;
      this.ClientContactList.responsiblePartyCity = conList.guardianCity;
      this.ClientContactList.responsiblePartyState = conList.guardianState;
      this.ClientContactList.responsiblePartyPhone = conList.guardianPhone;
      this.ClientContactList.responsiblePartyCarrierLid = conList.guardianPhoneCarrierLid;
      this.ClientContactList.responsiblePartyEmail = conList.guardianEmail;
    }
    else {

      this.ClientContactList.responsiblePartyName = " ";
      this.ClientContactList.responsiblePartySteet = " ";
      this.ClientContactList.responsiblePartyZipCode = " ";
      this.ClientContactList.responsiblePartyCity = " ";
      this.ClientContactList.responsiblePartyState = " ";
      this.ClientContactList.responsiblePartyPhone = " ";
      this.ClientContactList.responsiblePartyCarrierLid = 0;
      this.ClientContactList.responsiblePartyEmail = " ";
    }
  }
  //=========================================getDateformat===========================//
  dateFormateyyyyMMdd(date) {
    //console.log("date format", date);
    if (date != null) {
      let month = date.substring(0, 2);
      let day = date.substring(3, 5);
      let year = date.substring(6, 10);
      let days = +day;
      let months = +month;
      let years = +year;

      let newDate = new Date();
      newDate.setDate(days);
      newDate.setMonth(months - 1);
      newDate.setFullYear(years);
      //console.log(newDate);
      return this.datepipe.transform(newDate, "yyyy-MM-dd")
    }
  }
  //=================================Add/edit certification=========================//

  AddNewCertification(type: string) {

    //console.log("Im here in cer general", type);
    if (type == 'new') {
      //console.log("Im here in cer type");
      this.ModelType = 'new';
      this.ClientCertificationList = new ClientCertificationBO();

    }
    else {
      this.ModelType = 'edit';
    }
  }

  Certificationdatabind(data: ClientCertificationBO) {
    this.ClientCertificationList = data;
    this.ClientCertificationList.startOfCareId = this.ClientCertificationList.startOfCareId.toString();
    this.ClientCertificationList.icD10PrimaryId = this.ICD10List.filter(i => i.Value == this.ClientCertificationList.icD10PrimaryId)[0].Key.toString();
    this.ClientCertificationList.startDate = new Date(this.ClientCertificationList.startDate).toLocaleDateString();
    this.ClientCertificationList.endDate = this.ClientCertificationList.endDate != null ? new Date(this.ClientCertificationList.endDate).toLocaleDateString() : null;
  }

  //==========================================Date format options===============================//
  Certificationstartdatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.ClientCertificationList.startDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }

  onDateChangedCertificationStart(event: IMyDateModel) {
    ;
    this.ClientCertificationList.startDate = event.formatted;

  }
  Certificationenddatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {

      this.ClientCertificationList.endDate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }

  onDateChangedCertificationEnd(event: IMyDateModel) {
    this.ClientCertificationList.endDate = event.formatted;

  }

  onDateChanged(event: IMyDateModel) {
    //console.log(event)
    this.ClientList.dOB = event.formatted;
    var bdate = new Date(event.formatted);
    this.changevalue = true;
    if (event.formatted != "") {
      var timeDiff = Math.abs(Date.now() - bdate.getTime());
      this.ClientList.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

    }
  }

  DOBdatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.ClientList.dOB = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
      //console.log(this.ClientList.dOB)
      this.changevalue = true;
    }

  }
  //=========================================Search NPI===================================//
  searchNPI(NPI) {
    NPI = NPI != null ? parseInt(NPI) : null;
    let params = new URLSearchParams();
    params.append("searchNPI", NPI);
    this.ClientService.getNPIDetails(params).subscribe((data: PhysicianBO) => {
      if (data != null) {
        this.ClientCertificationList.physician = data.physicianName;
        this.ClientCertificationList.clinic = data.clinicName != null ? data.clinicName : '' + '' + data.clinicAddress != null ? data.clinicAddress : '' + ',' + data.clinicCity != null ? data.clinicCity : '' + ',' + data.clinicState != null ? data.clinicState : '' + ',' +
          data.zipCode != null ? data.zipCode : ''
      }
      else {
        this.ClientCertificationList.physician = "";
        this.ClientCertificationList.clinic = "";
        this.saveorUpdatecertificationErr = "";
        this.saveorUpdatecertificationErr = "Invalid NPI";
        if (this.saveorUpdatecertificationErr != "") {
          setTimeout(function () {
            this.saveorUpdatecertificationErr = "";
          }.bind(this), 8000);
        }
      }
    }, (err: HttpErrorResponse) => {
      this.saveorUpdatecertificationErr = ""
      this.saveorUpdatecertificationErr = err.error;
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
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
    if (args.column.field != null) {
      if (args.data[args.column.field] != null) {
        const tooltip: Tooltip = new Tooltip({
          content: args.data[args.column.field].toString(),
          position: 'RightCenter',


        }, args.cell as HTMLTableCellElement);
      }
    }
  }

  //==================================================================save and update client===============================//
  SaveClientDetails() {
    var saveList: ClientBO;
    saveList = JSON.parse(JSON.stringify(this.ClientList));
    saveList.agencyId = parseInt(this.global.globalAgencyId);
    saveList.statusLid = Math.floor(Number(this.ClientList.statusLid));
    saveList.genderLid = Math.floor(Number(this.ClientList.genderLid));
    saveList.age = Math.floor(Number(this.ClientList.age));
    saveList.locationStatusLid = this.ClientList.locationStatusLid != undefined ? Math.floor(Number(this.ClientList.locationStatusLid)) : null;
    saveList.weight = this.ClientList.weight != null ? Math.floor(Number(this.ClientList.weight)) : null;
    saveList.medicaid = this.ClientList.medicaid != null ? this.ClientList.medicaid : null;
    saveList.medicare = this.ClientList.medicare != null ? this.ClientList.medicare : null;
    saveList.email = this.ClientList.email != undefined ? this.ClientList.email : null;
    saveList.id = this.global.clientId;
    if (saveList.phone1 != null) {
      saveList.phone1 = this.general.reconverPhoneGoogleLib(this.ClientList.phone1);
    }
    if (saveList.phone2 != null) {
      saveList.phone2 = this.general.reconverPhoneGoogleLib(this.ClientList.phone2);
    }
    // console.log(saveList,"savvvb==");
    // console.log(saveList.dOB,"savvvb==");

    saveList.dOB = this.dateFormateyyyyMMdd(saveList.dOB);
    //console.log("save data", this.ClientList);
    if (this.global.clientId == 0) {
      this.ClientService.saveClientData(saveList).subscribe((data: ClientReturnBO) => {
        // this.ClientList.dOB = new Date(new Date(this.ClientList.dOB) + "Z").toLocaleDateString();
        // saveList.dOB = this.dateFormateyyyyMMdd(saveList.dOB);
        //  console.log(data.errorList.length);
        if (data.errorList.length == 0) {
          saveList.id = data.clientId;
          this.global.clientId = data.clientId;
          this.relation.Id = data.clientId;
          saveList.dOB = new Date(new Date(saveList.dOB) + "Z").toLocaleDateString();
          //   console.log(data.clientId)
          // console.log(this.global.clientId)
          this.toastrService.success('Client has been created successfully', 'Client Created');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.changevalue = false;
        }
        else {
          this.ClientErrList = [];
          this.ClientErrList = data.errorList;
          //  console.log(this.ClientErrList.toString());
          this.toastrService.error(this.ClientErrList.toString(), 'Error')
          setTimeout(() => {
            this.toastrService.clear()
          }, 8000);



          saveList.dOB = new Date(new Date(this.ClientList.dOB) + "Z").toLocaleDateString();
          if (saveList.phone1 != null) {
            saveList.phone1 = this.general.reconverPhoneGoogleLib(this.ClientList.phone1);
            saveList.phone1 = this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone1);
          }
          if (saveList.phone2 != null) {
            saveList.phone2 = this.general.reconverPhoneGoogleLib(this.ClientList.phone2);
            saveList.phone2 = this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone2);
          }
        }
      })
    }
    else {
      this.ClientService.saveClientData(saveList).subscribe((data: ClientReturnBO) => {
        if (data.errorList.length == 0) {
          this.ClientList.id = data.clientId;
          this.global.clientId = data.clientId;
          this.toastrService.success('Client has been updated successfully', 'Client Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.changevalue = false;
          this.back()
        }
        else {
          this.ClientErrList = [];
          this.ClientErrList = data.errorList;
          this.toastrService.success('Client has been created successfully', 'Client Created');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.ClientList.dOB = new Date(new Date(this.ClientList.dOB) + "Z").toLocaleDateString();
          if (this.ClientList.phone1 != null) {
            this.ClientList.phone1 = this.general.reconverPhoneGoogleLib(this.ClientList.phone1);
            this.ClientList.phone1 = this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone1);
          }
          if (this.ClientList.phone2 != null) {
            this.ClientList.phone2 = this.general.reconverPhoneGoogleLib(this.ClientList.phone2);
            this.ClientList.phone2 = this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone2);
          }
        }
      })
    }

  }

  //==============================================================Remove ssn==============================//
  removeSSN() {
    this.ClientList.sSN = null;
  }
  //======================================Data from ICD10================================================//
  ICD10data(event) {
    // this.ClientCertificationList.icD10PrimaryId
    //console.log(event);
    this.ClientCertificationList.icD10PrimaryId = event.toString();
    this.getICD10List();
    document.getElementById("ICD10eopen").click();
    this.enableICD10 = false;
  }
  Closedcdialog() {
    document.getElementById("ICD10eopen").click();
  }
  //=======================back to parent ==============================================================//
  back() {
    this.DataFromList.isEdit = false;
    this.DataFromList.isView = true;
    //console.log(this.DataFromList)
    this.EventToEdit.emit(this.DataFromList)
    this.global.globalICD10List = [];

  }
  //=======================Go to cosumer  ==============================================================//
  Goconsumer() {
    this.DataFromList.isEdit = false;
    this.DataFromList.isView = false;
    this.DataFromList.iscounsumer = true;
    ////console.log(this.DataFromList)
    this.EventToEdit.emit(this.DataFromList)
    this.global.globalICD10List = [];

  }
  //==============================check cerficate============================================================//
  checkCertificationValidation(socList) {
    //console.log(socList);


    this.saveorUpdatecertificationErr = "";


    if (new Date(socList.socDate).getTime() > new Date(socList.startDate).getTime()) {


      this.saveorUpdatecertificationErr = "Start date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
      //console.log(socList);
    }
    else if ((socList.endDate != null && socList.endDate != "" && socList.endDate != undefined)
      && (new Date(socList.socDate).getTime() > new Date(socList.endDate).getTime())) {


      this.saveorUpdatecertificationErr = "End date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
      //console.log(socList);
    }
    else if ((socList.endDate != null && socList.endDate != "" && socList.endDate != undefined)
      && (new Date(socList.startDate).getTime() > new Date(socList.endDate).getTime())) {


      this.saveorUpdatecertificationErr = "End date should be larger than selected start of care date"
      if (this.saveorUpdatecertificationErr != "") {
        setTimeout(function () {
          this.saveorUpdatecertificationErr = "";
        }.bind(this), 8000);
      }
      //console.log(socList);
    }
    else {
      if (this.saveorUpdatecertificationErr == "") {
        this.savephyscian(socList)


      }
    }
  }
  //===================================save physcian==========================================================//
  savephyscian(socList) {
    //console.log(socList)
    if (socList.npi != null && socList.physician != null && socList.npi != undefined &&
      socList.physician != undefined) {
      let val = {};
      if (socList.clinic == undefined || socList.clinic == '') {
        socList.clinic = null;
      }
      //console.log(socList)
      val = {
        Id: 0,
        NPI: socList.npi,
        PhysicianName: socList.physician,
        ClinicName: socList.clinic != null ? socList.clinic.split(',').length > 0 ? socList.clinic.split(',')[0] : null : null,
        ClinicAddress: socList.clinic != null ? socList.clinic.split(',').length > 1 ? socList.clinic.split(',')[1] : null : null,
        ClinicCity: socList.clinic != null ? socList.clinic.split(',').length > 2 ? socList.clinic.split(',')[2] : null : null,
        ClinicState: socList.clinic != null ? socList.clinic.split(',').length > 3 ? socList.clinic.split(',')[3] : null : null,
        ZipCode: socList.clinic != null ? socList.clinic.split(',').length > 4 ? socList.clinic.split(',')[4] : null : null,
      }


      this.ClientService.savephysican(val).subscribe((data: any) => {
        this.saveClientCertification(socList)
      },

        (err: HttpErrorResponse) => {


          this.saveorUpdatecertificationErr = "";
          this.saveorUpdatecertificationErr = err.error;
          if (this.saveorUpdatecertificationErr != "") {
            setTimeout(function () {
              this.saveorUpdatecertificationErr = "";
            }.bind(this), 8000);

          }
        });

    }
    else {
      this.saveClientCertification(socList);
      //console.log(socList)
    }
  }
  //========================================save certificate===================================================//
  saveClientCertification(socList) {
    //console.log(socList)
    socList = JSON.parse(JSON.stringify(socList));
    if ((socList.startDate != null && socList.startDate != "")) {

      let val = ""
      if (socList.endDate != null && socList.endDate != undefined && socList.endDate != "") {
        val = new Date(new Date(socList.endDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString()
      }
      else {
        val = null;
      }

      let certObj = {
        Id: socList.id,
        ClientId: this.global.clientId,
        StartOfCareId: socList.startOfCareId != null ? parseInt(socList.startOfCareId) : null,
        StartDate: new Date(new Date(socList.startDate).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString(),
        EndDate: val,


        CompanyId: socList.companyId != null ? parseInt(socList.companyId) : null,
        NPI: socList.npi,
        Icd10primaryId: this.ICD10List.filter(i => i.Key == socList.icD10PrimaryId)[0].Value,
        Icd10secondaryId: socList.icD10SecondaryId,
        Physician: socList.physician,
        Clinic: socList.clinic
      }




      socList.clientId = this.global.clientId;
      //console.log(socList)
      if (socList.id == 0) {
        this.ClientService.savecertificate(certObj).subscribe((data: any = []) => {



          this.toastrService.success(
            'Certificate has been created successfully!',
            'Certificate  created'), 3000;
          this.getClientCertificationList();
          document.getElementById("opencertificate").click()
        },


          (err: HttpErrorResponse) => {

            this.saveorUpdatecertificationErr = "";
            this.saveorUpdatecertificationErr = err.error;
            if (this.saveorUpdatecertificationErr != "") {
              setTimeout(function () {
                this.saveorUpdatecertificationErr = "";
              }.bind(this), 8000);

            }
          });
      }

      else {
        this.ClientService.savecertificate(certObj).subscribe((data: any = []) => {



          this.toastrService.success(
            'Certificate has been updated successfully!',
            'Certificate  updated'), 3000;
          this.getClientCertificationList();
          document.getElementById("opencertificate").click()
        },


          (err: HttpErrorResponse) => {

            this.saveorUpdatecertificationErr = "";
            this.saveorUpdatecertificationErr = err.error;
            if (this.saveorUpdatecertificationErr != "") {
              setTimeout(function () {
                this.saveorUpdatecertificationErr = "";
              }.bind(this), 8000);

            }
          });
      }
    }







  }
  //===============================delete certificate==========================================================//
  deleteCertificateConfirmation() {

    let params = new URLSearchParams();
    params.append("Id", this.deletecertificate.toString());
    this.ClientService.deletecertificate(params).subscribe((data: any) => {
      this.toastrService.success(
        "Certificate has been deleted successfully",
        "Certificate deleted",
      ), 8000
      document.getElementById('openModal1').click();
      this.getClientCertificationList();
    },
      (err: HttpErrorResponse) => {


        this.saveorUpdatecertificationErr = "";
        this.saveorUpdatecertificationErr = err.error;
        if (this.saveorUpdatecertificationErr != "") {
          setTimeout(function () {
            this.saveorUpdatecertificationErr = "";
          }.bind(this), 8000);

        }
      });
  }
  //===========================set value to close enable variable===========================================//
  changefunction() {
    this.changevalue = true;
  }
  //===================close alert====================================================================//
  clientvaluechange() {
    //console.log(this.changevalue)
    if (this.changevalue == true) {
      document.getElementById('cancelmodal').click()
    }
    else {
      this.back()

    }
  }
  //===================================event from care coordinator and save==============================================//
  evenfromcare(event) {
    //console.log(event)


    this.saveclientcare.careCoordinatorId = event;
    this.saveclientcare.clientId = this.global.clientId;
    this.ClientService.savecare(this.saveclientcare).subscribe((data: any) => {
      this.careenable = false;
      document.getElementById("Careopen").click();
      this.getclientCareLst();
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
    )
  }
  //===================================event from case Manager and save==============================================//
  evenfromcase(event) {
    //console.log(event)


    this.saveclientcase.caseManagerId = event;
    this.saveclientcase.clientId = this.global.clientId;
    this.ClientService.savecase(this.saveclientcase).subscribe((data: any) => {
      this.caseenable = false;
      document.getElementById("Caseopen").click();
      this.getclientCaseLst();
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
    )
  }
  //========================get care coordinator list===========================================================//
  getclientCareLst() {
    let param = new URLSearchParams()
    this.getClientCare.clientId = this.global.clientId;

    this.clienttserivce.executecarecoordinator(this.getClientCare)

    this.datacare.subscribe((data: any) => {
      this.carecoLst = data.result;
      this.carecoLst.forEach(c => {
        c.fax != null ? this.general.reconverPhoneGoogleLibhttpsave(c.fax) : null;
        c.alternateFax != null ? this.general.reconverPhoneGoogleLibhttpsave(c.alternateFax) : null;
        c.telephone != null ? this.general.reconverPhoneGoogleLibhttpsave(c.telephone) : null;
      })
    });
  }
  //======================get Client casemanger===============================================================//
  getclientCaseLst() {
    let param = new URLSearchParams()
    this.getClientCasemanager.clientId = this.global.clientId;

    this.clienttserivce.executecasemanager(this.getClientCasemanager)

    this.datacase.subscribe((data: any) => {
      this.caseLst = data.result;
      this.caseLst.forEach(c => {
        c.fax != null ? this.general.reconverPhoneGoogleLibhttpsave(c.fax) : null;
        c.alternateFax != null ? this.general.reconverPhoneGoogleLibhttpsave(c.alternateFax) : null;
        c.telephone != null ? this.general.reconverPhoneGoogleLibhttpsave(c.telephone) : null;
      })
    });
  }
  closecase() {
    document.getElementById("Caseopen").click()
  }
  //=====================delete client Care=================================================================//

  //==========================get Document================================================================//
  getDocumnets() {
    let params = new URLSearchParams();
    this.getClientDocuments.clientId = this.global.clientId;

    this.clienttserivce.executedocuments(this.getClientDocuments)

    this.datadocument.subscribe((data: any) => {
      this.DocumnetLst = data.result;
    })
  }
  //===================file Upload======================================================================//
  onDOCFileChanged(files) {
    let val = files.item(0);
    this.selectedFileName = val.name;
    this.documentList.attachments = files.item(0);
    this.documentList.filepath = val.name;

  }
  //==========================get DocumentName================================================================//
  getDocumnetNamelst() {
    let params = new URLSearchParams();
    params.append("Code", "DOCNAME");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getDocumentName(params).subscribe((data: any) => {
      this.DocumentName = data;
      this.DocumentName.forEach((element) => {

        this.listId = element.listId;
      })
    })
    //console.log(this.listId)
  }
  //========================save Document======================================================================//
  SaveDoc(documentdatas) {
    //console.log(documentdatas)
    let documentdata = JSON.parse(JSON.stringify(documentdatas))
    documentdata.documentNameLid = documentdata.documentNameLid.value != null ? parseInt(documentdata.documentNameLid.value) : null;
    //console.log(documentdata)
    let body = new FormData();
    body.append('ClientId', this.global.clientId.toString());
    body.append('DocumentNameLid', documentdata.documentNameLid);
    body.append('DocumentTitle', documentdata.documentTitle);
    body.append('Filepath', documentdata.filepath);
    body.append('Attachments', documentdatas.attachments);
    this.ClientService.saveDocumentData(body).subscribe((data) => {
      this.toastrService.success(
        "Document  has been added successfully",
        "Document added"
      );
      this.getDocumnets();
      document.getElementById("DocumentAddopen").click();
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //======================delete client care =======================================================//
  deleteCeare() {
    let params = new URLSearchParams();
    params.append("Id", this.deletecareId.toString());
    this.ClientService.deletecare(params).subscribe((data: any) => {
      this.toastrService.error(
        " Client Care Coordinator Deleted Successfully",
        "Care Coordinator Deleted",
      );
      document.getElementById("deletecarecoordinator").click()
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);
      this.getclientCareLst();
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //====================delete case========================================================//
  deleteCase() {
    let params = new URLSearchParams();
    params.append("Id", this.deletecaseId.toString());
    this.ClientService.deletecase(params).subscribe((data: any) => {
      this.toastrService.error(
        " Client Case Manager Deleted Successfully",
        "Case Manager Deleted",
      );
      document.getElementById("deletecasemanger").click()
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);
      this.getclientCaseLst();
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //=======================download Document===============================================//
  downloadFile(data) {

    var data1 = data.returnDocument;
    if (data1 != null) {
      window.open(data1);
    }
  }
  //==================save Lov===========================================================//
  saveLov(listParam) {
    let val = listParam.lovName.replace(/\s/g, "")
    //console.log(listParam.Orderby)
    let obj = {
      ListId: this.listId,
      Id: listParam.Id,
      lovCode: val.toUpperCase(),
      lovName: listParam.lovName,
      lovValue: null,
      orderby: 1,
      agencyId: this.global.userID == 0 ? 0 : parseInt(this.global.globalAgencyId)

    }
    this.ClientService.saveLovData(obj).subscribe((data: any) => {
      this.getDocumnetNamelst();
      this.toastrService.success(
        "Document name created successfully",
        "Document Name Created",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);
      document.getElementById("DocumentsLovopen").click()
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //========================Delete Document===================================================================//
  deleteDoc() {
    let params = new URLSearchParams();
    params.append("Id", this.deletedocId.toString());
    this.ClientService.deletedocument(params).subscribe((data: any) => {
      this.getDocumnets();
      this.toastrService.error(
        "Document  deleted successfully",
        "Document  Deleted",
      );
      setTimeout(() => {
        this.toastrService.clear()
      }, 8000);

      document.getElementById("deletedocument").click()
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //=================================open Note===========================================================//
  opennote() {
    this.getNoteList();

  }
  //=================================open new Note===========================================================//
  opennewnote() {
    this.getNoteList();
    this.getType();
    this.Notes = new ClientNoteBO();
    this.Notes.id = 0;
    this.Notes.date = this.datepipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm")
    this.Notes.initial = this.global.logginedUserName
    this.Notes.multipletype = []
    //console.log(this.Notes.multipletype)
    //console.log(this.Notes.multipletype.length)

    this.Notes.notes = ""
    // console.log(( this.Notes.multipletype.length==0)||( this.Notes.notes==''||  this.Notes.notes==null|| this.Notes.notes==undefined))
  }
  //=================================get Note===========================================================//
  getNoteList() {

    let myParams = new URLSearchParams();
    this.getClientNotes.clientId = this.global.clientId;

    this.clienttserivce.executenotes(this.getClientNotes)

    this.datanotes.subscribe((data: any) => {
      this.noteLst = data.result;
      // this.noteLst.forEach((element)=>{
      //   element.date=this.datepipe.transform(element.date,"'MM/dd/yyyy HH:mm:ss'")
      // })
    })
  }
  //=================================get Type===========================================================//
  getType() {
    this.ClientService.getTypeLst().subscribe((data) => {
      this.typelst = JSON.parse(JSON.stringify(data));
      this.typedropdown = data;
      if (this.typedropdown.length != 0) {
        this.typedropdown.forEach((element) => { element.id = element.id.toString() })
      }
      //console.log(this.typedropdown)
      if (this.typelst.length > 0) {
        //console.log(this.typelst[0].typeNumber)

        this.typenumberAutoIcreament = Math.max.apply(Math, this.typelst.map(function (o) { return parseInt(o.typeNumber) })) + 1;
      }
      else {
        this.typenumberAutoIcreament = 1;
      }
      this.type.typeNumber = this.typenumberAutoIcreament.toString();
    })
  }
  //=================================save Notes===========================================================//
  saveNote(data) {
    //console.log(data)
    let sendata = []
    let savedata = JSON.parse(JSON.stringify(data))
    let noteid = savedata.id
    let url = ""
    if (noteid == 0) {
      for (let i = 0; i < savedata.multipletype.length; i++) {
        let obj = {
          clientId: parseInt(this.global.clientId.toString()),
          typeListId: parseInt(savedata.multipletype[i]),

          companyId: null,
          date: savedata.date,
          initial: savedata.initial,
          notes: savedata.notes
        }
        //console.log()
        sendata.push(obj)
      }
      url = "api/ClientNote/SaveClientNote"
    }
    else {
      savedata.typeListId = parseInt(savedata.typeListId)
      sendata = savedata;

      url = "api/ClientNote/UpdateClientNote"
    }

    //console.log(sendata);
    this.ClientService.savenotedata(sendata, url).subscribe((data: any) => {
      if (noteid == 0) {
        this.toastrService.success(
          "Notes  Saved successfully",
          "Notes  Saved",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
      else {
        this.toastrService.success(
          "Notes  updated successfully",
          "Notes  updated",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      }
      this.getNoteList();
      document.getElementById("addnotesopen").click()
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //======================edit Note==========================================================================//
  editNote(data) {
    //console.log(data)
    this.Notes = data;
    this.Notes.typeListId = this.Notes.typeListId.toString()
    this.getType();
  }
  //=================================save Contact=============================================================//
  saveContact(data) {
    let contactid = data.id
    let savedata = JSON.parse(JSON.stringify(data))
    savedata.clientId = parseInt(this.global.clientId.toString())
    if (savedata.emergencyPhone != null) {
      savedata.emergencyPhone = this.general.reconverPhoneGoogleLib(savedata.emergencyPhone);

    }
    if (savedata.emergencyAlternatePhone != null) {
      savedata.emergencyAlternatePhone = this.general.reconverPhoneGoogleLib(savedata.emergencyAlternatePhone);

    }
    if (savedata.guardianPhone != null) {
      savedata.guardianPhone = this.general.reconverPhoneGoogleLib(savedata.guardianPhone);

    }
    if (savedata.responsiblePartyPhone != null) {
      savedata.responsiblePartyPhone = this.general.reconverPhoneGoogleLib(savedata.responsiblePartyPhone);

    }
    savedata.emergencyRelationLid = savedata.emergencyRelationLid != null ? parseInt(savedata.emergencyRelationLid) : null;
    savedata.emergencyLiveWithLid = savedata.emergencyLiveWithLid != null ? parseInt(savedata.emergencyLiveWithLid) : null;
    savedata.emergencyAlternateRelationLid = savedata.emergencyAlternateRelationLid != null ? parseInt(savedata.emergencyAlternateRelationLid) : null;
    savedata.emergencyAlternateLiveWithLid = savedata.emergencyAlternateLiveWithLid != null ? parseInt(savedata.emergencyAlternateLiveWithLid) : null;

    savedata.guardianPhoneCarrierLid = savedata.guardianPhoneCarrierLid != null ? parseInt(savedata.guardianPhoneCarrierLid) : null;

    savedata.responsiblePartyCarrierLid = savedata.responsiblePartyCarrierLid != null ? parseInt(savedata.responsiblePartyCarrierLid) : null;
    //console.log("save======",savedata);

    this.ClientService.saveContactdata(savedata).subscribe((data) => {

      this.contactvaluechange = false;
      if (contactid == 0) {
        this.toastrService.success(
          "Contact  Created successfully",
          "Contact  Created",
        );
      }
      else {
        this.toastrService.success(
          "Contact  updated successfully",
          "Contact  updated",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //=================================get Contact=============================================================//
  getClientContact() {
    let params = new URLSearchParams();
    params.append("clientId", this.global.clientId.toString());
    this.ClientService.getContact(params).subscribe((data: any) => {
      this.ClientContactList = data;
      if (this.ClientContactList.emergencyPhone != null) {
        this.ClientContactList.emergencyPhone = this.general.reconverPhoneGoogleLibhttpsave(this.ClientContactList.emergencyPhone);

      }
      if (this.ClientContactList.emergencyAlternatePhone != null) {
        this.ClientContactList.emergencyAlternatePhone = this.general.reconverPhoneGoogleLibhttpsave(this.ClientContactList.emergencyAlternatePhone);

      }
      if (this.ClientContactList.guardianPhone != null) {
        this.ClientContactList.guardianPhone = this.general.reconverPhoneGoogleLibhttpsave(this.ClientContactList.guardianPhone);

      }
      if (this.ClientContactList.responsiblePartyPhone != null) {
        this.ClientContactList.responsiblePartyPhone = this.general.reconverPhoneGoogleLibhttpsave(this.ClientContactList.responsiblePartyPhone);

      }
      this.ClientContactList.emergencyRelationLid = this.ClientContactList.emergencyRelationLid != null ? this.ClientContactList.emergencyRelationLid.toString() : null;
      this.ClientContactList.emergencyLiveWithLid = this.ClientContactList.emergencyLiveWithLid != null ? this.ClientContactList.emergencyLiveWithLid.toString() : null;
      this.ClientContactList.emergencyAlternateRelationLid = this.ClientContactList.emergencyAlternateRelationLid != null ? this.ClientContactList.emergencyAlternateRelationLid.toString() : null;
      this.ClientContactList.emergencyAlternateLiveWithLid = this.ClientContactList.emergencyAlternateLiveWithLid != null ? this.ClientContactList.emergencyAlternateLiveWithLid.toString() : null;

      this.ClientContactList.guardianPhoneCarrierLid = this.ClientContactList.guardianPhoneCarrierLid != null ? this.ClientContactList.guardianPhoneCarrierLid : null;

      this.ClientContactList.responsiblePartyCarrierLid = this.ClientContactList.responsiblePartyCarrierLid != null ? this.ClientContactList.responsiblePartyCarrierLid : null;
      this.contactvaluechange = false;
      //  console.log("Clientcontact========",this.ClientContactList);

    })
  }
  //=======================save Type========================================================================//
  savetype(data) {
    let savedata = JSON.parse(JSON.stringify(data))
    let typeid = savedata.id
    this.ClientService.saveTypedata(savedata).subscribe((data: any) => {
      if (typeid == 0) {
        this.toastrService.success(
          "Type  Saved successfully",
          "Type  Saved",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
      else {
        this.toastrService.success(
          "Type  updated successfully",
          "Type  updated",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);
      }
      document.getElementById("addtypeopen").click();
      this.getType()
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  //========================delete Note===================================================================//
  deleteNote() {
    let param = new URLSearchParams();
    param.append("Id", this.deleteNoteId.toString())
    this.ClientService.deltenotedatas(param).subscribe((data) => {
      this.getNoteList()
      this.toastrService.success(
        "Note Deleted Successfully",
        "Notes Deleted",
      );
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          "error",
        );
        setTimeout(() => {
          this.toastrService.clear()
        }, 8000);

      })
  }
  contactvaluechangefunction() {
    this.contactvaluechange = true;
    //console.log(this.contactvaluechange)
  }
  getEvaluation() {

  }
  opennewDocument() {
    this.documentList = new DocumentBO()
    this.selectedFileName = ""
  }

  getEvaluationArray() {

    let params = new URLSearchParams();


    let perpage = 100
    let p = 1;
    this.getClientEvaluation.clientId = this.global.clientId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());

    this.clienttserivce.executeEvaluation(this.getClientEvaluation)

    this.data.subscribe((data: any) => {
      //console.log(data,"data");
      this.EvaluaionArray = data.result;
      data.result.forEach(element => {
        if (this.ClientList.phone1 != null) {

          element.phone = this.ClientList.phone1 != null ? this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone1) : null;




        }
        element.Name = this.ClientList.lastName + ", " + this.ClientList.firstName;
        
        element.callDate = element.callDate != null ? new Date(element.callDate).toLocaleDateString() : null;
        element.reviewDate = element.reviewDate != null ? new Date(element.reviewDate).toLocaleDateString() : null;
        // element.ages =element.callDate != null ?  myDate.valueOf()  - element.callDate.valueOf():null;
        if (element.reviewDate == "1/1/1") {
          element.reviewDate = "";
        }
        if (element.isAnsweredCall == true) {
          element.isAnsweredCall = "Yes";
        }
        else if (element.isAnsweredCall == false) {
          element.isAnsweredCall = "No";
        }
        if (element.isPCAPresent == true) {
          element.isPCAPresent = "Yes";
        }
        else if (element.isPCAPresent == false) {
          element.isPCAPresent = "No";
        }

      })

    })
    //   this.EvaluaionArray = data;

    //   let myDate: any = new Date();
    //   if( this.EvaluaionArray.length>0)
    //   {


    //   this.EvaluaionArray.forEach(element => {
    //     if (this.ClientList.phone1 != null) {

    //       element.phone =  this.ClientList.phone1!=null?this.general.reconverPhoneGoogleLibhttpsave(this.ClientList.phone1):null;




    //     }
    //     element.Name=this.ClientList.lastName+", "+this.ClientList.firstName;
    //     element.callDate = element.callDate != null ? new Date(element.callDate).toLocaleDateString() : null;
    //     element.reviewDate = element.reviewDate != null ? new Date(element.reviewDate).toLocaleDateString() : null;
    //     // element.ages =element.callDate != null ?  myDate.valueOf()  - element.callDate.valueOf():null;
    //     if (element.reviewDate == "1/1/1") {
    //       element.reviewDate = "";
    //     }
    //     if (element.isAnsweredCall == true) {
    //       element.isAnsweredCall = "Yes";
    //     }
    //     else if (element.isAnsweredCall == false) {
    //       element.isAnsweredCall = "No";
    //     }

    //   })
    // }
    // }, (err: HttpErrorResponse) => {
    //   this.toastrService.error(
    //     err.error,
    //     "error",
    //   );
    //   setTimeout(() => {
    //     this.toastrService.clear()
    //   }, 8000);

    // })
  }

  /////////////////////////////Action Begin ////////////////////////////////////////////////////////

  public onActionComplete(args) {



    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getClientEvaluation.currentpageno = this.gridEvaluation.pagerModule.pagerObj.currentPage;
    this.getClientEvaluation.pageitem = this.gridEvaluation.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClientEvaluation.type = args.columnType
      // console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    //console.log(this.getClientEvaluation)

  }

  public onActionCompleteCasemanager(args) {



    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getClientCasemanager.currentpageno = this.gridcasemanager.pagerModule.pagerObj.currentPage;
    this.getClientCasemanager.pageitem = this.gridcasemanager.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClientCasemanager.type = args.columnType
      //  console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    // console.log(this.getClientCasemanager)

  }

  public onActionCompleteCare(args) {



    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getClientCare.currentpageno = this.gridcasemanager.pagerModule.pagerObj.currentPage;
    this.getClientCare.pageitem = this.gridcasemanager.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClientCare.type = args.columnType
      // console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    // console.log(this.getClientCare)

  }

  public onActionCompleteNotes(args) {



    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getClientNotes.currentpageno = this.gridnotes.pagerModule.pagerObj.currentPage;
    this.getClientNotes.pageitem = this.gridnotes.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClientNotes.type = args.columnType
      //    console.log(args.column, "args")
    }
    //console.log(this.EmployeeListData)
    // console.log(this.getClientEvaluation)

  }
  public onActionCompleteDocuments(args) {



    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.getClientDocuments.currentpageno = this.griddocument.pagerModule.pagerObj.currentPage;
    this.getClientDocuments.pageitem = this.griddocument.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.getClientDocuments.type = args.columnType
      //    console.log(args.column, "args")
    }

  }
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
  //============================== Service ==================================================================//
  Service() {
    this.isServiceCreate = true;
    this.isServiceUpdate = false;
    // this.dialogService.open(Cliservice);
    this.getMappedServiceActivities();
    this.Createservice();
  }
  //=================================get service list ======================================================//
  Myclient: any;
  getMappedServiceActivities() {
    // let url = "api/ClientServiceActivity/getMappedServiceData?";
    this.serviceData = [];
    if (this.Myclient == null || this.Myclient == undefined) {
      this.Myclient = Math.floor(Number(this.global.clientId));
    } else {
      this.Myclient = this.ClientList.id;
    }
    let myparams = new URLSearchParams();
    myparams.append("clientId", this.Myclient.toString());
    this.ClientService.getServiceActivity(myparams).subscribe((data) => {
      this.serviceData = data;
      //console.log("serviceData",data);

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
    this.ClientService.getServiceDropDown(params).subscribe((data: any) => {
      this.masterServiceList = data;
      // console.log("masterServiceList",data);
      this.masterServiceList.forEach(element => {
        element.label = element.masterServiceCode;
        element.value = element.id;
        element.Key = element.Key.toString();
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
    myparams.append("ClientId", this.global.clientId.toString());
    myparams.append("AgencyId", this.global.globalAgencyId);
    this.ClientService.getMappedService(myparams).subscribe((data: any) => {
      //console.log("availableActivities",data);
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
  UpdateServiceActivity(mapData) {
    //console.log("mapData",mapData);
    mapData.forEach(element => {
      element.clientId = this.global.clientId,
        element.MasterServiceActivityId = element.Key,
        element.MasterServiceId = parseInt(this.servName);
    });
    if (mapData.length == 0) {
      mapData.push({ clientId: this.global.clientId, MasterServiceId: parseInt(this.servName) });
    }
    let url = "api/ClientServiceActivity/updateServiceActivity";
    this.http.post(url, mapData).subscribe((data: any) => {
      //console.log("saveservice",data);
      // this.serviceData.push(data)
      this.getMappedServiceActivities();
      this.toastrService.success(
        "Service has been configured successfully",
        "Service configured",
      ), 8000
      document.getElementById('configureService').click()
    }, (err: HttpErrorResponse) => {

    })
  }
  //======================================Edit Service=======================================//
  Editservice(MasterServiceId) {
    this.servName = MasterServiceId.toString();
    this.isServiceCreate = false;
    this.isServiceUpdate = true;
    this.getMappedActivities(MasterServiceId);
  }
  //========================================================================================//
  ActivityBool: boolean = false;
  ServiceActivityBool: boolean = false;
  CreateupdateServiceActivity(type: string) {
    // console.log("Modal Type==",this.ModalType);
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
    // console.log("data==",data);

    this.ServiceActivityArray1.masterServiceId = data.masterServiceId.toString();
    this.ServiceActivityArray1.masterServiceId = this.ServiceActivityArray1.masterServiceId.toString();
    this.ServiceActivityArray1.Id = data.clientServiceActivityId;

    //console.log("data==",this.ServiceActivityArray1.masterServiceId);
    this.getActivityTypeSatus(parseInt(this.ServiceActivityArray1.masterServiceId))
  }
  valuchangesServiceActivity() {
    this.ServiceActivityBool = false;
  }
  openDialogServiceActivity() {
    //console.log("ServiceActivityBool",this.ServiceActivityBool);
    if (this.ServiceActivityBool == true) {
      document.getElementById('configureService').click();
    }
    else {
      // this.ServiceForm.markAsValid;
      // this.ServiceForm.markAsPristine;
      document.getElementById('ServiceActivitymodal').click();
    }
  }
  selectActivityDetails(data: ClientServiceActivityBO) {
    this.Activity = JSON.parse(JSON.stringify(data));
  }

  ServiceActivityArray1: any = [];
  selectServiceActivityDetails(data) {
    this.ServiceActivityArray1 = JSON.parse(JSON.stringify(data));
    this.getActivityTypeSatus(this.ServiceActivityArray1.masterServiceId);
  }
  getActivityTypeSatus(serviceId) {
    let params = new URLSearchParams();
    // console.log(this.ClientList.id,"clientId=====");

    params.append("serviceId", serviceId);
    params.append("ClientId", this.ClientList.id);
    params.append("AgencyId", this.global.globalAgencyId);
    this.ClientService.getMappedService(params).subscribe((data: any) => {
      //  console.log("ServiceActivityArray data==", data);
      this.availableActivities = data.availableActivityPair;
      this.selectedActivities = data.selectedAcitivityPair;
    });
  }
  SaveOrUpdateServiceActivity(ServiceActivityArray1) {
    let url = "api/ClientServiceActivity/updateServiceActivity";

    if (this.Myclient == null || this.Myclient == undefined) {
      this.Myclient = Math.floor(Number(this.global.clientId));
    } else {
      this.Myclient = this.ClientList.id;
    }
    // console.log(ServiceActivityArray1[0].clientServiceActivityId,"service activity");
    console.log(ServiceActivityArray1.clientServiceActivityId, "service activity");

    ServiceActivityArray1.masterServiceId = Math.floor(Number(ServiceActivityArray1.masterServiceId));
    if (this.selectedActivities.length != 0) {
      this.selectedActivities.forEach(element => {
        element.clientId = Math.floor(Number(this.Myclient)),
          element.masterServiceId = ServiceActivityArray1.masterServiceId,
          element.Id = ServiceActivityArray1.clientServiceActivityId,
          element.MasterServiceActivityId = element.Key
      });


      //console.log( this.selectedActivities,"service activity");
    } else {
      this.selectedActivities.push({
        clientId: Math.floor(Number(this.Myclient)),
        masterServiceId: ServiceActivityArray1.masterServiceId
      });
      // this.LActivity.push({
      //   // id: this.selectedActivities.id,
      //   // masterActivityId: this.selectedActivities.masterActivityId,
      //   masterServiceId: this.selectedActivities.masterServiceId,
      //   // clientId: this.ClientList.clientId
      // })
    }
    // for(let i=0; i<this.selectedActivities.length; i++) {
    //   // this.LActivity.push({
    //   //   id: this.selectedActivities.id,
    //   //   masterActivityId: this.selectedActivities.masterActivityId,
    //   //   masterServiceId: this.selectedActivities.masterServiceId,
    //   //   clientId: this.ClientList.clientId
    //   // })
    // }
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
        //console.log("err.error",err);
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }
  checkpopServiceActivity() {
    this.ServiceActivityBool = true;
  }
  dataEmitFromCertificate(event) {
    //console.log(event);
    this.Editcert = event.isEdit;
    this.EditCertificateoption = event;
  }
  consumer() {
    this.router.navigateByUrl("/consumerassesment");
  }



  // ==============================================================================

  getColumnwidth() {
    this.ClientService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray_Evaluation = JSON.parse(data.column)[0].Client_Evaluation_Notes.Columns;
      this.ColumnArray_care = JSON.parse(data.column)[0].Client_Carecoordinator.Columns;
      this.ColumnArray_case = JSON.parse(data.column)[0].Client_Casemanager.Columns;
      this.ColumnArray_clientnotes = JSON.parse(data.column)[0].ClientNotes.Columns;
      this.ColumnArray_documents = JSON.parse(data.column)[0].ClientNotes.Columns;


      // this.grid.showColumns(JSON.parse(data.column)[0].Client.ShowColumns);
      // this.grid.hideColumns(JSON.parse(data.column)[0].Client.HideColumns);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.gridEvaluation.pageSettings.pageSize = JSON.parse(data.column)[0].Client_Evaluation_Notes.Pagesize

      this.ColumnArray_Evaluation.forEach(element => {



        if (element.column == 'Client Name') {

          const column = this.gridEvaluation.getColumnByField('Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridEvaluation.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Phone') {

          const column1 = this.gridEvaluation.getColumnByField('phone'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'Age(in days)') {

          const column1 = this.gridEvaluation.getColumnByField('ages'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'Last Call Date') {

          const column1 = this.gridEvaluation.getColumnByField('callDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'Last Call Status') {

          const column1 = this.gridEvaluation.getColumnByField('isAnsweredCall'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'PCA Present') {

          const column1 = this.gridEvaluation.getColumnByField('isPCAPresent'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'Last Reviewed Date') {

          const column1 = this.gridEvaluation.getColumnByField('reviewDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }
        if (element.column == 'Last Reviewed By') {

          const column1 = this.gridEvaluation.getColumnByField('reviewedBy'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridEvaluation.refreshHeader();
        }

      });


      this.ColumnArray_care.forEach(element => {



        if (element.column == 'Name') {

          const column = this.gridcarecoordinator.getColumnByField('careCoordinatorName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridcarecoordinator.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'County') {

          const column1 = this.gridcarecoordinator.getColumnByField('county'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }
        if (element.column == 'Telephone') {

          const column1 = this.gridcarecoordinator.getColumnByField('telephone'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }
        if (element.column == 'Fax') {

          const column1 = this.gridcarecoordinator.getColumnByField('fax'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }
        if (element.column == 'Alternative Fax') {

          const column1 = this.gridcarecoordinator.getColumnByField('alternateFax'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }
        if (element.column == 'Email') {

          const column1 = this.gridcarecoordinator.getColumnByField('email'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }
        if (element.column == 'Actions') {

          const column1 = this.gridcarecoordinator.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcarecoordinator.refreshHeader();
        }

      });

      this.ColumnArray_case.forEach(element => {



        if (element.column == 'Name') {

          const column = this.gridcasemanager.getColumnByField('caseManagerName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridcasemanager.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'County') {

          const column1 = this.gridcasemanager.getColumnByField('county'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }
        if (element.column == 'Telephone') {

          const column1 = this.gridcasemanager.getColumnByField('telephone'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }
        if (element.column == 'Fax') {

          const column1 = this.gridcasemanager.getColumnByField('fax'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }
        if (element.column == 'Alternative Fax') {

          const column1 = this.gridcasemanager.getColumnByField('alternate_Fax'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }
        if (element.column == 'Email') {

          const column1 = this.gridcasemanager.getColumnByField('email'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }
        if (element.column == 'Actions') {

          const column1 = this.gridcasemanager.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridcasemanager.refreshHeader();
        }

      });



      this.ColumnArray_clientnotes.forEach(element => {


        if (element.column == 'Date') {

          const column = this.gridnotes.getColumnByField('date'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.gridnotes.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Initials') {

          const column1 = this.gridnotes.getColumnByField('initial'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridnotes.refreshHeader();
        }
        if (element.column == 'Client Notes') {

          const column1 = this.gridnotes.getColumnByField('notes'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridnotes.refreshHeader();
        }
        if (element.column == 'Type') {

          const column1 = this.gridnotes.getColumnByField('listName'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridnotes.refreshHeader();
        }

        if (element.column == 'Actions') {

          const column1 = this.gridnotes.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.gridnotes.refreshHeader();
        }

      });


      this.ColumnArray_documents.forEach(element => {


        if (element.column == 'Document Name') {

          const column = this.griddocument.getColumnByField('documentName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.griddocument.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Document Title') {

          const column1 = this.griddocument.getColumnByField('documentTitle'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.griddocument.refreshHeader();
        }
        if (element.column == 'Filepath') {

          const column1 = this.griddocument.getColumnByField('filepath'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.griddocument.refreshHeader();
        }
        if (element.column == 'Attached Date') {

          const column1 = this.griddocument.getColumnByField('attachedDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.griddocument.refreshHeader();
        }

        if (element.column == 'Actions') {

          const column1 = this.griddocument.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.griddocument.refreshHeader();
        }

      });




    });

  }
  SaveColumnwidth() {
    this.arraycol[0].Client_Evaluation_Notes.Columns = this.ColumnArray_Evaluation;
    this.arraycol[0].Client_Carecoordinator.Columns = this.ColumnArray_care;
    this.arraycol[0].Client_Casemanager.Columns = this.ColumnArray_case;
    this.arraycol[0].ClientNotes.Columns = this.ColumnArray_clientnotes;
    this.arraycol[0].ClientDocuments.Columns = this.ColumnArray_documents;


    this.arraycol[0].Client_Evaluation_Notes.Pagesize = this.gridEvaluation.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.ClientService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }



  onResize(args) {
    const column = this.gridcarecoordinator.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_care.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  onResizeEvaluation(args) {
    // console.log("Evaluation");
    // console.log("args.column",args);
    // console.log("this.grid",this.grid);

    const column = this.gridEvaluation.getColumnByField(args.column.field)

    // console.log("args.column.field",args.column.width);
    // console.log("column",column);
    column.width = args.column.width;
    this.ColumnArray_Evaluation.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }
  onResizeCase(args) {
    const column = this.gridcasemanager.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_case.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  onResizeNotes(args) {
    const column = this.gridnotes.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_clientnotes.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }
  onResizeDocuments(args) {
    const column = this.griddocument.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray_documents.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }

    });
    this.SaveColumnwidth();
  }

  //========================= evnt change =====================================================================//
  public dataStateChangeEvaluation(state): void {
    // console.log("Stats chage Evaluation",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClientEvaluation.orderColumn = "Ages";
        this.getClientEvaluation.orderType = 'DESC';
        //   console.log(this.getClientEvaluation,"Evaluation=====");

      }
    }

    if (val == "filtering" && state.action.action != "clearFilter") {


      if(state.action.currentFilterObject.field=="isPCAPresent"||state.action.currentFilterObject.field=="isAnsweredCall")
      {
        console.log(state.action.currentFilterObject.value)
        if(state.action.currentFilterObject.value=="Yes")
        {
          this.getClientEvaluation.value="true"
        }
        else  if(state.action.currentFilterObject.value=="No")
        {
          this.getClientEvaluation.value="false"
        }
        else{
          this.getClientEvaluation.value="";
        }
  
        
      }
      else{
        this.getClientEvaluation.value=state.action.currentFilterObject.value.toString();
      }
      this.getClientEvaluation.field = state.action.currentFilterObject.field;
      this.getClientEvaluation.matchCase = state.action.currentFilterObject.matchCase;
      this.getClientEvaluation.operator = state.action.currentFilterObject.operator;
      this.getClientEvaluation.value = state.action.currentFilterObject.value;
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClientEvaluation.field = "ages";
        this.getClientEvaluation.matchCase = false;
        this.getClientEvaluation.operator = "contains";
        this.getClientEvaluation.value = "";
        this.getClientEvaluation.type = "number"
        this.getClientEvaluation.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].Client_Evaluation_Notes.Pagesize != state.take) {
          this.arraycol[0].Client_Evaluation_Notes.Pagesize = state.take
          //    console.log( "save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }

    this.getEvaluationArray();
  }

  //========================= evnt change =====================================================================//
  public dataStateChangeCasemanager(state): void {
    //  console.log("Stats chage",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClientCasemanager.orderColumn = "CaseManagerName";
        this.getClientCasemanager.orderType = 'asc';
        //    console.log(this.getClientCasemanager,"Evaluation=====");

      }
    }

    if (val == "filtering" && state.action.action != "clearFilter") {
      this.getClientCasemanager.field = state.action.currentFilterObject.field;
      this.getClientCasemanager.matchCase = state.action.currentFilterObject.matchCase;
      this.getClientCasemanager.operator = state.action.currentFilterObject.operator;
      this.getClientCasemanager.value = state.action.currentFilterObject.value;
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClientCasemanager.field = "CaseManagerName";
        this.getClientCasemanager.matchCase = false;
        this.getClientCasemanager.operator = "contains";
        this.getClientCasemanager.value = "";
        this.getClientCasemanager.type = "string"
        this.getClientCasemanager.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].Client_Casemanager.Pagesize != state.take) {
          this.arraycol[0].Client_Casemanager.Pagesize = state.take
          // console.log( "save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    this.getclientCaseLst();
  }


  public dataStateChangeCare(state): void {
    //  console.log("Stats chage",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClientCare.orderColumn = "CaseManagerName";
        this.getClientCare.orderType = 'asc';
        //    console.log(this.getClientCare,"Evaluation=====");

      }
    }

    if (val == "filtering" && state.action.action != "clearFilter") {
      this.getClientCare.field = state.action.currentFilterObject.field;
      this.getClientCare.matchCase = state.action.currentFilterObject.matchCase;
      this.getClientCare.operator = state.action.currentFilterObject.operator;
      this.getClientCare.value = state.action.currentFilterObject.value;
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClientCare.field = "CaseManagerName";
        this.getClientCare.matchCase = false;
        this.getClientCare.operator = "contains";
        this.getClientCare.value = "";
        this.getClientCare.type = "string"
        this.getClientCare.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].Client_Carecoordinator.Pagesize != state.take) {
          this.arraycol[0].Client_Carecoordinator.Pagesize = state.take
          //   console.log( "save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    this.getclientCareLst();
  }


  public dataStateChangeNotes(state): void {
    // console.log("Stats chage",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClientNotes.orderColumn = "Date";
        this.getClientNotes.orderType = 'asc';
        //  console.log(this.getClientNotes,"Evaluation=====");

      }
    }
    if (this.getClientNotes.type == "date") {
      //console.log(state.action.currentFilterObject.value)
      this.getClientNotes.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
      this.getClientNotes.field = state.action.currentFilterObject.field;
    }
    else {
      this.getClientNotes.value = state.action.currentFilterObject.value;
      this.getClientNotes.field = state.action.currentFilterObject.field;
    }
    // if (state.action.currentFilterObject.field == "listName") {

    //   this.getClientNotes.value = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
    //   this.getClientNotes.field = "statusLid";
    //   this.getClientNotes.statusLid = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
    //   this.getClientNotes.type = "number";
    // }
    if (val == "filtering" && state.action.action != "clearFilter") {
      this.getClientNotes.field = state.action.currentFilterObject.field;
      this.getClientNotes.matchCase = state.action.currentFilterObject.matchCase;
      this.getClientNotes.operator = state.action.currentFilterObject.operator;
      this.getClientNotes.value = state.action.currentFilterObject.value;
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClientNotes.field = "Date";
        this.getClientNotes.matchCase = false;
        this.getClientNotes.operator = "contains";
        this.getClientNotes.value = "";
        this.getClientNotes.type = "string"
        this.getClientNotes.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].ClientNotes.Pagesize != state.take) {
          this.arraycol[0].ClientNotes.Pagesize = state.take
          //  console.log( "save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    this.getNoteList();
  }


  public dataStateChangeDocuments(state): void {
    //console.log("Stats chage",state);    
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.getClientDocuments.orderColumn = "CaseManagerName";
        this.getClientDocuments.orderType = 'asc';
        //   console.log(this.getClientDocuments,"Evaluation=====");

      }
    }

    if (val == "filtering" && state.action.action != "clearFilter") {
      this.getClientDocuments.field = state.action.currentFilterObject.field;
      this.getClientDocuments.matchCase = state.action.currentFilterObject.matchCase;
      this.getClientDocuments.operator = state.action.currentFilterObject.operator;
      this.getClientDocuments.value = state.action.currentFilterObject.value;
    }
    else {
      if (val == "filtering" && state.action.action == "clearFilter") {
        this.getClientDocuments.field = "Date";
        this.getClientDocuments.matchCase = false;
        this.getClientDocuments.operator = "contains";
        this.getClientDocuments.value = "";
        this.getClientDocuments.type = "string"
        this.getClientDocuments.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].ClientDocuments.Pagesize != state.take) {
          this.arraycol[0].ClientDocuments.Pagesize = state.take
          //  console.log( "save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    this.getDocumnets();
  }

  disablelogin: boolean = true;
  switchchange() {

    if (this.ClientList.requiredEVV) {
      this.disablelogin = false;

    }
    else {
      this.disablelogin = true;
    }
  }
  onKey(event, name) {
    
    if(name =='gender')
    {
      console.log(event);
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
}
