import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule ,ColumnChooserService, FilterService, PageService, ResizeService} from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientCreateEditComponent } from './client-create-edit/client-create-edit.component';
import { ClientAuthorizationEditComponent } from './client-authorization-edit/client-authorization-edit.component';
import { ClientAuthorizationComponent } from './client-authorization/client-authorization.component';
import { ClientParentComponent } from './client-parent.component';
import { StartofcarelistComponent } from './startofcarelist/startofcarelist.component';
import { StartofcareeditComponent } from './startofcareedit/startofcareedit.component';
import {dccodesModule} from '../dccodes/dccodes.module'
import {ICD10Module} from '../icd10/icd10.module'
import {CareCoordinatorModule} from '../care-coordinator/care-coordinator.module'
import { clienttserivce } from './clientservice';
import { DropDownListAllModule, ListBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { RelationshipModule } from '../relationship/relationship.module';
import { CaseManagerModule } from '../case-manager/case-manager.module';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CertificatelistComponent } from './certificatelist/certificatelist.component';
import { CertificateeditComponent } from './certificateedit/certificateedit.component';
import { ConsumerassesmentComponent } from './consumerassesment/consumerassesment.component';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [
    ClientParentComponent,
    ClientListComponent,
  ClientCreateEditComponent,
ClientAuthorizationComponent,
ClientAuthorizationEditComponent,
ClientCreateEditComponent,

ClientCreateEditComponent,
StartofcarelistComponent,
StartofcareeditComponent,
CertificatelistComponent,
CertificateeditComponent,
ConsumerassesmentComponent],
exports: [ClientAuthorizationEditComponent,CertificateeditComponent,StartofcareeditComponent],
  imports: [
    ICD10Module,
    CommonModule,
    GridModule,
    CareCoordinatorModule,
    MyDatePickerModule,
    dccodesModule,
  
    NgSelectModule,
    DropDownListAllModule,
    NgbModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    RelationshipModule,
    CaseManagerModule,
    ListBoxAllModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    DragDropModule,
    MaskedTextBoxModule

  ],
  providers:[clienttserivce,  ColumnChooserService,FilterService,PageService, ResizeService],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ClientParentModule { }
