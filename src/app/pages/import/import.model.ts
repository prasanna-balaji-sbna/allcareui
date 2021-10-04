export class ImportBO {
    filepath: string;
    // attachments: FormFile;
}

export class ImportreturnBO {
    id: number;
    filepath: string;
    folderName: string;
    fileName: string;
    uploadurl: string;
}
export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "ListName" ;
    shortType : string = 'asc';
}

export class functionpermission 
    {
    listcreate:boolean=true;
    listdelete:boolean=true;
    listupdate:boolean=true;

}

export class returnimport835 {
    invoice: Invoice835BO;
    error: string;
}

export class Invoice835BO {
    payorDetail: PayorDetail;
    paymentDetail: PaymentDetail;
    patient_ClaimDetail: Patient_ClaimDetail[];
}

export class PayorDetail {
    payorName: string;
    payorStreet: string;
    payorCity: string;
    payorState: string;
    payorZiPCode: string;
    payorId: string;
}

export class PaymentDetail {
    companyName: string;
    payment_Method: string;
    provider: string;
    chk_EFT_date: string;
    date: string;
    remittance_Amount: number;
    check_EFT_NBR: string;
}

export class Patient_ClaimDetail {
    patient: string;
    hIC: string;
    patCtrl: string;
    payor_Claim_Number: string;
    totalUnit: number;
    totalBilledAmt: number;
    totalClaimAmt: number;
    serviceLineDetail: ServiceLineDetail[];
    companydetails:companydetails[];
}
export class companydetails {
    companyAddress: string;
    companyCity: string;
    companyName: string;
}
export class ServiceLineDetail {
    serviceDate: string;
    unit: number;
    servicecode: string;
    mOD: string;
    billedAmt: number;
    denied_Detail: string;
    claimed_Amt: number;
    notes: string;
}
export class GetListBO {
    orderColumn: string = "fileName";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    listId: number;
    field: string = "fileName";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyID: number;
    type:string="string";

}
export class WhereCondition {
    field: string="fileName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
