import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ToastrModule } from 'ngx-toastr';
import { PipesModule } from './theme/pipes/pipes.module';
import { routing } from './app.routing';
import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './theme/components/header/header.component';
import { FooterComponent } from './theme/components/footer/footer.component';
import { SidebarComponent } from './theme/components/sidebar/sidebar.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from './theme/components/back-top/back-top.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FavoritesComponent } from './theme/components/favorites/favorites.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClientJsonpModule  } from '@angular/common/http';
import { GlobalComponent } from './global/global.component';
import { GridModule, ColumnChooserService } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService, ResizeService  } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { AuthService } from './auth.service';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { MyDatePickerModule } from 'mydatepicker';
import { SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';

// import { CashinComponent } from './pages/cashin/cashin.component';
// import { CashinAccountdetailsComponent } from './pages/cashin-accountdetails/cashin-accountdetails.component';
import { FilterSettingsModel, IFilter, GridComponent } from '@syncfusion/ej2-angular-grids';

import {DatePipe, CommonModule, LocationStrategy, HashLocationStrategy} from '@angular/common'

import {FileUploadModule} from 'ng2-file-upload';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ICD10Component } from './pages/icd10/icd10.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZipCodeModule } from './pages/zip-code/zip-code.module';
import { CareCoordinatorModule } from './pages/care-coordinator/care-coordinator.module';
import { GroupPayorModule } from './pages/group-payor/group-payor.module';
import { GroupPayorServiceModule } from './pages/group-payor-service/group-payor-service.module';
import { CaseManagerModule } from './pages/case-manager/case-manager.module';
import { ListModule } from './pages/list/list.module';

import { ICD10Module } from './pages/icd10/icd10.module';
import { LovModule } from './pages/lov/lov.module';
// import { FormsModule } from '@angular/forms';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

import { ClearingHouseModule } from './pages/clearing-house/clearing-house.module';
import {EmployeeModule} from './pages/employee/employee.module'
import { FormsModule } from '@angular/forms';
import { AgencyModule } from './pages/agency/agency.module';
import { UsersModule } from './pages/users/users.module';

import { TimesheetverificationModule } from './pages/timesheetverification/timesheetverification.module';
import { MenuModule } from './pages/menus/menus.module';
import { EmployeeReportModule } from './pages/employee-report/employee-report.module';
import {RelationshipModule} from './pages/relationship/relationship.module'
import { ClientParentModule } from './pages/client-parent/client-parent.module';
import {dccodesModule} from './pages/dccodes/dccodes.module';
import { TimesheetModule } from './pages/timesheet/timesheet.module';

import { ManageModule } from './pages/manage/manage.module';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CommonHttpService } from './common.service';
import { BatchComponent } from './pages/batch/batch.component';
import { BatchModule } from './pages/batch/batch.module';

import { ServiceEvaluationComponent } from './pages/service-evaluation/service-evaluation.component';
import { ClientIntakeFormComponent } from './pages/client-intake-form/client-intake-form.component';
import { IntakeManagementComponent } from './pages/intake-management/intake-management.component';
// import { ClientIntakeFormService } from './pages/client-intake-form/client-intake-form.service';
// import { ClientIntakeFormModule } from './pages/client-intake-form/client-intake-form.module';
// import { IntakeManagementModule } from './pages/intake-management/intake-management.module';


import { AgencySettingsModule } from './pages/agency-settings/agency-settings.module';
import { ImportComponent } from './pages/import/import.component';

// import { DischargeComponent } from './discharge/discharge.component';
//import { DccodesComponent } from './pages/dccodes/dccodes.module';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ClientIntakeFormModule } from './pages/client-intake-form/client-intake-form.module';

import { SerivceEvaluationModule } from './pages/service-evaluation/service-evaluation.module';

import { CanDeactivateGuard } from 'src/app/services/deactivate.service';
// import { AppComponent } from './app.component';
// import {TreeGridModule} from '@syncfusion/ej2-angular-treegrid';
import { from } from 'rxjs';

import { ProcessManagementModule } from './pages/process-management/process-management.module';
import { RolesModule } from './pages/roles/roles.module';
import { AidReportModule } from './pages/aid-report/aid-report.module';
import { TimesheetnewComponent } from './pages/timesheetnew/timesheetnew.component';
import { TimesheetnewModule } from './pages/timesheetnew/timesheetnew.module';

import { LockedpayrollComponent } from './pages/lockedpayroll/lockedpayroll.component';
import { ImportModule } from './pages/import/import.module';

