import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, FilterService, SortService, PageService, ResizeService  } from '@syncfusion/ej2-angular-grids';
// import { ModalModule } from 'ngx-bootstrap';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns'; 
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs'
import { ReportsComponent } from './reports.component';
import { ReportsService } from './reports.service';
import { MyDatePickerModule } from 'mydatepicker';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgSelectModule } from '@ng-select/ng-select';
import { reportdata } from './reportdata.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';


@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownListAllModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule,
    NgSelectModule,
    MyDatePickerModule,
    PDFExportModule,
    PdfViewerModule,
    PDFExportModule,AccordionModule
  ],
  providers: [ReportsService,ColumnChooserService,PageService,SortService,FilterService,ResizeService,reportdata],
})
export class ReportsModule { }
