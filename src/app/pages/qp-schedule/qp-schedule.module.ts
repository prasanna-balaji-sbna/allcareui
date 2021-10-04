import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule, PageService, SortService, FilterService, GroupService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule } from 'mydatepicker';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {ClientParentModule}from '../client-parent/client-parent.module'
// import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QPScheduleComponent } from './qp-schedule.component';
import { QPService } from './qp-schedule.service';
import { DateService } from 'src/app/date.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
@NgModule({
  declarations: [QPScheduleComponent],
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
     NgxUiLoaderModule
    
  ],
  providers:[ PageService,
    SortService,
    FilterService,
    GroupService,PageService,QPService,DateService,ResizeService]
})
export class QPScheduleModule { }
