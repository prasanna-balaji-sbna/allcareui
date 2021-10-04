import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { ResetpasswordComponent } from './resetpassword.component';
import { resetpasswordHTTPService } from './resetpassword.service';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: ResetpasswordComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    RouterModule.forChild(routes)
  ],
  providers: [resetpasswordHTTPService,ColumnChooserService,PageService,SortService,FilterService,ResizeService],
})
export class ResetpasswordModule { }
