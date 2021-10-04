import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ImportService } from './import.service';
import { ImportComponent } from './import.component';
import { GetHTTPImportService } from './import-table.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    PDFExportModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

  ],
  providers: [ImportService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPImportService,ResizeService],
})
export class ImportModule { }
