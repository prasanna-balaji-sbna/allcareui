import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ICD10Component } from './pages/icd10/icd10.component';
import {ZipCodeComponent} from './pages/zip-code/zip-code.component';
import { CareCoordinatorComponent } from './pages/care-coordinator/care-coordinator.component';
import {GroupPayorComponent} from './pages/group-payor/group-payor.component';
import {GroupPayorServiceComponent} from './pages/group-payor-service/group-payor-service.component';
import { CaseManagerComponent } from './pages/case-manager/case-manager.component';
import { ListComponent } from './pages/list/list.component';
import { LovComponent } from './pages/lov/lov.component';

import { ClearingHouseComponent } from './pages/clearing-house/clearing-house.component';
import {EmployeeComponent}from './pages/employee/employee.component'
import { AgencyComponent } from './pages/agency/agency.component';
import { CompanyEditComponent } from './pages/agency/company-edit/company-edit/company-edit.component';
import { CompanyListComponent } from './pages/agency/company-list/company-list/company-list.component';
import { UsersComponent } from './pages/users/users.component';
import { TimesheetverificationComponent } from './pages/timesheetverification/timesheetverification.component';
import { MenuComponent } from './pages/menus/menus.component';
import{EmployeeReportComponent} from './pages/employee-report/employee-report.component'
import { ClientParentComponent } from './pages/client-parent/client-parent.component';
import{TimesheetComponent} from './pages/timesheet/timesheet.component'
import{DccodesComponent} from './pages/dccodes/dccodes.component';
import { ManageComponent } from './pages/manage/manage.component';
import { BatchComponent } from './pages/batch/batch.component';
import { ServiceEvaluation } from './pages/service-evaluation/service-evaluation.model';
import { ServiceEvaluationComponent } from './pages/service-evaluation/service-evaluation.component';
import { ClientIntakeFormComponent } from './pages/client-intake-form/client-intake-form.component';
import { IntakeManagementComponent } from './pages/intake-management/intake-management.component';
import { AgencySettingsComponent } from './pages/agency-settings/agency-settings.component';
import { ImportComponent } from './pages/import/import.component';
import { CanDeactivateGuard } from 'src/app/services/deactivate.service';
import { ProcessManagementComponent } from './pages/process-management/process-management.component';
import { RolesComponent } from './pages/roles/roles.component';

import {AidReportComponent} from './pages/aid-report/aid-report.component'
import { TimesheetnewComponent } from './pages/timesheetnew/timesheetnew.component';
import { LockedpayrollComponent } from './pages/lockedpayroll/lockedpayroll.component';
import {ClientReportComponent} from  './pages/client-report/client-report.component';
import { QPScheduleComponent } from './pages/qp-schedule/qp-schedule.component';

import { AgencypermissionComponent } from './pages/agencypermission/agencypermission.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QptimesheetComponent } from './pages/qptimesheet/qptimesheet.component';
import { OperationalDashboardComponent } from './pages/operational-dashboard/operational-dashboard.component';
import {ConsumerassesmentComponent} from './pages/client-parent/consumerassesment/consumerassesment.component'
import { EvvTimesheetComponent } from './pages/evv-timesheet/evv-timesheet.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { FrequencyScheduleComponent } from './pages/frequency-schedule/frequency-schedule.component';
// import { ForgotpasswordModule } from './pages/forgotpassword/forgotpassword.module';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
   
         {path:'icd10', component: ICD10Component},
         {path:'zip-codes', component:ZipCodeComponent},
         { path: 'care-coordinator',component:CareCoordinatorComponent},
         { path: 'dccodes',component:DccodesComponent},
         { path: 'group-payor',component:GroupPayorComponent},
         { path: 'group-payor-service',component:GroupPayorServiceComponent},
         { path: 'list',component:ListComponent},
         { path: 'case-manager',component:CaseManagerComponent },
         { path: 'manage-service',component: ManageComponent },
         { path: 'lov',component:LovComponent },
         { path: 'timesheets',component:TimesheetComponent },
         { path: 'qp',component:QPScheduleComponent },
         { path: 'clearing-house',component:ClearingHouseComponent },
         { path: 'employee',component:EmployeeComponent },
         { path: 'employee-report',component:EmployeeReportComponent },
         { path: 'csp',component:AgencyComponent,
        children:[
         { path:'company-edit', component:CompanyEditComponent},
         { path:'company-list', component:CompanyListComponent},
        ] },
         { path: 'users',component:UsersComponent },
         { path: 'timesheetverification',component:TimesheetverificationComponent },
         { path: 'timesheetnew',component:TimesheetnewComponent },
         { path: 'menu',component:MenuComponent },
         { path: 'client-parent',component:ClientParentComponent },
         { path: 'batch',component:BatchComponent },

         { path: 'service-evaluation',component:ServiceEvaluationComponent },
         { path: 'client-intake-form',component:ClientIntakeFormComponent},
         { path: 'intake-management',component:IntakeManagementComponent},
         { path: 'import',component:ImportComponent},
         { path: 'process-management',component:ProcessManagementComponent},
         { path: 'roles',component:RolesComponent},
         { path: 'agencyroles',component:AgencypermissionComponent},
         { path: 'lockedpayroll',component:LockedpayrollComponent},
         { path: 'aid-report',component:AidReportComponent},
         { path: 'setting',component:AgencySettingsComponent, canDeactivate:[CanDeactivateGuard] },
         { path: 'client-report',component:ClientReportComponent},
         {path:'dashboard',component:DashboardComponent},
         {path:'qptimesheet',component:QptimesheetComponent},
         {path:'operational-dashboard',component:OperationalDashboardComponent},
         {path:'consumerassesment',component:ConsumerassesmentComponent},
         {path:'evv-timesheets',component:EvvTimesheetComponent},
         {path:'reports',component:ReportsComponent},
         {path:'frequency',component:FrequencyScheduleComponent},




    ]
  },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordModule)},
  { path: 'reset-password', loadChildren: () => import('./pages/resetpassword/resetpassword.module').then(m => m.ResetpasswordModule)},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'password', loadChildren: () => import('./pages/password/password.module').then(m => m.PasswordModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,  // <- comment this line for enable lazy load
  // useHash: true
});