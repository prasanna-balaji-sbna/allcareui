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
  
  export class AgencyList {
    id: number = 0;
    serviceProviderId: number;
    agencyCode: string;
    agencyName: string;
    agencyShortName: string;
    agencyLogo: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    alt_Street: string;
    alt_City: string;
    alt_State: string;
    alt_Zipcode: string;
    statusLid: number=1;
    status_Name: string;
    //serviceMapList: serviceMappedBO[];
}

export class agencyStatusList {
    Key:string;
    Value:string;
    //serviceMapList: serviceMappedBO[];
}
export class StatusList {
    Key:number;
    Value:string;
}
export class IsViewEdit {
    isView: boolean;
    isEdit: boolean;
    isEditCompany:boolean;
    editCompanyId:number;
    AgencyId:number;
    CompanyData:CompanyList
} 

export class SaveReturnBO {
    agencyId: number;
    errorList: string[];
}
export class CompanyReturnBO {
    companyId: number;
    errorList: string[];
}
////////////////////////Company Bo/////////////////////
export class CompanyList {
    id: number;
    agencyId: number;
    companyName: string;
    providerNo: string;
    adminName: string;
    admin_LastName: string;
    admin_FirstName: string;
    submissionType: string;
    subCom_MANo: string;
    subCom_MCNo: string;
    taxCode_MANo: string;
    taxCode_MCNo: string;
    feiN_MCNo: string;
    bP_MANo: string;
    bP_MCNo: string;
    billto_Name: string;
    billto_Street: string;
    billto_City: string;
    billto_State: string;
    billto_zipcode: string;
    payTo_Street: string;
    payTo_City: string;
    payTo_State: string;
    payTo_zipcode: string;
    phone: string;
    fax: string;
    statusLid: number;
    statusValue: string;
}
export class StatusListCompany {
    Key:string;
    Value:string;
}export class Compaysort
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "CompanyName" ;
    shortType : string = 'asc';
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

///////Agency Bo///////////////
export class GetAgencyBO {
    SearchColumn: string="AgencyName";
    SearchText: string="";
    orderColumn: string="AgencyName";;
    orderType: string="asc";
    pageitem: number=10;
    currentpageno: number=1;
    AgencyFilter: number=0;
    userId: number; 
    companyFilter: number=0;
    agencyId: number=0;
    statusLid: number;
    //conitionBO: WhereCondition[];
    field: string = "AgencyName";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="";
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

export class WhereConditionCompany {
    field: string="CompanyName";
    value: string = "";
    operator: string= "startswith";
    matchCase: boolean= false;
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
}

///////Company Bo///////////////
export class GetCompanyBO {
    SearchColumn: string;
    SearchText: string;
    orderColumn: string;
    orderType: string;
    pageitem: number;
    currentpageno: number;
    companyFilter: number;
    agencyId: number;
    conitionBO: WhereConditionCompany[];
}
 

export class AgencyInfoBO {
    agencyName: string;
    phone: string;
    agencyLogo: string;
    agencyId: number | null;
}