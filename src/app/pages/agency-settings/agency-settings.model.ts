export class SettingList {
    id: number;
    agencyId: number;
    coB_Config_IntakeProcess: boolean | null;
    coB_Config_AddNew: boolean | null;
    coB_Config_CSVImport: boolean | null;
    qP_VisitFrequencyConfigLCode: string;
    qP_VisitFrequencyConfigLid: number;
    eoB_AddNew: boolean | null;
    eoB_OnboardCheckList: boolean | null;
    eoB_CSVImport: boolean | null;
    sessionLogoutConfigLCode: string;
    sessionLogoutConfigLid: number;
    sheduleConfig_QPSchedule: boolean | null;
    scheduleConfig_PCAEmployeeSchdule: boolean | null;
    timeSheetGenerationConfigLCode: string;
    timeSheetGenerationConfigLid: number;
    clientSignatureConfigLCode: string;
    clientSignatureConfigLid: number;
    verificationSetupConfig_GPSLocation: boolean | null;
    verificationSetupConfig_TabletOrMobileUsingRFIDOrQRCode: boolean | null;
    manualTImesheetPayrollPeridConfig_Weekly: boolean | null;
    manualTImesheetPayrollPeridConfig_BiWeekly: boolean | null;
    weekStartLid:number|null;
    weekEndLid:number|null;
    overallFixedHrs:string="";
}

export class LovBO {
    id: number;
    lovCode: string;
    lovName: string;
    lovValue: string;
    listId: number;
    orderby: number;
    agencyId: number | null;
  }

  export class overallSideMenuItemBO {
    title: string;
    icon: string;
    link: string;
    children: childMenuBO[];
  }
  
  export class childMenuBO {
    title: string;
    link: string;
  }

  export class functionpermission {
    agencycreate: boolean = false;
    agencydelete: boolean = false;
    agencyupdate: boolean = false;
  
  }