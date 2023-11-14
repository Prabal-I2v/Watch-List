import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  message: string;
  confirmString: string;
  deleteString: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.confirmString = data.confirmString;
    this.deleteString = data.deleteString;
  }

  ngOnInit() {
  }

  delete() {
    this.dialogRef.close("delete");
  }
  cancel() {
    this.dialogRef.close();
  }
}
