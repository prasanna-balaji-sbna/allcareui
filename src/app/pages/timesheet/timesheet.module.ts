import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{TimesheetComponent} from './timesheet.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule,ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule } from 'mydatepicker';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {ClientParentModule}from '../client-parent/client-parent.module'
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import {timesheetdataservice} from './timesheetdata.service'
// import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [TimesheetComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    ClientParentModule,
    ToolbarModule,
    DropDownListAllModule,
    MyDatePickerModule,
    // TreeGridModule,
     PdfViewerModule,
     NgxUiLoaderModule,
     MaskedTextBoxModule

  ],
  providers:[ PageService,
    SortService,
    timesheetdataservice,
    ResizeService,
    FilterService,
    GroupService,PageService]
})
export class TimesheetModule { }
