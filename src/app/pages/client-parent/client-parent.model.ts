

export class ClientBO {
    id: number;
    name:string|null;
    agencyId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    genderLid: number;
    qpname:string ;
    dOB: string;
    age: number | null;
    weight: number | null;
    aKA: string;
    medicaid: string;
    medicare: string;
    street: string;
    apt: string;
    phone1: string;
    phone2: string;
    county: string;
    state: string;
    city: string;
    zipCode: string;
    sSN: string;
    email: string;
    statusLid: number;
    status_Name: string;
    userName: string;
    loginUserId:string|null;
    requiredEVV: boolean | null=false;
    password: string;
    locationStatusLid: number | null;
}

export class ClientReturnBO {
    clientId: number;
    errorList: string[];
}

export class EditDetailsClient
 {
    isView: boolean=false;
    isEdit: boolean=false;
    isEditClient:boolean=false;
    clientId:number=0;
    iscounsumer:boolean=false;
    consumerId:number=0;
    clientData:ClientBO=new ClientBO();
} 

export class EditSOCDetails
 {
    isView: boolean=false;
    isEdit: boolean=false;
    isEditSOC:boolean=false;
    clientId:number=0;
    type=""
    clientSOCData:StartOfCareBO=new StartOfCareBO();
} 

export class editcertificate
 {
    isView: boolean=false;
    isEdit: boolean=false;
  
    clientId:number=0;
    type=""
    certificateId:number=0;
    clientcertifcateData:ClientCertificationBO=new ClientCertificationBO();
} 
export class ClientAuthorizationBO {
    public id: number = 0;
    public clientId: number;
    public startDate: string;
    public endDate: string;
    public companyId: number;
    public groupPayorId: number;
    public insuranceNo: number;
    public serviceAgreementNo: string;
    public groupPayorServiceId: number;
    public serviceDescription: string;
    public totalUnits: number;
    public unitsUsed: number;
    public unitsRemaining: number;
    public totalUnitsperday:string;
  public billingvalue:number;
  }
export class EditDetailsAuthorization{
    isView: boolean=false;
    isEdit: boolean=false;
    isEditAuthorization:boolean=false;
    AuthorizationId:number=0;
    AuthorizationData:ClientAuthorizationBO=new ClientAuthorizationBO();
    ClientId:number=0;
    type:string='';
} 

export class returnClientAuthorization {
    id: number;
    clientId: number;
    startDate: string;
    endDate: string;
    companyId: number | null;
    groupPayorId: number | null;
    insuranceNo: string;
    serviceAgreementNo: string;
    groupPayorServiceId: number;
    serviceDescription: string;
    totalUnits: number;
    unitsUsed: number | null;
    unitsRemaining: number | null;
    companyName: string;
    payorName: string;
    serviceCode: string;
    serviceId: number;
   
}

export class ClientSOC {
    public id: number = 0;
    public clientId: number;
    public startDate: Date;
    public companyId: number;
    public dischargeLid: number;
    public dischargeDate: Date;
    public dischargeCodeDetailId: number;
    public description: string;
  }
  export class StartOfCareBO {
    id: number= 0;
    clientId: number;
    startDate: string;
    companyId: number | null;
    dischargeLid: number | null;
    dischargeDate: string | null;
    dischargeCodeDetailId: number | null;
    description: string;
    dischargeCode: string;
    dischargeStatus: string;
    companyName: string;
}

export class ClientCertificationBO {
    public id: number = 0;
    public clientId: number;
    public startOfCareId: string;
    public startDate: any;
    public endDate: any;
    public companyId: string;
    public icD10PrimaryId: string;
    public icD10SecondaryId: string;
    public npi: number;
    public physician: string;
    public clinic: string;
  }

  export class ContactsBO {
    public id: number = 0;
    public clientId: number;
    public emergencName: string;
    public emergencyRelationLid: string;
    public emergencySteet: string;
    public emergencyPhone: string;
    public emergencyState: string;
    public emergencyCity: string;
    public emergencyLiveWithLid: string;
    public emergencyZipCode: string;
    public emergencyAlternateName: string;
    public emergencyAlternateRelationLid: string;
    public emergencyAlternateSteet: string;
    public emergencyAlternatePhone: string;
    public emergencyAlternateState: string;
    public emergencyAlternateCity: string;
    public emergencyAlternateLiveWithLid: string;
    public emergencyAlternateZipCode: string;
    public guardianName: string;
    public guardianSteet: string;
    public guardianZipCode: string;
    public guardianPhone: string;
    public guardianState: string;
    public guardianCity: string;
    public guardianEmail: string;
    public guardianPhoneCarrierLid: number;
    public isSameAsGuardian: boolean;
    public responsiblePartyName: string;
    public responsiblePartySteet: string;
    public responsiblePartyZipCode: string;
    public responsiblePartyPhone: string;
    public responsiblePartyState: string;
    public responsiblePartyCity: string;
    public responsiblePartyEmail: string;
    public responsiblePartyCarrierLid: number;
  }
  
  export class ZipcodeDetailBO {
    id: number;
    agencyId: number | null;
    county: string;
    state: string;
    city: string;
    zipcode: string;
}