import { LockedpayrollModule } from './pages/lockedpayroll/lockedpayroll.module';
import { ClientReportModule } from './pages/client-report/client-report.module';
import { ForgotpasswordModule } from './pages/forgotpassword/forgotpassword.module';
import { AgencypermissionModule } from './pages/agencypermission/agencypermission.module';
import { ResetpasswordModule } from './pages/resetpassword/resetpassword.module';
import { QPScheduleComponent } from './pages/qp-schedule/qp-schedule.component';
import { QPScheduleModule } from './pages/qp-schedule/qp-schedule.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { MenuService } from './theme/components/menu/menu.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { QptimesheetModule } from './pages/qptimesheet/qptimesheet.module';
import { OperationalDashboardModule } from './pages/operational-dashboard/operational-dashboard.module';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import{EvvTimesheetModule} from './pages/evv-timesheet/evv-timesheet.module';
import { ReportsComponent } from './pages/reports/reports.component'
import { ReportsModule } from './pages/reports/reports.module';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { FrequencyScheduleModule } from './pages/frequency-schedule/frequency-schedule.module';


// import { ForgotpasswordModule } from './pages/forgotpassword/forgotpassword.module';

@NgModule({  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    NgbModule,
    EvvTimesheetModule,
    RelationshipModule,
    MultiselectDropdownModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot(), 
    PipesModule,
    // ReactiveFormsModule,
    HttpClientModule,
    GridModule,
    ToolbarModule,
    AngularMyDatePickerModule,
    MyDatePickerModule,
    routing,
    FileUploadModule,
    MultiSelectModule,

    // NgMultiSelectDropDownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    TimesheetModule,
    ZipCodeModule,
    CareCoordinatorModule,
    GroupPayorModule,
    GroupPayorServiceModule,
    CaseManagerModule,
    ListModule,
    ICD10Module,
    LovModule,
    NgSelectModule,
    DialogModule,
    ClearingHouseModule,
    UsersModule,
    MenuModule,
    EmployeeModule,
    EmployeeReportModule,
    AgencyModule,
    UsersModule,
    TimesheetverificationModule,
    ClientParentModule,
    dccodesModule,
    CommonModule,
    ManageModule,    
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    ManageModule,
    BatchModule,
    PDFExportModule,
    ProcessManagementModule,
    NgbModule,
    TimesheetnewModule,
    ClientIntakeFormModule,
    ImportModule,
    AidReportModule,
    QPScheduleModule,
    SerivceEvaluationModule,
    AgencySettingsModule,
    CommonModule,
    RolesModule,
    LockedpayrollModule,
    // TreeGridModule
    ClientReportModule,
    ForgotpasswordModule,
    AgencypermissionModule,
    ResetpasswordModule,
    DashboardModule,
    QptimesheetModule,
    OperationalDashboardModule,
    ReportsModule,
    FrequencyScheduleModule,
    HttpClientJsonpModule
    // NgxUiLoaderModule,
    // NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
  
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    FullScreenComponent,
    UserMenuComponent,
    FavoritesComponent,
    NotFoundComponent,
    // DashboardComponent,
    // ServiceEvaluationComponent,
    IntakeManagementComponent,
    // OperationalDashboardComponent,
   
    // QptimesheetComponent,
  
    // QPScheduleComponent,
    // ResetpasswordComponent,
    // ForgotpasswordComponent,
   // ClientReportComponent,
   //  ImportComponent,
    //AidReportComponent,
    // LockedpayrollComponent,
    // TimesheetnewComponent,
    // ProcessManagementComponent,
   // EmployeeReportComponent,
   // PayorRequiredIDsComponent,
   // EmployeeComponent,
   // EmployeeListComponent,
    //DccodesComponent,
    // UsersComponent,
    // ClearingHouseComponent,
    // ListComponent,
    // CareCoordinatorComponent,
    // ZipCodeComponent,
    // AgentComponent,
    // AgentEditComponent,
    // CustomerComponent,
    // CustomerEditComponent,
    // CspComponent,
    // CspEditComponent,
    // AssetComponent,
    // AssetEditComponent,
    // RolesComponent,
    // RoleMappingComponent,
    // UserListComponent,
    // UserAddComponent,
    // CashinComponent,
    // CashinAccountdetailsComponent,
    // FundTransferComponent,
    // BankComponent,
  
  ],
  providers: [ 
    CanDeactivateGuard,
    AppSettings,
    DatePipe,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    GlobalComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true,
    },
    PageService, SortService, FilterService, GroupService,MenuService, SearchService, ToolbarService,
    ColumnChooserService,CommonHttpService,ResizeService,
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
