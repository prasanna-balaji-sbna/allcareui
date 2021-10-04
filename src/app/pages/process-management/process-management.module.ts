import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessManagementComponent } from './process-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
// import { carecordinatorService } from './care-cordinator.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { GetHTTPService } from './process-managementdata.service';
import { PMHttpService } from './process-management.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    ProcessManagementComponent
  ],
  imports: [
    MyDatePickerModule,
    NgSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    GridModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

  ],
  providers: [PMHttpService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService],
})
export class ProcessManagementModule { }
