export class ClearingHouseList{
    id: number;
    clearingHouseId: string;
    name: string;
    modifier: string;
    formatTypeLid: number | null;
    tradingPartnerID2: number | null;
    receiverIDQualifierLid: number | null;
    fileNameFormatType: number | null;
    receiverIDQualifier_Name: string;
    senderIdQualifier_Name: string;
    formatTypeName: string;
    receiverId: string;
    senderId: string;
    senderIDQualifierLid: number | null;
    agencyId: number | null;
    clearingHousePayorMapping: ClearingHousePayorMapping[] = [];
}

export class ClearingHousePayorMapping {
  id: number;
  clearingHouseId: number;
  groupPayorId: number = 0;
  payorID: string;
  status: boolean = false;
}

export class GroupPayorList{
    id: number;
    AgencyId: number;
    GroupLid: number;
    PayorName: string;
    BillingFullName: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Zip: string;
    PhoneNumber: string;
    DefaultBillType: string;
    payorId: string;
    I837PInsTypeLid: number;
    StateFormat: string;
    PayorEmail: string;
    GroupName: string;
    ATYPICAL: boolean;
    IsIcd10FromClient: boolean;
    Icd10: string;
    WaiverFlag: boolean;
}

export class searchfilterDetails {
  Filter_clearingHouseId: string = '';
  Filter_Name: string = '';
  Filter_ReceiverIdQualifier: any;
  Filter_ReceiverId: string = '';
  Filter_SenderId: string = '';
  Filter_SenderIdQualifier: any;
  Filter_Modifier: string = '';
}

export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "name";
    shortType : string = 'asc';
}

export class DropList {
  label: string;
  value: string;
}

export class functionpermission {
  clearinghousecreate: boolean = true;
  clearinghousedelete: boolean = true;
  clearinghouseupdate: boolean = true;
}

export class WhereCondition {
  field: string="name";
  value: string="";
  operator: string="startswith";
  orderNo: number=1;
  predicate: string="and";
  type: string="string";
  matchCase:boolean=false;
}
export class GetCHListBo {
    orderColumn: string = "name";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "name";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyId: number = 0;
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