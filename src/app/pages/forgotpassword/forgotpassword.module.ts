import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { ForgotpasswordComponent } from './forgotpassword.component';
import { forgotpasswordHTTPService } from './forgotpassword.service';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: ForgotpasswordComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [
    ForgotpasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,    
    RouterModule.forChild(routes)
  ],
  providers: [forgotpasswordHTTPService,ColumnChooserService,PageService,SortService,FilterService,ResizeService],
})
export class ForgotpasswordModule { }
