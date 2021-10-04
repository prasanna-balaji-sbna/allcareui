export class ClientAidReportBO {
    id: number;
    clientName: string;
    pCAEmployee: string;
    qPEmployee: string;
    resopnsiplePartyName: string;
    submissiontyepe: string;
    clientId: number;
    reportedBy: string;
    completedBy: string;
    responsiblePartyNameContactId: number | null;
    pCAEmployeeId: number | null;
    qPEmployeeId: number | null;
    reviewDate: string | null;
    reportDate: string | null;
    reviewStartTime: string | null;
    reviewEndTime: string | null;
    isAideSupervision: boolean | null;
    isAidePresent: boolean | null;
    submissionTypeLid: number | null;
    aideReportComment: string;
    listChangesComment: string;
    masterServiceId: number | null;
    otherActivitiesComment: string;
    returnForSupervision: string;
    reportStatusLid: number | null;
    modifiedDate: string;
    createdDate: string | null;
    reportstatus:string|null
}

export class saveCLientAidReoprtBo {
    id: number;
    clientId: number;
    responsiblePartyNameContactId: number | null;
    pCAEmployeeId: number | null;
    qPEmployeeId: number | null;
    reviewDate: string | null;
    reportDate: string | null;
    reviewStartTime: string | null;
    reviewEndTime: string | null;
    isAideSupervision: boolean | null;
    isAidePresent: boolean | null;
    submissionTypeLid: number | null;
    aideReportComment: string;
    listChangesComment: string;
    masterServiceId: number | null;
    otherActivitiesComment: string;
    returnForSupervision: string;
    reportStatusLid: number | null;
    checkList: ClientAideReportCheckListBO[];
    serviceactivity: ClientAideReportServiceActivitiesBO[];
}

export class ClientAideReportCheckListBO {
    id: number;
    name: string;
    clientAideReportId: number;
    checkListLid: number;
    isCheckValue: boolean;
}

export class ClientAideReportServiceActivitiesBO {
    id: number;
    activity: string;
    clientAideReportId: number;
    masterServiceActivityId: number;
    comment: string;
    isCheckSatisfaction: boolean;
}
export class filters {
    start: string = null;
    end: string = null;
    client: number = 0;
}

export class getaid {
    start: string | null;
    end: string | null;
    employee: number | null;
    client: number | null=0;
    payor: number | null;
    currentpage: number=1;
    pageitems: number=10;
    agencyId: number;
    status:number;
    field: string = "clientName";
    value: string = "";
    orderColumn: string = "clientName";
    orderType: string = "ASC";
    matchCase: boolean = false;
    operator: string = "startswith";
    type: string = "string";
}
export class AidreportBO {
    aidlst: ClientAidReportBO[];
    total: number;
}