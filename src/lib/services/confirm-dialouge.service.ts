import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialougeService {
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;

  constructor(public dialog: MatDialog) { }


  async  openDialouge(message: string, confirmString?: string, deleteString?: string) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: { 'message': message, 'confirmString': confirmString, 'deleteString': deleteString}
    });

    //this.confirmDialogRef.componentInstance.confirmMessage = message;
    //if (confirmString) {
    //  this.confirmDialogRef.componentInstance.confirmString = confirmString;
    //}
    //if (deleteString) {
    //  this.confirmDialogRef.componentInstance.cancelString = deleteString;
    //}
    var result = await this.confirmDialogRef.afterClosed().toPromise();
    
    /* this.confirmDialogRef = null; */
    return result;
  }

}
