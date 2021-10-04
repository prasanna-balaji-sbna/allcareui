import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule,ResizeService, ColumnChooserService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule } from 'mydatepicker';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import{EvvTimesheetComponent} from './evv-timesheet.component'
import { EvvTimesheetdataService } from './evv-timesheetdata.service';
@NgModule({
  declarations: [EvvTimesheetComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    ToolbarModule,
    NgSelectModule,
    GridModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule,
    DropDownListAllModule
  ],
  providers:[ PageService,
    SortService,
    ResizeService,
    FilterService,
    GroupService,PageService,EvvTimesheetdataService,ColumnChooserService]
  
})
export class EvvTimesheetModule { }
