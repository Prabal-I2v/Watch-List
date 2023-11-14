import { Component, OnInit, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-search-output',
  templateUrl: './search-output.component.html',
  styleUrls: ['./search-output.component.scss'],
})
export class SearchOutputComponent implements OnInit, AfterViewInit {

  matches: any[] = [];
  matchingPercentage:number;
  reference: string;
  topMatch: any = {};

  constructor(public dialogRef: MatDialogRef<SearchOutputComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.topMatch = data.matches;
    this.matches.splice(0, 1);
    this.reference = data.reference;
    this.matchingPercentage=Math.round(data.score*100);;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var dialog = <HTMLElement>document.getElementsByClassName('mat-dialog-container')[0];
    dialog.style.padding = "0px";
    dialog.style.overflow = "hidden";

  }


  getImage(image)
  {
    try {
      // Decoding base64 string to verify if it's a valid base64 string
      atob(image);
      return "data:image/png;base64," + image;
    } catch (e) {
      return image;
    }
  }

}
