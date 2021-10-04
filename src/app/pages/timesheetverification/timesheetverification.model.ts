export class functionpermission {
    agencycreate: boolean = true;
    agencydelete: boolean = true;
    agencyupdate: boolean = true;
  
  }

  export class sortingObj
  {
      itemperpage : number =10;
      currentPgNo : number = 1;
      shortcolumn : string = "AgencyName" ;
      shortType : string = 'asc';
  }

  export class TimeSheetVerificationList {
    serialNo: number;
    timesheetId:number;
    agencyId: number | null;
    fromDate: string;
    toDate: string;
    totalHours: number;
    totalAmountBIlled: number;
    clientId: number;
    client_FirstName: string;
    client_LastName: string;
    client_MiddleName: string;
    client_Gender: string;
    client_DOB: string;
    client_Street: string;
    client_City: string;
    client_State: string;
    client_ZipCode: string;
    cLient_SSN: string;
    client_ServiceAgreementNo: string;
    client_InsuranceNo: string;
    clientAuthorizationId: number | null;
    employeeId: number;
    employee_FirstName: string;
    employee_MiddleName: string;
    employee_LastName: string;
    employee_UMPI: string;
    employeePayorUMPI: string;
    groupPayorId: number | null;
    payorName: string;
    payor_BillingFullName: string;
    payor_AddressLine1: string;
    payor_AddressLine2: string;
    payor_City: string;
    payor_State: string;
    payor_Zip: string;
    billingpayorID: string;
    i837PInsType: string;
    aTYPICAL: boolean | null;
    payor_PhoneNumber: string;
    groupPayorCompany_ProviderNo: string;
    claim_Filling_Ind: string;
    groupPayorCompany_CompanyFEIN: string;
    companyId: number | null;
    companyName: string;
    companyName_Billto_Name: string;
    companyName_Billto_Street: string;
    companyName_Billto_City: string;
    companyName_Billto_State: string;
    companyName_Billto_zipcode: string;
    companyName_Admin_FirstName: string;
    companyName_Phone: string;
    company_ProviderNo: string;
    groupPayorServiceId: number | null;
    billingUnit: number | null;
    netRate: number | null;
    unitrate: number | null;
    serviceLoc: string;
    renderingProviderCode: string;
    companyIdentifier: boolean | null;
    isIcd10FromClient: boolean | null;
    icd10: string;
    g2id: string;
    companyIdentifier_NPI: string;
    companyIdentifier_CompanyName: string;
    certificateICD10_01: string;
    certificateICD10_02: string;
    serviceCode: string;
    claimStatus: string;
    payDate: string | null;
    clientName:string;
    employee:string;
    bit:number;
    color:string;
    TimesheetId:number;
    error: Error[];
    lineItem: LineItem[];
}
export class Error {
    columnName: string;
    isValid: boolean;
    serialno:string;
    color:string;
    colr:string;
    status:string;
    clientId:number;
    clientauthId:number;
    companyId:number;
    groupPayorId:number;
    grouppayorserviceId:number;
    clientcertificationId:number;
  grouppayorServiceId: number;
  employeeId: number;
  payorName:string;
}

export class LineItem {
    serviceId: number;
    serialNo: number;
    lineStatus: string;
    serviceDate: string;
    dailyHours: number;
    procedureCode: string;
    mOD1: string;
    mOD2: string;
    mOD3: string;
    billableHours: number;
    timeSheetId: number;
    employeeId: number;
    groupPayorServiceId: number | null;
    payableHours: number;
    over275Hrs: number;
    remaimimgAuthorizedHours: number | null;
    overDaily16Hours: number;
    service_Item_Charge_Amount: number;
    service_Unit_Quantity: number;
    paydate: string | null;
    bit:number;
    lineItemDetail: LineItemDetail[];
}

export class LineItemDetail {
    serviceId: number;
    lineStatus: string;
    timeSheetId: number;
    serviceDate: string;
    dailyHours: number;
    procedureCode: string;
    mOD1: string;
    mOD2: string;
    mOD3: string;
    over275Hrs: number;
    remaimimgAuthorizedHours: number | null;
    overDaily16Hours: number;
}
export class GetTimesheetVerificationBO {
    fromDate: string;
    toDate: string;
    orderColumn: string;
    orderType: string;
    pageitem: number;
    currentpageno: number;
    agencyId: number;
    conitionBO: WhereCondition[];
}

export class WhereCondition {
    field: string="AgencyName";
    value: string = "";
    operator: string= "startswith";
    matchCase: boolean= false;
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
}
export class GetTimesheetverificationBO {
    fromDate: string;
    toDate: string;
    pageitem: number;
    currentpageno: number;
    agencyId: number;
    field: string = "TimesheetDate";
    value: string = "";
    orderColumn: string="Client_LastName";
    orderType: string="ASC";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="string";
}
export class ClientERRBOTSV {
    id: number;
    firstName: string;
    lastName: string;
    genderLid: number;
    gender:string;
    dOB: string;
    street: string;
    state: string;
    city: string;
    zipCode: string;
    serviceAgreementNo: string;
}
export class keyvalue{
    id:number=0;
    key:string='';
    value:string='';
 Type :string='';
 userId:string;
 agencyId:number;
}