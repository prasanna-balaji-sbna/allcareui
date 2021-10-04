export class GroupPayorServiceTableBO {
    id: number;
    agencyId: number | null;
    icd10: string;
    isIcd10FromClient: boolean | null=true;
    groupId: number;
    groupName: string;
    payorName: string;
    groupPayorId: string;
    masterServiceId: number;
    serviceDescription: string;
    billingUnitLid: number;
    serviceName: string;
    billingUnit: string;
    netRate: number | null;
    unitrate: number | null;
    hcpcCode: string;
    callTypeID: number | null;
    unitMultiplier: number | null;
    billIndividually: boolean | null;
    revCode: string;
    providerLid: number | null;
    companyIdentifier: boolean | null;
    g2id: string;
    npi: string;
    companyName: string;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    facilityID: string;
    serviceLoc: string;
    pharm: boolean | null;
    homeVisit: boolean | null;
    rateChangeDate: string | null;
    oldUCRate: number | null;
    oldNetRate: number | null;
    waiverFlag: boolean;
}
export class GroupPayorServiceList
{
    id:number
    groupName: string;
    groupId: number;
    payorName: string;
    groupPayorId: number;
    serviceName: string; 
    masterServiceId: number;
    billingUnitLid: number;
    netRate: number | null;
    serviceLoc: string;
    name: string;
    address1: string;
    facilityID: string;
    billingUnit: string;

}
export class grp
{
    Group:number=0;
    Payor:number=0
    Service:number=0
    Billing:number=0
    FacilityName:string="";
    FacilityId:string="";
}
export class filters
{
    groupId:string="0";
    groupPayorId: string="0";
    service:string="0"
    billingUnitLid:string="0"
    name:string=""
    FacilityId:string=""
}
export class sortingObj
{
   
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "groupName" ;
    shortType : string = 'asc';
}
export class functionpermission 
{
grouppayorservicecreate:boolean=true;
grouppayorservicedelete:boolean=true;
grouppayorserviceupdate:boolean=true;

}
export class WhereCondition {
    field: string="groupName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}

export class GetGroupPayorServiceBO {
    // group: number=0;
    // payor: number=0;
    // service: number=0;
    // billing: number=0;
    // facilityName: string="";
    // facilityId: string="";
    // searchColumn: string;
    // searchText: string;
    orderColumn: string="groupName";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    agencyID: number;
    field: string="serviceDescription";
    value: string = "";
    matchCase: boolean=false;
    operator: string;
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