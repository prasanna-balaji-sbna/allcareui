export class Listlst {
    id: number;
    agencyId: number | null;
    listName: string;
    listCode: string;
    isAvailableToAgency: boolean;
}

export class sortingObj {
    itemperpage: number = 20;
    currentPgNo: number = 1;
    shortcolumn: string = "ListName";
    shortType: string = 'asc';
}

export class functionpermission {
    listcreate: boolean = true;
    listdelete: boolean = true;
    listupdate: boolean = true;

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

export class WhereCondition {
    field: string = "listcode";
    value: string = "";
    operator: string = "startswith";
    orderNo: number = 1;
    predicate: string = "and";
    type: string = "string";
    matchCase: boolean = false;
}

export class GetListBO {
    orderColumn: string = "ListName";
    orderType: string = "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "listCode";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
}

