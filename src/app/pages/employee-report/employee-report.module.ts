import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{EmployeeReportComponent} from'./employee-report.component'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {GetEmployeeReprtservice} from './getReport.service'
import { GridModule, ColumnChooserService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { PageService, FilterService } from '@syncfusion/ej2-angular-grids';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [EmployeeReportComponent],
  imports: [
    CommonModule,
    GridModule,

    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
    
  ],
  providers:[GetEmployeeReprtservice,ColumnChooserService,FilterService,PageService, ResizeService]
})
export class EmployeeReportModule { }
