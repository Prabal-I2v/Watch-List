import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { WatchListComponent } from './watch-list.component';
import { KendoGridComponent } from './kendo-grid/kendo-grid.component';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddPersonComponent } from './add-person/add-person.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FaceSettingComponent } from './face-setting/face-setting.component';
import { ImportexcelComponent } from './importexcel/importexcel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { SearchOutputComponent } from './search-output/search-output.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { i2vUtilityModule } from '@i2v-systems/i2v-utility';
import { ImageSelectionDialogComponent } from './image-selection-dialog/image-selection-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { PersonEnrollmentComponent } from './person-enrollment/person-enrollment.component';
import { EnrollmentProgressPopupComponent } from './enrollment-progress-popup/enrollment-progress-popup.component';
import { AttributesSearchComponent } from './attributes-search/attributes-search.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    WatchListComponent,
    KendoGridComponent,
    AddPersonComponent,
    ConfirmDialogComponent,
    FaceSettingComponent,
    ImportexcelComponent,SearchOutputComponent, ImageSelectionDialogComponent, PersonEnrollmentComponent, EnrollmentProgressPopupComponent, AttributesSearchComponent
  ],
  imports: [
    MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule,MatChipsModule,FormsModule,MatMenuModule,MatTooltipModule,CommonModule, ReactiveFormsModule
    ,GridModule,InputsModule,MatToolbarModule,MatProgressSpinnerModule,MatOptionModule,MatDialogModule,HttpClientModule,ButtonsModule,MatCheckboxModule,MatRadioModule
  ,MatSelectModule, i2vUtilityModule, MatBadgeModule],
  exports: [
    WatchListComponent,
  ]
})
export class WatchListModule { }
