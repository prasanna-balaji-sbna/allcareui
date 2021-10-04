export class GroupPayorList {
    id: number;
    agencyId: number | null;
    groupLid: number;
    payorName: string;
    billingFullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
    defaultBillType: string;
    payorId: string;
    i837PInsTypeLid: number | null;
    stateFormat: string;
    payorEmail: string;
    groupName: string;
    aTYPICAL: boolean;
    icd10: string;
    isIcd10FromClient: boolean | null;
    waiverFlag: boolean;


}
export class GroupPayorCompanyMappingBO {
    id: number;
    groupPayorId:number;
    companyId: number;
    providerNo: string;
    companyFEIN: string;
    claim_Filling_Ind: string;
    taxCode_MANo: string;
    taxCode_MCNo: string;
}
export class getMappedCompanyBO {
    id: number;
    companyId: number;
    groupPayorId: number;
    companyName: string;
    providerNo: string;
    companyFEIN: string;
    claim_Filling_Ind: string;
    billto_Name: string;
    billto_Street: string;
    billto_City: string;
    billto_State: string;
    billto_zipcode: string;
    statusLid: number;
    statusValue: string;
    taxCode_MANo: string;
    taxCode_MCNo: string;
}
export class payorDropDownBO {
    label: string;
    value: string;
}
export class WhereCondition {
    field: string="payorName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetGroupPayorBO {
    SearchText: string ; 
    SearchColumn:string;
    orderColumn: string;
    orderType: string;
    pageitem: number;
    currentpageno: number;
    AgencyId: number;
    conitionBO: WhereCondition[];
}
export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "payorName" ;
    shortType : string = 'asc';
}
export class GetListBO {
    orderColumn: string = "payorName";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    agencyID: number=0;
    field: string = "payorName";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="string";

}
export class functionpermission {
    grouppayorcreate: boolean = true;
    grouppayordelete: boolean = true;
    grouppayorupdate: boolean = true;
  
  }

  export class columnWidth {
    column: string = "";
    width: number = 0;
}

export class ColumnChangeBO {
    id: number=0;
    userid: number=0;
    agencyId: number=0;
    column: string;
}
