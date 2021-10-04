// export class processListBo {
//     processId: number;
//     typeName: string;
//     typeId: number;
//     user: string;
//     userid: number;
//     roleid: string;
//     Rolename: string;
//     Order: number;
//     id: number;
//     effectivedate: string;
//     effectivethroughdate: string;
//     agencyId: number;
// }

export class processListBo {
    id: number;
    agencyId: number;
    loginRoleId: string;
    userId: number | null;
    typeLid: number;
    orderNumber: number;
    effectiveDate: string;
    effectiveThroughDate: string | null;
    isNotEffectiveThroughDate: boolean | null;
}

export class LovBO {
    value: string;
    label: string;
    listId: number;
}

export class DropList {
    value: string;
    label: string;
}

export class functionpermission {
    processmanagementcreate: boolean = true;
    processmanagementupdate: boolean = true;
}

export class WhereCondition {
    field: string="Typename";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetPMListBo {
    type: string = "string";
    SearchColumn: string = "Typename";
    SearchText: string = "";
    orderColumn: string = "Typename";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "Typename";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyId: number = 0;
    ptype: number = null;
    role: string = null;
    user: number = null;
}