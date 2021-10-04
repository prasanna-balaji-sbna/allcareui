export class functionpermission {
    agencycreate: boolean = true;
    agencydelete: boolean = true;
    agencyupdate: boolean = true;
  
  }

  export class sortingObj
  {
      itemperpage : number =20;
      currentPgNo : number = 1;
      shortcolumn : string = "AgencyName" ;
      shortType : string = 'asc';
  }

  export class PayorList {
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class Getbatchfile {
    orderColumn: string="Batchno";
    orderType: string="asc";
    pageitem: number=20;
    currentpageno: number=1;
    field: string="Batchno";
    value: string="";
    matchCase: boolean=false;
    type: string="";
    operator: string="startswith"; 
    AgencyId: number | null;
}

export class groupList {
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class EmployeeList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class ClientList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class ClearinghouseList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class CompanyList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class ResubmissionList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class batchList{
    clearingHouseId: any ="";
}

export class getBatchFilter {
    public clientId: any = "";
    public employeeId: any = "";
    public payorId: any = "";
    public groupId: any = "";
    public companyId: any = "";
    public statusLid: any = "";
    public resubmissionLid:any="";
    agencyId: number | null;
    orderColumn: string="ClientName";
    orderType: string="asc";
    pageitem: number=20;
    currentpageno: number=1;
    field: string = "ClientName";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="";
  }
  export class WhereCondition {
    field: string="ClientName";
    value: string = "";
    operator: string= "startswith";
    matchCase: boolean= false;
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
}
export class StatusList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class GenderList{
    Key:string;
    Value:string;
    label:string;
    value:string;
}
  export class Proclaim {
    public id: any = 0;
    public masterClaimId: any = 0;
    public payerName: any = "";
    public totalcharges: any = "";
    public amountPaid: any = "";
    public balanceDue: any = "";
    public resubmissionLid: any = 0;
    public note: any = "";
    public payerClaimControl: any = "";
    public exported: any = "";
    public subscriberFirstName: any = "";
    public subscriberMiddleName: any = "";
    public subscriberLastName: any = "";
    public subscriberDOB: any = "";
    public subscriberGenderLid: any = 0;
    public subscriberMemberID: any = "";
    public subscriberRefferal: any = "";
    public subscriberPriorAuth: any = "";
    public subscriberAddressLine1: any = "";
    public subscriberAddressLine2: any = "";
    public subscriberCity: any = "";
    public subscriberState: any = "";
    public subscriberZIPCode: any = "";
    public subscriber: any = "";
    public billingNPI: any = "";
    public billingProvider: any = "";
    public billingTaxID: any = "";
    public billingOrganization: any = "";
    public billingAddressLine1: any = "";
    public billingAddressLine2: any = "";
    public billingCity: any = "";
    public billingState: any = "";
    public billingZIPCode: any = "";
    public renderingNPI: any = "";
    public renderingProvider: any = "";
    public renderingFirstName: any = "";
    public renderingMiddleName: any = "";
    public renderingProviderCode="";
    public renderingLastName: any = "";
    public destinationPayerName: any = "";
    public destinationPayerId: any = "";
    public destinationDiagnosisCode: any = "";
    public destinationPOS: any = "";
    public serviceDetailsList:ClaimServiceLine[]=[];
    constructor(){
      this.serviceDetailsList.push(new ClaimServiceLine());
    }
  }
  
  export class ClaimServiceLine{
  public	 id 	:	any	=	0	;
  public	 groupPayorServiceId 	:	any	=	0	;
  public	 timeSheetId 	:	any	=	0	;
  public	 claimMasterId 	:	any	=	0	;
  public	  fromDate 	:	any	=	null	;
  public	  code 	:	any	=	null	;
  public	  modifier1 	:	any	=	null	;
  public	  modifier2 	:	any	=	null	;
  public	  modifier3 	:	any	=	null	;
  public	  modifier4 	:	any	=	null	;
  public	  totalUnits 	:	number	=	null	;
  public	  netCharges 	:	number|null	=	null;
  public paidDate : any=null;
  public paidAmount:number | null=0;
  public grossCharges :number | null=0;
//   public postedDate:any=null;
  }

  export class BillingClaimBO {
    id: number;
    billingClaim_No: string;
    fromDate: string;
    toDate: string;
    totalHours: number;
    employeeId: number;
    employeeName: string;
    serviceName: string;
    employeeUMPI: string;
    claimStatus: string;
    totalAmountBilled: number;
    claimStatusLid: number | null;
    clientId: number;
    clinet_FirstName: string;
    clinet_LastName: string;
    cLient_MiddleName: string;
    clinet_Address_1: string;
    clinet_Address_2: string;
    clinet_City: string;
    clinet_State: string;
    clinet_Zip: string;
    client_Insurance: string;
    client_DOB: string;
    client_Gender: string;
    companyId: number;
    senderId: string;
    company_Name: string;
    response_Contact_Name_Or_Organization_Name: string;
    company_PhoneNumber: string;
    company_ProviderNo: string;
    company_Address_1: string;
    company_Address_2: string;
    company_City: string;
    company_State: string;
    company_Zip: string;
    groupPayorId: number;
    payer_Name: string;
    payer_Address_1: string;
    payer_Address_2: string;
    payer_ID: string;
    payer_City: string;
    payer_State: string;
    payer_Zip: string;
    payer_FEIN: string;
    claim_Facility_Code_Value: string;
    claim_Frequency_Type_Code: string;
    claim_Provider_Accept_Assignment_Code: string;
    total_Claim_Charge_Amount: string;
    claim_Original_Reference_Number: string;
    clearingHouseId: number;
    receiverId: string;
    clearingHouseName: string;
    receiver_Qualifier: string;
    clearingHouse_ClearingHouseId: string;
    batchFileId: number | null;
    isCreateBatch: boolean | null;
    groupPayorName: string;
    groupPayorServiceId: number;
    serviceDate: string;
    service_Code: string;
    service_Modifier_1: string;
    service_Modifier_2: string;
    service_Modifier_3: string;
    service_Modifier_4: string;
    service_Item_Charge_Amount: string;
    service_Unit_Type: string;
    service_Unit_Quantity: string;
    billingClaimId: number;
}

export class BillingClaimWithDetailBO {
    id: number;
    billingClaim_No: string;
    fromDate: string;
    toDate: string;
    totalHours: number;
    employeeId: number;
    employeeName: string;
    serviceName: string;
    employeeUMPI: string;
    claimStatus: string;
    totalAmountBilled: number;
    claimStatusLid: number | null;
    clientId: number;
    clinet_FirstName: string;
    clinet_LastName: string;
    cLient_MiddleName: string;
    clinet_Address_1: string;
    clinet_Address_2: string;
    clinet_City: string;
    clinet_State: string;
    clinet_Zip: string;
    client_Insurance: string;
    client_DOB: string;
    client_Gender: string;
    companyId: number;
    senderId: string;
    company_Name: string;
    response_Contact_Name_Or_Organization_Name: string;
    company_PhoneNumber: string;
    company_ProviderNo: string;
    company_Address_1: string;
    company_Address_2: string;
    company_City: string;
    company_State: string;
    company_Zip: string;
    groupPayorId: number;
    payer_Name: string;
    payer_Address_1: string;
    payer_Address_2: string;
    payer_ID: string;
    payer_City: string;
    payer_State: string;
    payer_Zip: string;
    payer_FEIN: string;
    claim_Facility_Code_Value: string;
    claim_Frequency_Type_Code: string;
    claim_Provider_Accept_Assignment_Code: string;
    total_Claim_Charge_Amount: string;
    claim_Original_Reference_Number: string;
    clearingHouseId: number;
    receiverId: string;
    clearingHouseName: string;
    receiver_Qualifier: string;
    clearingHouse_ClearingHouseId: string;
    batchFileId: number | null;
    clientName: string;
    isCreateBatch: boolean | null;
    claimDetail: ClaimDetailBO[];
}
export class ClaimDetailBO {
    id: number;
    groupName: string;
    payorName: string;
    groupPayorServiceId: number;
    serviceDate: string;
    service_Code: string;
    service_Modifier_1: string;
    service_Modifier_2: string;
    service_Modifier_3: string;
    service_Modifier_4: string;
    service_Item_Charge_Amount: string;
    service_Unit_Type: string;
    service_Unit_Quantity: string;
    billingClaimId: number;
}
export class ClaimDetailChild {
    id: number;
    serviceDate: string;
    procedureCode: string;
    moD1: string;
    moD2: string;
    moD3: string;
    service_Item_Charge_Amount: string;
    service_Unit_Type: string;
    service_Unit_Quantity: string;
}
export class SaveBatchFileBO {
    claimMaterId: number[];
    companyid: number | null;
    clearingHouseId: number;
}
export class BatchFileIdList {
    claimMaterId: (number | null)[];
   
}
// export class getBatchFilter {
//     clientId: number | null;
//     employeeId: number | null;
//     payorId: number | null;
//     groupId: number | null;
//     companyId: number | null;
//     statusLid: number | null;
//     agencyId: number | null;
// }
export class getActiveBatchFilterBO {
    clientId: number | null;
    employeeId: number | null;
    payorId: number | null;
    groupId: number | null;
    companyId: number | null;
    statusLid: number[];
    agencyId: number | null;
}

////================Zipcode===========///////
export interface ZipcodeDetail {
    id: number;
    agencyId: number | null;
    county: string;
    state: string;
    city: string;
    zipcode: string;
}

// export class BatchFileBO {
//     id: number;
//     batchno: string;
//     filePath: string;
//     _837PString: string;
//     folderName: string;
//     fileName: string;
//     claimStatuslid: number;
//     companyId: number;
//     clearingHouseId: number;
//     createDate: string;
//     companyName: string;
//     clearingHouseName: string;
//     claimStatus: string;
//     invoice837P: Invoice837P;
// }
export class BatchFileBO {
    id: number;
    batchno: string;
    filePath: string;
    _837PString: string;
    folderName: string;
    fileName: string;
    claimStatuslid: number;
    companyId: number;
    clearingHouseId: number;
    createDate: string;
    companyName: string;
    clearingHouseName: string;
    claimStatus: string;
    invoice837P: Invoice837P;
    claimDetails: claimDetailsBO[];
}
export class claimDetailsBO {
    id: number;
    claimMasterId: number;
    claimId: string;
}

export class Invoice837P {
    file_Name: string='';
    file_Creation_Date: string;
    submission_Control_Number: string;
    compnay_Name: string;
    totalUnits: number;
    totalCharges: number;
    totalNetCharges: number;
    totalBalance: number;
    claimDetail837PInvoice: ClaimDetail837PInvoice[];
}
export class ClaimDetail837PInvoice {
    client_First_Name: string;
    client_Middle_Name: string;
    client_Last_Name: string;
    totalUnits: number;
    totalCharges: number;
    totalNetCharges: number;
    totalBalancaCharges: number;
    insurence_No: string;
    claim_No: string;
    payorInvoice837P: PayorInvoice837P;
    serviceInvoice837P: ServiceInvoice837P[];
}

export class PayorInvoice837P {
    payor_Name: string;
    payor_Id: string;
}

export class ServiceInvoice837P {
    serviceDate: string;
    modifier1: string;
    modifier2: string;
    modifier3: string;
    modifier4: string;
    service_Code: string;
    service_Location: string;
    totalUnits: number;
    totalCharges: number;
    totalNetCharges: number;
    rendering_Firstname: string;
    rendering_LastName: string;
}
export class SaveBatchFileNewReturnBO {
    batchno: string ='';
    filePath: string='';
    fileName: string= '';
    invoice837P: Invoice837P;
}
export class SaveBatchFileNewBO {
    claimMaterId: (number | null)[];
    clearingHouseId: number;
    groupLid: number;
}

export class AmountInfo {
    claimTotalcharges: number | null;
    claimPaidAmount: number | null;
}

export class PaymentInfo{
    paidAmount:number|null;
    paidDate: any;
}