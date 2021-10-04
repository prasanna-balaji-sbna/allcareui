import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService} from '@syncfusion/ej2-angular-grids';
import { ListComponent } from './list.component';
import { ListPageHTTPService } from './list.service';
import { BrowserModule } from '@angular/platform-browser';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPService } from './listdata.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    BrowserModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true,  
    //   exclude: [
    //   '/api/ColumnChange/getwidth?',
    //   '/api/ColumnChange/Savewidth?',
    
    // ]
   }),
  
    MaskedTextBoxModule

  ],
  providers: [ListPageHTTPService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService],
})
export class ListModule { }
