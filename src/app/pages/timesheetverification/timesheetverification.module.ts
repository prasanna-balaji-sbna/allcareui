import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, SortService, FilterService, GroupService, PageService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
import { TimesheetverificationComponent } from './timesheetverification.component';
import { TimesheetverificationService } from './timesheetverification.service';
import { timesheetverificationdataservice } from './timesheetverificationdata.service';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { ClientParentModule } from '../client-parent/client-parent.module';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { EmployeeModule } from '../employee/employee.module';



@NgModule({
  declarations: [TimesheetverificationComponent],
  
  imports: [
    CommonModule,
    GridModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    ClientParentModule,
    FormsModule,
    DropDownListAllModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule,
    EmployeeModule

  ],
  providers: [TimesheetverificationService,ColumnChooserService,timesheetverificationdataservice, SortService,
    ResizeService,
    FilterService,
    GroupService,PageService],
     
})
export class TimesheetverificationModule { }
