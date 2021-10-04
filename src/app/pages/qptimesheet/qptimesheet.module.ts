import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule,ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule } from 'mydatepicker';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { QptimesheetComponent } from './qptimesheet.component';
import { QPtimesheetdataservice } from './qptimesheet-table.service';
import { QPTimesheetService } from './qptimesheet.service';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [
    QptimesheetComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    ToolbarModule,
    DropDownListAllModule,
    MyDatePickerModule,
     PdfViewerModule,
     NgxUiLoaderModule,
     MaskedTextBoxModule
  ],
  providers: [QPtimesheetdataservice,QPTimesheetService,ResizeService]
})
export class QptimesheetModule { }
