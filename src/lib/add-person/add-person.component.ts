import { Component, OnInit, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WatchListService } from '../services/watch-list.service';
import { Subject } from 'rxjs';

declare var toastr: any;
@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss'],
})
export class AddPersonComponent implements OnInit, AfterViewInit {

  personImage: string = "";
  uploaded: boolean = false;
  embeddings: any = [];
  takeNames: boolean = false;
  isLoading: boolean = false;
  specialCase: boolean = false;
  fullImageAsFace: boolean = false;
  multipleUpload: boolean = false;
  multipleUploadCompleted: boolean = false;
  multipleUploadStarted: boolean = false;
  multipleUploadFailed: boolean = false;
  multiplePhotoUpload: boolean = false;
  uploadedFolders = [];
  selectedFolder : string = "";
  result : string = "";
  enrollmentStatus : Subject<number> = new Subject<number>();

  constructor(public dialogRef: MatDialogRef<AddPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private watchlistService: WatchListService) {
    if (data) {

    }
  }
  ngAfterViewInit(): void {
    var dialogAction: any = document.getElementsByClassName("mat-dialog-actions");
    for (let x = 0; x < dialogAction.length; x++) {
      dialogAction[x].style.padding = "0px";
      dialogAction[x].style.margin = "0px";
    }
    var dialogContent: any = document.getElementsByClassName("mat-dialog-content");
    for (let x = 0; x < dialogAction.length; x++) {
      dialogContent[x].style.margin = "0px";
    }
  }

  ngOnInit() {
    this.watchlistService.getUploadedFolders().subscribe((data : any) => {
      this.uploadedFolders = data;
    });

    this.watchlistService.$enrollmentDoneCount.subscribe((data : any) => {
      this.enrollmentStatus.next(data);
    });
  }

  onIconClick() {
    var x: any = document.getElementById("fileName");
    x.click();
  }

  dragOverHandler(ev: any) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  dropHandler(ev: any) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    var fileReader = new FileReader();
    //fileReader.onload = (event: any) => {
    //    this.licStr = event.target.result;
    //}
    fileReader.readAsText(ev.dataTransfer.files[0]);
    var dragLabel: any = document.getElementById("dragLabel");
    dragLabel.style.display = "none";
    var fileName: any = document.getElementById("fileName");
    fileName.innerHTML = ev.dataTransfer.files[0].name;

  }

  fileChange(evt: any) {
    var file = evt.target.files;
    if (evt.target.files.length > 1 && evt.target.files.length <= 100) {
      this.multipleUploadStarted = true;
      this.watchlistService.uploadMultipleFiles(file)
        .subscribe(
          data => {
           this.result = data['message'];
            this.uploaded = true;
            this.multipleUploadStarted = false;
                this.multipleUploadCompleted = true;
                this.multipleUploadFailed = false;
                this.watchlistService.$enrollmentDoneCount.next(0);
            this.watchlistService.$TotalEnrollmentCount.next(0);
          }, 
          error => {
            this.result = error['error'];
            this.multipleUploadStarted = false;
            this.multipleUploadCompleted = true;
            this.multipleUploadFailed = false;
          });
    }
    else if(evt.target.files.length == 1) {
      this.watchlistService.uploadFiles(file[0], file[0].name)
        .subscribe(
          data => {
            console.log('success');
            this.uploaded = true;
            this.personImage = "images/" + file[0].name;
          },
          (error: Error) => {
            console.log(error);
            this.multipleUploadStarted = false;
            this.multipleUploadCompleted = true;
            this.multipleUploadFailed = false;
            this.result = error['error'];
          })
    }
    else{
      toastr.error("Please select atleast one file and maximum 100 files");
    }
  }
  selectFolder(event){
    this.selectedFolder = event.target.value;
  }

  // AddPersonInBatch(){
    // this.multipleUploadStarted = true;
    // if(!this.multiplePhotoUpload){
    // this.watchlistService.addPersonInBatch(this.selectedFolder)
    // .subscribe(
    //   data => {
    //    this.result = data['message'];
    //     this.uploaded = true;
    //     this.multipleUploadStarted = false;
    //         this.multipleUploadCompleted = true;
    //         this.multipleUploadFailed = false;
    //         this.watchlistService.$enrollmentDoneCount.next(0);
    //         this.watchlistService.$TotalEnrollmentCount.next(0);
    //   }, 
    //   error => {
    //     this.multipleUploadStarted = false;
    //     this.multipleUploadCompleted = true;
    //     this.multipleUploadFailed = false;
    //     this.result = error['error'];
    //   });
    // }
    // else{
    //   this.watchlistService.addPersonInBatchWithMultiplePhotos(this.selectedFolder).subscribe((data)=>{
    //     this.result = data['message'];
    //     this.uploaded = true;
    //     this.multipleUploadStarted = false;
    //         this.multipleUploadCompleted = true;
    //         this.multipleUploadFailed = false;
    //         this.watchlistService.$enrollmentDoneCount.next(0);
    //         this.watchlistService.$TotalEnrollmentCount.next(0);
    //   }, error => {
    //     this.uploaded = true;
    //     this.multipleUploadStarted = false;
    //     this.multipleUploadCompleted = true;
    //     this.multipleUploadFailed = false;
    //     this.result = error['error'];
    //   });
    // }
  // }
  // next() {
  //   this.isLoading = true;
  //   this.watchlistService.getEmbedding(this.personImage, true, this.fullImageAsFace).subscribe(
  //     (data: any) => {
  //       this.isLoading = false;
  //       if (data) {
  //         this.embeddings = data;
  //         this.takeNames = true;
  //       }
  //     }, err => {
  //       this.isLoading = false;
  //     });
  // }

  removeImage(index: number) {
    if (index > -1) {
      this.embeddings.splice(index, 1);
    }
    if (this.embeddings.length == 0) {
      this.back();
    }
  }

  save() {
    if (this.embeddings.find((item: any) => { return !item.name || item.name == "" })) {
      this.watchlistService.notificationemittor.next({
        source: 'add-person',
        message: "Please provide name for all images",
        type: "error"
      });
      return;
    }
    var personList: any[] = [];
    this.embeddings.forEach((embedding: any) => {
      if (this.specialCase) {
        personList.push({ facePoints: [{ image: embedding.img, providedImage: this.personImage, embedding: embedding.embedding }], personName: embedding.name, doNotSendToFaceServer: true });
      } else {
        personList.push({ facePoints: [{ image: embedding.img, providedImage: this.personImage, embedding: embedding.embedding }], personName: embedding.name, doNotSendToFaceServer: false });
      }

    })
    this.isLoading = true;
    this.watchlistService.addMultiplePerson(personList).subscribe(
      data => {
        this.isLoading = false;
        this.watchlistService.notificationemittor.next({
          source: 'add-person',
          message: "Persons Added",
          type: "sucess"
        });
        this.dialogRef.close();
        /* this.updatePersonListInDataGridService(); */
      }, err => {
        this.isLoading = false;
      }
    )
  }

  back() {
    this.takeNames = false;
    this.uploaded = false;
  }

  changeFile() {
    this.uploaded = false;
  }
  /* updatePersonListInDataGridService() {
    this.watchlistService.getPersonList().subscribe(data => {
    });
  } */
}