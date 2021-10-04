import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import {EmployeeComponent} from './employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, ResizeService } from '@syncfusion/ej2-angular-grids';
import {EmployeeListComponent} from './employee-list/employee-list.component'
import { MyDatePickerModule}  from 'mydatepicker';
import {GetEmployeeservice} from './employeedata.service'
import {PayorRequiredIDsListComponent} from './payor-required-ids-list/payor-required-ids-list.component';
import { PageService, FilterService } from '@syncfusion/ej2-angular-grids';
import { PayRatesListComponent } from './pay-rates-list/pay-rates-list.component';
import { PayRatesEditComponent } from './pay-rates-edit/pay-rates-edit.component';
import { PayorRequiredIdsEditComponent } from './payor-required-ids-edit/payor-required-ids-edit.component';
import{RelationshipModule} from '../relationship/relationship.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownListAllModule, ListBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  exports: [PayorRequiredIdsEditComponent],
  declarations: [
    EmployeeEditComponent,
    EmployeeComponent,
    EmployeeListComponent,
     
     PayorRequiredIDsListComponent, 
     
      PayRatesListComponent, 
      PayRatesEditComponent, PayorRequiredIdsEditComponent],
     
  imports: [
    CommonModule,
    GridModule,
    MyDatePickerModule,
    NgSelectModule,
    NgbModule,
    RelationshipModule,
    DropDownListAllModule,
    FormsModule,
    ListBoxAllModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    DragDropModule,
    MaskedTextBoxModule

    
  ],
  providers: [ColumnChooserService,GetEmployeeservice,FilterService,PageService, ResizeService]
})
export class EmployeeModule { }
