import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{RelationshipComponent} from './relationship.component'
import { GridModule,ResizeService } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RelationshipService } from './relationship.service';
import { RelationshipDataService } from './relationshipdata.service';

@NgModule({
  declarations: [RelationshipComponent],
  imports: [
    CommonModule,
    GridModule,
    NgSelectModule,
    FormsModule,
    MaskedTextBoxModule

  ],
  providers:[ResizeService,RelationshipDataService],
  exports:[RelationshipComponent]
})
export class RelationshipModule { }
