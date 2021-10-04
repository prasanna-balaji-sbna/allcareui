export class SaveTimeSheet {
    timesheet: TimeSheets[];
    clientauth: clientAuth[];
    file: file[];
}
export class file {
    uploadtimesheet: string;
    timesheetUploadName: string;
}

export class QptimesheetBO {
    employeeId: number;
    clientId: number;
    totalHours: number;
    masterServiceId: number;
    id: number;
    isCliSignature: boolean;
    etimesheet: boolean;
    isEmpSignature: boolean;
    timesheetDate: string | null;
    timesheetNotes: string;
    employeeName: string;
    clientName: string;
    masterCode: string;
}

export class clientAuth {
    clientautherizationId: number;
    serviceId: number;
}
export class TimeSheets {
    id: number;
    employeeId: number | null;
    clientId: number | null;
    masterServiceId: number;
    ratio: string;
    etimesheet: boolean | null;
    scheduleDate: string | null;
    scheduleStartTime: string | null;
    scheduleEndtime: string | null;
    scheduleType: string;
    isCliSignature: boolean | null;
    isEmpSignature: boolean | null;
    groupPayorServiceId: number | null;
    paymentStatusLid: number | null;
    timesheetStatusLid: number | null;
    startLat: string;
    startLong: string;
    endLat: string;
    endLong: string;
    timesheetDate: string | null;
    totalHours: number;
    timesheetNotes: string;
    createdBy: number;
    createDate: string;
    createdIp: string;
    recordVersion: number;
    modifiedBy: number | null;
    modifiedDate: string | null;
    modifiedIp: string;
}
export class returnTimesheet {
    serialNumber: number;
    timesheet: Timesheet[];
}
export class TimesheetreturnBO {
    timesheetdata: returnTimesheet[];
    pageCount: number;
}
/////////////////////////////filter variable////////////////////////////////////////////////////
export class filters {
    filterStartDate: string;
    filterEndDate: string;
    filterEmployee: number;
    filterClient: number;
    filterPayor: number;
}
export class Timesheet {
    id: number;
    employeeId: number | null;
    clientId: number | null;
    masterServiceId: number;
    masterCode: string;
    employeeName: string;
    clientName: string;
    timesheetNotes: string;
    ratio: string;
    etimesheet: boolean | null;
    timesheetStatus: string;
    totalHours: number | null;
    scheduleDate: string | null;
    scheduleStartTime: string | null;
    scheduleEndtime: string | null;
    scheduleType: string;
    isCliSignature: boolean | null;
    isEmpSignature: boolean | null;
    groupPayorId: number | null;
    paymentStatusLid: number | null;
    timesheetStatusLid: number | null;
    startLat: string;
    startLong: string;
    endLat: string;
    endLong: string;
    serialNumber: number;
    timesheetDate: string;
    ispaydateentered: boolean;
    payerName: string;
}

export class sortingObj
{
    itemperpage : number =10;
    currentPgNo : number = 1;
    shortcolumn : string = "TimesheetDate" ;
    shortType : string = 'asc';
}


export class deletepermission{
    timesheet_id:number=0;
    admin_Password:string="";
      
  }
  export class WhereCondition {
    field: string="clientName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}

  export class gettimesheet {
    start: string | null;
    end: string | null;
    employee: number | null;
    client: number | null;
    payor: number | null;
    currentpage: number;
    pageitems: number;
    agencyId: number;
    field: string = "clientName";
    value: string = "";
    orderColumn: string="TimesheetDate";
    orderType: string="ASC";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="string";
}
export class functionpermission {
    timesheetsdelete: boolean = true;
  }
  export class employeeFilter
{
    employeeType:number;
    employeeStatus:number;
    employeeName:string
}

