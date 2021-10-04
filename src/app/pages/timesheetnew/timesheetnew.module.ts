import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule,ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule } from 'mydatepicker';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {ClientParentModule}from '../client-parent/client-parent.module'
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
// import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TimesheetnewComponent } from './timesheetnew.component';
import { payrollservice } from './timesheetnewListdata.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [TimesheetnewComponent],
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
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    PDFExportModule,
    MaskedTextBoxModule

     
    
  ],
  providers:[ PageService,
    SortService,
    ResizeService,
    FilterService,
    GroupService,PageService,payrollservice]
})
export class TimesheetnewModule { }
