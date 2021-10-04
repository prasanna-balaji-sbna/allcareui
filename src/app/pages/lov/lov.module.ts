import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService , ResizeService} from '@syncfusion/ej2-angular-grids';
import { LovService } from './lov.service';
import { LovComponent } from './lov.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { GetHTTPService } from '../lov/lovtable.service';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // fgsColor: 'red',
  // fgsPosition: POSITION.bottomCenter,
  // fgsSize: 40,
  // bgsType: SPINNER.rectangleBounce, // background spinner type
  // fgsType: SPINNER.chasingDots, // foreground spinner type
  // pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5 ,// progress bar thickness
  minTime:100,
  fastFadeOut:true,
  // pbColor:'#abcdef'
};


@NgModule({
  declarations: [
    LovComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    MultiselectDropdownModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    // NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MaskedTextBoxModule


  ],
  providers: [LovService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService],
})
export class LovModule { }
