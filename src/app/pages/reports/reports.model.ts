export class PayorList {
    Key:string;
    Value:string;
    label:string;
    value:string;
}

export class groupList {
    Key:string;
    Value:string;
    label:string;
    value:string;
}
export class SaveBatchFileNewReturnBO {
    batchno: string ='';
    filePath: string='';
    fileName: string= '';
    invoice837P: Invoice837P;
}
export class Invoice837P {
    file_Name: string="";
    file_Creation_Date: string;
    submission_Control_Number: string='';
    compnay_Name: string='';
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
export class inactiveReport{
 filter:number;
 start:string=null;
 end:string=null;

}

export class returnReportBO {
    name: string;
    phoneNumber: string;
    email: string;
    dob: string;
    timesheetId: number;
    authorizationId: number;
}

export class spendownListBO {
    id: number;
    invoiceType: string;
    client: string;
    invoiceNumber: string;
    clientAddress: string;
    clientAddress1: string;
    clientCity: string;
    clientState: string;
    clientZip: string;
    payer: string;
    payerAddress: string;
    payerAddress1: string;
    payerCity: string;
    payerState: string;
    payerZip: string;
    invoiceDate: string;
    amount: number;
    adjust_amount:number;
    service_Amount: number;
    service_Date: string;
    prepareDate: string;
    service:string
}
export class TotalClaimChargesVsPaidBO {
    lClaimChargesVsPaid: ClaimChargesVsPaidBO[];
    totalChargeAmount: number | null;
    totalPaidAmount: number | null;
}
export class ClaimChargesVsPaidBO {
    payorName: string;
    totalAmount: number | null;
    paidAmount: number | null;
}
export class RenvenueInfoLisBO {
    payorName: string;
    netCharges: number | null;
    grossCharges: number | null;
}
export class PayerTrackPaymentsBO {
    checkorFFTdate: string;
    depositDate: string;
    paymentMethod: string;
    traceno: string;
    remittanceAmt: number;
}

export class TrackPaymentsInfoBo {
    payor_Name: string;
    lPayerTrackPayments: PayerTrackPaymentsBO[];
    totalAmount: number;
}

export class importBO {
   
    searchColumn: string;
    searchText: string;
    orderColumn: string='client';
    orderType: string='asc';
    pageitem: number=10;
    currentpageno: number=1;
    agencyID: number | null;
    spendownfilter:boolean|null=null;
    field: string='client';
    value: string='';
    matchCase: boolean=false;
    operator: string='startswith';
    type: string='string';
  
}

export class printspendownBO {
    idList: number[];
    agency: number;
}
