import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { ICD10Component } from './icd10.component';
import { ICD10Service } from './icd10.service';
import { BrowserModule } from '@angular/platform-browser';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPIcdService } from './icd10table.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [
    ICD10Component,
  
 
  ],
  exports:[ICD10Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    BrowserModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

    
    
  ],
  providers: [ICD10Service,ColumnChooserService,PageService,SortService,FilterService,GetHTTPIcdService,ResizeService],
})
export class ICD10Module { }
