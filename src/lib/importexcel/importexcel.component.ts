import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WatchListService } from '../services/watch-list.service';
import { WatchListComponent } from '../watch-list.component';

@Component({
  selector: 'app-importexcel',
  templateUrl: './importexcel.component.html',
  styleUrls: ['./importexcel.component.css']
})
export class ImportexcelComponent implements OnInit {

  filepath!: string;
  updatedRows: number = 0;
  loading: boolean = false;
  base64: boolean = true;

  constructor(private watchlistService: WatchListService, public dialogRef: MatDialogRef<ImportexcelComponent>) { }

  ngOnInit(): void {
  }

  uploadExcelToServerForEnrollment(evt: any) {
    this.watchlistService.noOfEnrollment = 0;
    var file = evt.target.files;
    this.loading = true;

    // this.watchlistService.uploadExcel(file[0], file[0].name, this.base64)
    //   .subscribe((data:any) => {
    //     this.loading = false;
    //     this.dialogRef.close()
    //   })
  }

  uploadfilepathAndEnrollingStart() {
    this.loading = true
    // this.watchlistService.enrollingThroughFilePath(this.filepath, this.base64)
    //   .subscribe((data:any) => {
    //     this.loading = false;
    //     this.dialogRef.close()
    //   })
  }

  close() {
    this.dialogRef.close()
    this.watchlistService.closeUpload().subscribe((data:any) => {
      localStorage.removeItem('enrollPerson')
    })

  }
  DownloadTemplate() {
    window.location.href = `http://${window.location.hostname}:5012/personenrollment/template.xlsx`;
  }

}
