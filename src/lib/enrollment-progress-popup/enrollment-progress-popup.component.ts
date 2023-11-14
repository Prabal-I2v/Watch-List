import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WatchListService } from '../services/watch-list.service';

@Component({
  selector: 'lib-enrollment-progress-popup',
  templateUrl: './enrollment-progress-popup.component.html',
  styleUrls: ['./enrollment-progress-popup.component.css']
})
export class EnrollmentProgressPopupComponent implements OnInit {

  @Input() noOfEnrollment: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public watchList : WatchListService) {
    // this.watchList.$enrollmentDoneCount.subscribe((count : number) => {
    //   this.noOfEnrollment = count;
    // });
    
    this.watchList.$enrollmentCompleted.subscribe((count : number) => { 
      this.noOfEnrollment = count;
      close();
    });

    if(data.event.noOfEnrollment != undefined){
      this.noOfEnrollment = data.event.noOfEnrollment;
    }
  }

  ngOnInit(): void {
  }

}
