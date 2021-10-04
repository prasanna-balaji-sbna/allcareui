import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { CaseManagerComponent } from './case-manager.component';
import { casemanagerHTTPService } from './case-manager.service';
import { GetHTTPService } from './case-table.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    CaseManagerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  exports:[CaseManagerComponent],
  providers: [casemanagerHTTPService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService, ResizeService],
})
export class CaseManagerModule { }
