import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WatchListService } from '../services/watch-list.service';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModalComponent, CommonModalData } from '@i2v-systems/common-components';
import { EnrollmentProgressPopupComponent } from '../enrollment-progress-popup/enrollment-progress-popup.component';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'lib-person-enrollment',
  templateUrl: './person-enrollment.component.html',
  styleUrls: ['./person-enrollment.component.scss']
})


export class PersonEnrollmentComponent implements OnInit {

  selectedType: number = 0;

  personsToEnroll: Person[] = []

  selectedImagesCount: number = 0;

  uploadedFolders: uploadedFolder[] = [];

  uploadedFolderType = FolderType;

  isSingleEnrollment: boolean = false;

  isMultipleEnrollment: boolean = false;

  selectedFolder: uploadedFolder = null;

  uploadedFoldersForm: FormGroup;

  personsToEnrollForm: FormGroup;

  CSVFile: CSVFile = null;

  //for displaying file in preview
  tempCSVFile: CSVFile = null;

  loadingForBulkImageUpload: boolean = false;

  loadingForImageUpload: boolean = false;

  loadingForCSVUpload: boolean = false;

  matchPercentage : number = 50;

  labelInput : string = "";

  labelInputForm : FormGroup = this.formBuilder.group({
    labelInput : new FormControl('', [this.validationsService.tempLabelValidator])
  });

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<PersonEnrollmentComponent>, public watchlistService: WatchListService, private formBuilder: FormBuilder, public validationsService : ValidationService) { }

  ngOnInit(): void {

    this.loadingForBulkImageUpload = true;

    //create form for uploaded folders
    this.uploadedFoldersForm = this.formBuilder.group({
      selectedFolder: new FormControl(uploadedFolder)
    });

    //create form for persons to enroll
    this.personsToEnrollForm = this.formBuilder.group({
      persons: new FormArray([])
    });

    //get Uploaded Folder from Server
    this.watchlistService.getUploadedFolders().subscribe((folders: uploadedFolder[]) => {
      if (folders && folders.length > 0) {
        folders.forEach(folder => {
          if (folder.type == FolderType.Single) {
            this.isSingleEnrollment = true;
          }
          if (folder.type == FolderType.Nested) {
            this.isMultipleEnrollment = true;
          }
          this.uploadedFolders.push(folder);
        });
      }
      this.loadingForBulkImageUpload = false;
    });

    //get Uploaded Images Enrollment Status from Server
    this.watchlistService.$UploadedImagesPersonEnrollStatus.subscribe((data: Person) => {
      if (data) {
        this.personsToEnroll.find(x => x.imagePath == data.imagePath).enrolledStatus = data.enrolledStatus;
      }
    })

    // //create reactive form for uploaded folders
    // this.personToEnrollForm = this.formBuilder.array([
    //   this.formBuilder.group({
    //     name: new FormControl(''),
    //     imagePath: new FormControl(''),
    //     gender: new FormControl(''),
    //     label: new FormControl('')
    //   })
    // ]);

    // this.personsToEnrollForm.valueChanges.subscribe((data) => {
    //   console.log(this.personsToEnrollForm.controls.persons);
    //   console.log(this.personsToEnrollForm.controls.persons['controls'][0].controls['name'].errors);
    //   console.log(this.personsToEnrollForm.controls.persons.errors);
    // })

    // setInterval(()=>{
    //   console.log(this.labelInputForm.controls.labelInput);
    // },2000);

    this.labelInputForm.valueChanges.subscribe((data) => {
      this.labelInputForm.controls.labelInput.updateValueAndValidity();
    });
    this.labelInputForm.controls.labelInput.valueChanges.subscribe((data) => {
      this.labelInputForm.controls.labelInput.updateValueAndValidity();
    });
    this.labelInputForm.get('labelInput').valueChanges.subscribe((data) => {
      this.labelInputForm.controls.labelInput.updateValueAndValidity();
    });
  }

  //Invoked when we click on Tab to select any Enrollment Option, it changed the selectedType Value
  changeSelectedType(index) {
    this.selectedType = index;
  }

  //Invoked when we click on Tab to select any Enrollment Option
  callback = (val: number): void => {
    this.changeSelectedType(val);
  };

  //Invoked when we click on Browse button in Upload Images
  onBrowseClick(selectorName: string) {
    var x: any = document.getElementById(selectorName);
    x.click();
  }

  //Invoked when we drag files in Upload Images
  dragOverHandler(ev: any) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  //Invoked when we drop files in Upload Images
  dropHandler(ev: any) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    this.selectedImagesCount = ev.dataTransfer.files.length;
    this.watchlistService.getUploadedImages(ev.dataTransfer.files, this.matchPercentage)
      .subscribe(
        data => {
          if (data) {
            for (const item in data) {
              var person = new Person();
              person.name = "";
              person.imagePath = "data:image/png;base64," + data[item]['embeddingData'].img;
              person.gender = "";
              person.label = "";
              person.enrolledImagePath = data[item].enrolledImage;
              person.enrolledStatus = EnrolledStatus.Enrolling;
              person.facepoint = {};
              person.facepoint = {image: data[item]['embeddingData'].img, providedImage: data[item]['providedImage'], embedding: data[item]['embeddingData']['embedding'] };
              this.personsToEnroll.push(person);
              (<FormArray>this.personsToEnrollForm.controls.persons).push(this.formBuilder.group({
                name: new FormControl('', [Validators.required, this.validationsService.NameValidator]),
                label: new FormControl('', [Validators.required, this.validationsService.NameValidator]),
                gender: new FormControl('', [Validators.required, this.validationsService.GenderValidator])
              }));

            };
          }
        },
        error => {
          this.dialog.closeAll();
          this.watchlistService.notificationemittor.next({
            source: 'person enrollment',
            message: error.error,
            type: "error"
          });
        });

  }

  //Invoked when we select files in Upload Images
  fileChangeForImages(evt: any) {
    var files = evt.target.files;
    this.selectedImagesCount = files.length;
    if (evt.target.files.length > 0 && evt.target.files.length <= 20) {
      var files = evt.target.files;
      this.selectedImagesCount = files.length;
      this.loadingForImageUpload = true;
      this.watchlistService.getUploadedImages(files,  this.matchPercentage)
        .subscribe(
          (data) => {
            if (data) {
              this.setPersonData(data);
            }
            this.loadingForImageUpload = false
          },
          error => {
            this.dialog.closeAll();
            this.watchlistService.notificationemittor.next({
              source: 'person enrollment',
              message: error.error,
              type: "error"
            });
          });
    }
    else {
      // toastr.error("Please select atleast one file and maximum 100 files");
    }
  }

  private setPersonData(data: any) {
    for (const item in data) {
      var person = new Person();
      person.name = "";
      person.imagePath = "data:image/png;base64," + data[item]['embeddingData'].img;
      person.gender = "";
      person.label = "";
      person.enrolledImagePath = data[item].enrolledImage;
      person.enrolledStatus = EnrolledStatus.Enrolling;
      person.facepoint = {};
      person.facepoint = { image: data[item]['embeddingData'].img, providedImage: data[item]['providedImage'], embedding: data[item]['embeddingData']['embedding'] };
      this.personsToEnroll.push(person);
      (<FormArray>this.personsToEnrollForm.controls.persons).push(this.formBuilder.group({
        name: new FormControl('', [Validators.required, this.validationsService.NameValidator]),
        label: new FormControl('', [Validators.required, this.validationsService.LabelValidator]),
        gender: new FormControl('', [Validators.required, this.validationsService.GenderValidator])
      }));
    };
  }

  //Invoked when we remove single uploaded photos in Upload Images
  removePerson(person: Person) {
    var imageToDelete = [person.imagePath]
    this.watchlistService.deleteUploadedImages(imageToDelete).subscribe();
    var index = this.personsToEnroll.indexOf(person);
    this.personsToEnroll.splice(index, 1);
    this.personsToEnrollForm.controls.persons['controls'].splice(index, 1);
    this.personsToEnrollForm.value['persons'].splice(index, 1);
      this.personsToEnrollForm.controls.persons.updateValueAndValidity();
  }

  //Invoked when we remove all uploaded photos in Upload Images
  removeAllPerson(personList: Person[]) {
    var imageToDelete = []
    personList.forEach(person => {
      imageToDelete.push(person.imagePath);
    });
    this.watchlistService.deleteUploadedImages(imageToDelete).subscribe();
    this.personsToEnroll = [];
    this.personsToEnrollForm.controls.persons['controls'] = [];
    this.personsToEnrollForm.value['persons'] = [];
  }

  //Invoked when enroll uploaded images in Upload Images
  enrollUploadedImages() {
    localStorage.setItem("isEnrollmentInProgress", "true");
    // console.log(this.personsToEnrollForm.value)
    console.log(this.personsToEnrollForm)
    if (this.personsToEnrollForm.invalid) {
      this.watchlistService.notificationemittor.next({
        source: 'person enrollment',
        message: "Please fill details correctly",
        type: "error"
      });
    }
    else {
      this.watchlistService.enrollUploadedImages(this.personsToEnroll).subscribe((data) => {
        if (data) {
          localStorage.setItem("isEnrollmentInProgress", "false");
          localStorage.setItem('isNotifierVisible', "false");
          enrollmentProgressPopupRef.close();
          this.watchlistService.notificationemittor.next({
            source: 'person enrollment',
            message: "Person Enrolled Successfully",
            type: "sucess"
          });
        }
      },
        error => {
          localStorage.setItem("isEnrollmentInProgress", "false");
          localStorage.setItem('isNotifierVisible', "false");
          enrollmentProgressPopupRef.close();
          this.watchlistService.notificationemittor.next({
            source: 'person enrollment',
            message: error.error,
            type: "error"
          });
          // this.toastr(error.error);
        });

      var data: CommonModalData = {
        event: {
          component: EnrollmentProgressPopupComponent,
          noOfEnrollment: this.personsToEnroll.length
        },
        showPreviousButton: false,
        showNextButton: false,
        showBackButton: false,
        height: '400px',
        width: '400px'
      };

      this.dialog.closeAll();

      var enrollmentProgressPopupRef = this.dialog.open(CommonModalComponent, {
        panelClass: "custom-dialog-container",
        data: data,
      });

      enrollmentProgressPopupRef.afterClosed().subscribe(() => {
        this.dialogRef.close(this.personsToEnroll);
        localStorage.setItem('isNotifierVisible', "true");
      });

    }
  }

  //Invoked when we change the folder selection
  onFolderChange(folder: uploadedFolder) {
    this.selectedFolder = folder
  }

  //Invoked when we change CSV file to upload in dropHandler
  fileChangeForCSV(evt: any) {
    // this.watchlistService.uploadExcel(evt.target.files[0], evt.target.files[0].name, true)
    // .subscribe((data: any) => {
    //   this.loadingForCSVUpload = false;
    // })
    this.CSVFile = new CSVFile();
    this.CSVFile.name = evt.target.files[0].name;
    this.CSVFile.file = evt.target.files[0];
    this.tempCSVFile = this.CSVFile;

  }

  //Invoked when we change CSV file to upload in Enter filepath manually
  filePathForCSV(evt: any) {
    if (evt.target.value != "" && evt.target.value != null) {
      this.CSVFile = new CSVFile();
      //extract name from this type of path C:\Users\Prabal\Desktop\Enrollment\new_template.csv
      this.CSVFile.name = evt.target.value.split("\\").pop();
      this.CSVFile.filePath = evt.target.value;
    }
  }

  //Invoked when we remove CSV file using delete button
  removeCSVFile(event: any) {
    this.CSVFile = null;
    this.tempCSVFile = null;
    event.stopPropagation();

  }

  //Invoked when we click on Upload CSV button
  EnrollPersonThroughCSV() {
    localStorage.setItem("isEnrollmentInProgress", "true");
    this.watchlistService.uploadExcel(this.CSVFile, true)
      .subscribe((data) => {
        if (data) {
          localStorage.setItem("isEnrollmentInProgress", "false");
          localStorage.setItem('isNotifierVisible', "false");
          enrollmentProgressPopupRef.close();
          this.watchlistService.notificationemittor.next({
            source: 'person enrollment',
            message: "Person Enrolled Successfully",
            type: "sucess"
          });
        }
      },
        error => {
          localStorage.setItem("isEnrollmentInProgress", "false");
          localStorage.setItem('isNotifierVisible', "false");
          enrollmentProgressPopupRef.close();
          this.watchlistService.notificationemittor.next({
            source: 'person enrollment',
            message: error.error,
            type: "error"
          });
          // this.toastr(error.error);
        });

    var data: CommonModalData = {
      event: {
        component: EnrollmentProgressPopupComponent
      },
      showPreviousButton: false,
      showNextButton: false,
      showBackButton: false,
      height: '400px',
        width: '400px'
    };

    this.dialog.closeAll();

    var enrollmentProgressPopupRef = this.dialog.open(CommonModalComponent, {
      panelClass: "custom-dialog-container",
      data: data,
    });

    enrollmentProgressPopupRef.afterClosed().subscribe(() => {
      this.dialogRef.close(this.personsToEnroll);
      localStorage.setItem('isNotifierVisible', "true");
    });
  }

  //Download CSV template
  DownloadTemplate() {
    window.location.href = `http://${window.location.hostname}:5012/Enrollment/template.csv`;
  }

  //Invoked when start enrollment through Bulk Image Upload
  UploadFolder() {
    localStorage.setItem("isEnrollmentInProgress", "true");
    if (this.selectedFolder != null) {
      if (this.selectedFolder.type == FolderType.Nested) {
        this.watchlistService.addPersonInBatchWithMultiplePhotos(this.selectedFolder.name, this.labelInput).subscribe((data) => {
          if (data) {
            localStorage.setItem("isEnrollmentInProgress", "false");
            localStorage.setItem('isNotifierVisible', "false");
            enrollmentProgressPopupRef.close();
            // this.toastr(data.Message);
            this.watchlistService.notificationemittor.next({
              source: 'person enrollment',
              message: "Person Enrolled Successfully",
              type: "sucess"
            });
          }
        },
          error => {
            localStorage.setItem("isEnrollmentInProgress", "false");
            localStorage.setItem('isNotifierVisible', "false");
            enrollmentProgressPopupRef.close();
            this.dialog.closeAll();
            this.watchlistService.notificationemittor.next({
              source: 'person enrollment',
              message: error.error,
              type: "error"
            });
            // this.toastr(error.error);
          })
      }
      else {
        this.watchlistService.addPersonInBatch(this.selectedFolder.name, this.labelInput).subscribe((data) => {
          if (data) {
            localStorage.setItem("isEnrollmentInProgress", "false");
            localStorage.setItem('isNotifierVisible', "false");
            enrollmentProgressPopupRef.close();
            // this.toastr(data.Message);
          }
        },
          error => {
            localStorage.setItem("isEnrollmentInProgress", "false");
            localStorage.setItem('isNotifierVisible', "false");
            enrollmentProgressPopupRef.close();
            this.dialog.closeAll();
            this.watchlistService.notificationemittor.next({
              source: 'person enrollment',
              message: error.error,
              type: "error"
            });
            // this.toastr(error.error);
          })
      }
    }

    var data: CommonModalData = {
      event: {
        component: EnrollmentProgressPopupComponent,
        noOfEnrollment: this.selectedFolder.childrens.length
      },
      showPreviousButton: false,
      showNextButton: false,
      showBackButton: false,
      height: '400px',
        width: '400px'
    };

    this.dialog.closeAll();

    var enrollmentProgressPopupRef = this.dialog.open(CommonModalComponent, {
      panelClass: "custom-dialog-container",
      data: data,
    });

    enrollmentProgressPopupRef.afterClosed().subscribe(() => {
      this.dialogRef.close(this.personsToEnroll);
      localStorage.setItem('isNotifierVisible', "true");
    });
  }

  //close the dialog
  close(){
    this.dialog.closeAll()
  }

  setNoImage(event : any){
    event.target.src = 'assets/no-image.jpg';
  }
}


export enum EnrolledStatus {
  "NotEnrolled",
  "Enrolling",
  "Enrolled"
}
export class Person {
  name: string;
  imagePath: string;
  gender: string;
  label: string;
  enrolledStatus: EnrolledStatus = EnrolledStatus.NotEnrolled;
  enrolledImagePath: string;
  facepoint: any;
}
export enum FolderType {
  Nested,
  Single
}
export class uploadedFolder {
  childrens: uploadedFolder[];
  name: string;
  fileCount: string;
  type: FolderType;
}
export class CSVFile {
  name: string;
  filePath: string;
  file: File;

  constructor() {
    this.file = null;
    this.filePath = "";
    this.name = "";
  }
}


