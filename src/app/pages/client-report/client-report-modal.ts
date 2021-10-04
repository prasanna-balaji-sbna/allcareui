export class gettimesheetBO {
    start: string | null;
    end: string | null;
    employee: number | null;
    client: number | null;
    payor: number | null;
    currentpage: number=1;
    pageitems: number=10;
    agencyId: number;
    status: any;
    orderColumn: string="clientName";
    orderType: string="asc";
    field: string="clientName";
    value: string="";
    matchCase: boolean;
    operator: string="contains";
    type: string="string";
    clientstatus: string="Expired SA";
}
export class reportBO {
    clientName: string;
    dOB: string;
    email: string;
    phone: string;
    startDate: string | null;
    endDate: string | null;
    insuranceNumber: string;
    companyName: string;
    payorName: string;
    serviceCode: string;
    totalUnits: number | null;
    exceededUnits: number | null;
    usedUnits: number | null;
    remainingUnits: number | null;
}
export class returnclientReportBo {
    clientReport: reportBO[];
    totalCount: number;
}