export class PhysicianBO {
  id: number;
  nPI: string;
  physicianName: string;
  clinicName: string;
  clinicCity: string;
  clinicState: string;
  clinicAddress: string;
  clinicPhone: string;
  zipCode: string;
}

export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "FirstName" ;
    shortType : string = 'asc';
}

export class clientFilter
{
   clientStatus:number=0;
}
export class carecoordinate {
  id: number;
  clientId: number;
  careCoordinatorId: number;
  careCoordinatorName: string;
  county: string;
  telephone: string;
  fax: string;
  alternateFax: string;
  email: string;
  statusName: string;
  statusLid: number;
  isDeleted: boolean | null;
}
export class ClientCoordinatorRelationshipBO {
  id: number;
  clientId: number;
  careCoordinatorId: number;
  statusLid: number;
  isDeleted: boolean | null;
  deletedBy: number | null;
  deletedDate: string | null;
  deletedIp: string;
}
export class relationship
{
    Id:number
    RelationType:string
    type:string
}
export class getClient {
  searchColumn: string="Name";
  searchText: string="";
  orderColumn: string="Name";
  orderType: string="asc";
  pageitem: number=10;
  currentpageno: number=1;
  agencyId: number;
  statusLid: number;
  employeeTypeLi: number;
  field: string = "Name";
  value: string = "";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}
export class getMappedCMDataBO {
  id: number;
  clientId: number;
  caseManagerId: number;
  caseManagerName: string;
  county: string;
  telephone: string;
  fax: string;
  alternateFax: string;
  email: string;
  statusName: string;
  statusLid: number;
  isDeleted: boolean | null;
}
export class ClientCaseManagerRelationshipBO {
  id: number;
  clientId: number;
  statusLid: number;
  caseManagerId: number;
  isDeleted: boolean | null;
  deletedBy: number | null;
  deletedDate: string | null;
  deletedIp: string;
}
export class DocumentBO {
  id: number;
  clientId: number;
  documentNameLid: number | null;
  documentName: string;
  returnDocument: string;
  containerName: string;
  documentType: string;
  documentTitle: string;
  attachedDate: string | null;
  filepath: string;
  isRemoved: boolean | null;
  removedBy: string;
  removedDate: string | null;
  attachments:any;
}
export class LovBO {
  id: number;
  lovCode: string;
  lovName: string;
  lovValue: string;
  listId: number;
  orderby: number=0;
  agencyId: number | null;
}
export class QPfilter{
  Client:number=0;
  QPEMP:number=0;
  Status:number=0;
}

export class GetClientEmployeeRelationshipBO {
  id: number;
  clientId: number;
  employeeId: number;
  statusLid: number;
  employeeName: string;
  clientName: string;
}
export class ClientNoteBO {
  id: number;
  clientId: number;
  date: string;
  initial: string;
  notes: string;
  typeListId: number | null;
  multipletype:[];
}
export class type
  {
    id:number;
  typeNumber:string;
  typeName:string
}
export class functionpermission {
  cilentcreate: boolean = true;
  cilentupdate: boolean = true;
  startofcarecreate: boolean = true;
  startofcaredelete: boolean = true;
  startofcareupdate: boolean = true;
  cretificationcreate: boolean = true;
  cretificationdelete: boolean = true;
  cretificationupdate: boolean = true;
  authorizationcreate: boolean = true;
  authorizationdelete: boolean = true;
  authorizationupdate: boolean = true;
  COB_Config_AddNew: boolean = true;
  COB_Config_CSVImport: boolean = true;
}
export class ClientServiceActivityBO {
  id: number = 0;
  clientId: number;
  masterServiceActivityId: number;
  masterServiceId: number;
}
export class GetClientEvaluation {
  orderColumn: string="Ages";
  orderType: string="desc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="Ages";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}

export class GetClientCasemanager {
  orderColumn: string="CaseManagerName";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="CaseManagerName";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}

export class GetClientCarecoordinator {
  orderColumn: string="CaseManagerName";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="CaseManagerName";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}


export class GetClientNotes {
  orderColumn: string="Initial";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="Initial";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}

export class SOCListBO {
  orderColumn: string="CompanyName";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="CompanyName";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}

export class AuthListBO {
  orderColumn: string="companyName";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="companyName";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}

export class CertificationListBO {
  orderColumn: string="companyName";
  orderType: string="asc";
  pageitem: number=10;
  clientId: number;
  ages: number;
  client: string;
  currentpageno: number=1;
  field: string="companyName";
  value: string="";
  matchCase: boolean = false;
  operator: string = "contains";
  type:string="string";
}