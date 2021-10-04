import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService  } from '@syncfusion/ej2-angular-grids';
import { UsersHttpService } from './users.service';
import { UsersComponent } from './users.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { GetHTTPService } from './user-table.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

  ],
  providers: [UsersHttpService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService, ResizeService ],
})
export class UsersModule { }
