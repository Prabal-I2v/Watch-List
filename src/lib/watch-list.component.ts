import { createViewChild } from '@angular/compiler/src/core';
import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridInputFormat } from './model/gridInputFormat';
import { CompleteNotification, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddPersonComponent } from './add-person/add-person.component';
import { OperationType } from './Enums/OperationType';
import { FaceSettingComponent } from './face-setting/face-setting.component';
import { ImportexcelComponent } from './importexcel/importexcel.component';
import { KendoGridComponent } from './kendo-grid/kendo-grid.component';
import { FieldsData, SearchResult } from './model/milvusSearchResult';
import { SearchOutputComponent } from './search-output/search-output.component';
import { ConfirmDialougeService } from './services/confirm-dialouge.service';
import { WatchListService } from './services/watch-list.service';
import { ImageSelectionDialogComponent } from './image-selection-dialog/image-selection-dialog.component';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonModalData, CommonComponentsComponent, CommonModalComponent } from '@i2v-systems/common-components';
import { Person, PersonEnrollmentComponent } from './person-enrollment/person-enrollment.component';
import { AttributesSearchComponent } from './attributes-search/attributes-search.component';
import { FormArray } from '@angular/forms';


interface PageNatedWatchlist {
  enrolledPersonCount: any;
  paginatedPersonData: any[];
}
interface SearchByImage {
  refrenceImage: string;
  person: any;
  facePoint: any;
  scores: number[];
}


export class CrudNotificationModel {

  constructor(operationType?: string, entityType?: string, objectList?: any[]) {
    this.operationType = operationType!;
    this.entityType = entityType!;
    this.entityList = objectList!;
  }

  operationType: string;
  entityType: string;
  entityList: any[];
}



@Component({
  selector: 'lib-WatchList',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})



export class WatchListComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @Output() openTimeline = new EventEmitter();
  @Output() notificationEmmitor = this.watchlistService.notificationemittor;
  isFilterOpen: boolean = false;
  data: any[] = [];
  searchByNameText = "";
  searchByLabelText = "";
  skip = 0;
  facePoints: any[] = [];
  loading: boolean = false;
  matchThreshold: number = 0;
  searchtext: string = '';
  @ViewChild("Grid") Grid: KendoGridComponent;
  @Input() pageLimit: number = 50;
  newRowsubject: Subject<any> = new Subject<any>();
  genderSearchText: string = '';
  noOfEnrollment: number = 0;
  TotalEnrollment: number = 0;
  isEnrolling: boolean = false;
  order: string = "asc";
  isWatchlistExist: boolean = false;
  // take input buttons and action callback for displaying in header
  @Input() headerButtons: any[] = [];
  @Output("HeaderButtonClick") HeaderButtonClick = new EventEmitter();
  attributeFilterData: any = {};
  totalImagesEnrollmentData: Person[] = [];
  countOfStaticFilter: number = 0;

  constructor(
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialougeService,
    public watchlistService: WatchListService, public toastr: ToastrService) {

    this.watchlistService.getSystemDetails().subscribe((data: any) => {
      if (data && data.matchingThreshold) {
        this.matchThreshold = data.matchingThreshold;
      }
    })
    this.watchlistService.getAllFacePoints().subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.facePoints = data;
      }
    });

    this.checkEnrollmentStatus();
  }
  async checkEnrollmentStatus() {
    const data = await this.watchlistService.getEnrollmentStatus().toPromise();
    if (data) {
      localStorage.setItem("isEnrollmentInProgress", "true");
      localStorage.setItem("isNotifierVisible", "true");
    }
    else {
      this.isEnrolling = false;
      localStorage.setItem("isEnrollmentInProgress", "false");
      localStorage.setItem("isNotifierVisible", "false");
    }
  }

  ngOnInit() {

    this.configuration.pageLimit = this.pageLimit;
    this.refreshData(this.skip);
    this.configuration.columnDefs = this.SelectCameraGridColumns;
    this.configuration.noHeader = true;
    this.configuration.pagination = true;
    this.configuration.isSpecific = true;
    this.configuration.visibleColumnState = this.SelectCameraGridColumns;
    this.configuration.VisibleColumnsList = this.SelectCameraGridColumns;

    this.watchlistService.$enrollmentDoneCount.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data != undefined) {
        this.isEnrolling = true;
        this.noOfEnrollment = data;
        if (data['count'] != undefined) {
          this.noOfEnrollment = data['count'];
        }
        if (data['length'] != undefined) {
          this.noOfEnrollment = data['length'];
        }
      }
    });
    this.watchlistService.$TotalEnrollmentCount.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data != undefined) {
        this.isEnrolling = true;
        this.TotalEnrollment = data;
      }
    });
    this.watchlistService.$enrollmentCompleted.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data > 0) {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: "Enrollment Completed",
            type: "sucess"
          });
        }
        else {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: "No Person Enrolled",
            type: "info"
          });
        }
        this.isEnrolling = false;
        this.TotalEnrollment = 0;
        this.noOfEnrollment = 0;
      }

    });
    this.watchlistService.$cancelEnrollmentStatus.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data != undefined) {
        this.isEnrolling = false;
        this.TotalEnrollment = 0;
        this.noOfEnrollment = 0;
        this.watchlistService.notificationemittor.next({
          source: 'watch-list',
          message: "Enrollment Cancelled",
          type: "error"
        });
        // this.toastr.show('Enrollment Cancelled', 'Alert',
        //   {
        //     messageClass: 'i2v-alert danger', disableTimeOut: false,
        //   })
      }
    });

    // refreshWatchList
    this.watchlistService.$refreshWatchList.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data != undefined) {
        this.refreshData(this.skip);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }

  pageNumber: number = 1;
  pageChange(skip: number) {
    this.skip = skip;
    this.refreshData(skip);
  }
  SelectCameraGridColumns = [
    {
      headerName: 'Image',
      field: 'image',
      type: "image",
      width: 150
    },
    {
      headerName: 'ProvidedImage',
      field: 'providedImage',
      type: "image",
      width: 150
    },
    {
      headerName: 'Name',
      field: 'personName',
      dataType: "text",
    },
    {
      headerName: 'Gender',
      field: 'gender',
      dataType: "text",
      width: 120
    },
    {
      headerName: 'Label',
      field: 'label',
      dataType: "text",
      width: 200
    },
    {
      headerName: 'Attributes',
      field: 'Attributes',
      dataType: "text",
      width: 200
    },

    {
      headerName: 'Camera Attached',
      field: 'videoSourceIds',
      dataType: "array",
    },
    {
      headerName: 'Added On',
      field: 'addedOn',
      dataType: "date",
      type: "date",
      cellRenderer: "dateRender",
      width: 200
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: 'buttonRenderer',
      icon: 'edit',
    }
  ];

  configuration: GridInputFormat = new GridInputFormat();

  refreshDataButtonClicked(skip) {
    this.Grid.SelectedRows = [];
    this.refreshData(skip)
  }

  refreshData(skip: number) {
    this.AllRowOnPageSelected = false;
    this.AllRowSelected = false;
    if (skip == 0 && this.Grid) {
      this.Grid.SelectedRows = [];
      this.Grid.kendoGrid.skip = 0;
    }
    this.watchlistService.getPersonsByPaginated(skip, this.pageLimit, this.searchByLabelText, this.searchByNameText, this.order).subscribe((data: any) => {
      console.log(data);
      if (data && data.paginatedPersonData.length > 0) {
        this.isWatchlistExist = true;
        this.setDataInKendo(data);

      }
      else {
        this.isWatchlistExist = false;
      }
    })
  }

  setDataInKendo(data: PageNatedWatchlist) {
    data.paginatedPersonData.forEach((item) => {
      if (item.facePoints) {
        item.providedImage = item?.facePoints[0]?.providedImage;
        item.image = this.getImageUrlOrBase64(item?.facePoints[0]?.image);

      }

    });
    this.configuration.length = data.enrolledPersonCount;
    this.data = data.paginatedPersonData;

    this.newRowsubject.next(new CrudNotificationModel(OperationType.Refresh, 'camera', data.paginatedPersonData));

  }

  ngAfterViewInit(): void {
    var dialog: any = document.getElementsByClassName('mat-form-field-wrapper');
    for (let x = 0; x < dialog.length; x++) {
      dialog[x].style.padding = "0px";
    }
  }

  onFileChange(evt: any) {
    this.loading = true;
    var file = evt.target.files;
    var element = document.getElementById('selectedFileName');
    element.innerHTML = file[0].name;
    this.loading = true;
    this.watchlistService.uploadFiles(file[0], file[0].name).subscribe((data: any) => {
      var image = "images/" + file[0].name;
      this.watchlistService.getEmbedding(image, true).subscribe((dataEmbedding: any) => {
        if (dataEmbedding && dataEmbedding.length > 0) {
          this.loading = false;
          var data: CommonModalData = {
            event: {
              component: ImageSelectionDialogComponent,
              embeddingArray: dataEmbedding
            },
            heading: "Search by image",
            showPreviousButton: false,
            showNextButton: false,
            showBackButton: false,
            width: '768px',
            height: '600px',
            footerButtons: [{
              title: 'Search results',
              Callback: 'onSearchButtonClick',
              basedOnChildTemplate: true,
              style: 'i2v-btn primary-default medium',
              disabledWith: 'checkConditions',
              ngIfWith: 'checkConditionsforSearch'
            },
            {
              title: 'Cancel',
              Callback: () => { this.closeDialog(imageSelectionDialog) },
              style: 'i2v-btn tertiary-default medium'
            }]
          };
          var imageSelectionDialog = this.dialog.open(CommonModalComponent, {
            panelClass: "custom-dialog-container",
            data: data
          });

          // imageSelectionDialog.afterClosed().subscribe((selectedPerson) => {
          //   if (selectedPerson) {
          //     this.watchlistService.getMatchingFaces(selectedPerson).subscribe((data: SearchByImage) => {
          //       if (data) {
          //         data.person.facePoints = data.facePoint
          //         if (this.dialog.openDialogs) {
          //           this.dialog.open(SearchOutputComponent, {
          //             position: { top: '50px' },
          //             panelClass: "custom-dialog-container",
          //             data: { matches: data.person, reference: "data:image/png;base64," + data.refrenceImage, score: data.scores }
          //           });
          //         }
          //         var x: any = (<HTMLElement>document.getElementById("uplaodImage"));
          //         x['value'] = "";
          //         (<HTMLElement>document.getElementById("uplaodImage")).blur();
          //       }

          //       else {
          //         this.watchlistService.notificationemittor.next({
          //           source: 'watch-list',
          //           message: 'No Related Image In Milvus DB',
          //           type: "error"
          //         });
          //         var x: any = (<HTMLElement>document.getElementById("uplaodImage"))
          //         x['value'] = "";
          //         (<HTMLElement>document.getElementById("uplaodImage")).blur();
          //         this.loading = false;
          //       }

          //     }, (err: any) => {
          //       if (err.error) {
          //         this.watchlistService.notificationemittor.next({
          //           source: 'watch-list',
          //           message: err.error,
          //           type: "error"
          //         });
          //       }
          //       var x: any = (<HTMLElement>document.getElementById("uplaodImage"))
          //       x['value'] = "";
          //       (<HTMLElement>document.getElementById("uplaodImage")).blur();
          //       this.loading = false;
          //     })
          //   }

          // })

        }
        else {
          this.loading = false;
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: "no person found in provided image",
            type: "error"
          });
        }

      },
        (error) => {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: error.error,
            type: "error"
          });
          this.loading = false;
        }).add(() => {
          // var x: any = document.getElementById('selectedFileName');
          // x.innerHTML = 'Select a file to Search';
          // x.blur();
          var x: any = document.getElementById('selectedFileName');
          x.innerHTML = 'Select a file to Search';
          x.blur();
          evt.target.value = null;
        });
    },
      (error) => {
        console.log(error); this.watchlistService.notificationemittor.next({
          source: 'watch-list',
          message: error.error,
          type: "error"
        });
        this.loading = false;
        var x: any = document.getElementById('selectedFileName');
        x.innerHTML = 'Select a file to Search';
        x.blur();
        evt.target.value = null;
      })

  }

  closeDialog(imageSelectionDialog): any {
    imageSelectionDialog.close();
  }

  async EnrollPersons() {
    await this.checkEnrollmentStatus();
    this.dialog.closeAll();
    var isEnrollmentInProgress = localStorage.getItem("isEnrollmentInProgress");
    if (isEnrollmentInProgress == "false") {
      var dialogRef = this.dialog.open(PersonEnrollmentComponent, {
        panelClass: "custom-dialog-container"
      });

      dialogRef.afterClosed().subscribe((data) => {
        this.refreshData(this.skip);
      });
    }
    else {
      this.watchlistService.notificationemittor.next({
        source: 'watch-list',
        message: "Enrollment in progress",
        type: "info"
      });
      //   this.toastr.show('Enrollment is already is progress', 'Alert',
      //     {
      //       messageClass: 'i2v-alert danger', disableTimeOut: false,
      //     })
      // }
    }
  }

  // uploadExcelToServerForEnrollment() {
  //   this.dialog.open(ImportexcelComponent, {
  //     disableClose: true,

  //   });
  // }

  async DeleteSelectedPersons() {
    var confirmationText = this.AllRowSelected ? "Are you sure you want to delete all person?" : "Are you sure you want to delete selected person?";
    var response = await this.confirmDialogService.openDialouge(confirmationText, "Delete", "Cancel")
    if (response) {
      if (this.AllRowSelected) {
        this.watchlistService.deleteAllPerson().subscribe(() => {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list.component',
            message: "Person Deleted Sucessfully",
            type: "sucess"
          });
          this.refreshData(this.skip);
        }, (error: any) => {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list.component',
            message: error.error,
            type: "error"
          });
        });
      }
      this.watchlistService.deleteSelectedPerson(this.Grid.SelectedRows).subscribe(() => {
        this.watchlistService.notificationemittor.next({
          source: 'watch-list.component',
          message: "Person Deleted Sucessfully",
          type: "sucess"
        });
        this.refreshData(this.skip);
      }, (error: any) => {
        this.watchlistService.notificationemittor.next({
          source: 'watch-list.component',
          message: error.error,
          type: "error"
        });
      });
    }
  }

  async onActionButtonClicked(data: any) {
    var field = data.field;
    var person = data.data;
    switch (field) {
      case 'timeline':
        var timelineData: any = {
          isTimeline: true,
          personName: person.personName,
          personId: person.id,
          personLabel: person.label
        }
        this.openTimeline.emit(timelineData);


        break;
      case 'edit':
        var event = JSON.parse(JSON.stringify(person))
        var dialogRef = this.dialog.open(FaceSettingComponent, {
          panelClass: "custom-dialog-container",
          data: {
            event: event,
            heading: "Edit Person",
          }
        });
        dialogRef.componentInstance.nextPersonEvent.subscribe((data) => {
          var index = this.data.findIndex(x => x == data);
          if (index == this.data.length - 1) {
            dialogRef.componentInstance.data.event = this.data[0];
          }
          else {
            dialogRef.componentInstance.data.event = this.data[index + 1];
          }
          dialogRef.componentInstance.setDataForTemplate();
        });
        dialogRef.componentInstance.prevPersonEvent.subscribe((data) => {
          var index = this.data.findIndex(x => x == data);
          if (index == 0) {
            dialogRef.componentInstance.data.event = this.data[this.data.length - 1];
          }
          else {
            dialogRef.componentInstance.data.event = this.data[index - 1];
          }
          dialogRef.componentInstance.setDataForTemplate();
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.refreshData(this.skip);
          }
        });
        break;
      case 'add':
        var event = person
        var dialogRef = this.dialog.open(FaceSettingComponent, {
          panelClass: "custom-dialog-container",
          data: {
            event: event,
            heading: "Add Person",
            addFace: true,
          }
        });

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.refreshData(this.skip);
          }
        });
        break;
      case 'delete':
        var response = await this.confirmDialogService.openDialouge("Are you sure you want to delete person?", "Delete", "Cancel")
        if (response) {
          this.watchlistService.deletePerson(person.id).subscribe(() => {
            var index = this.data.findIndex((item) => { return item.id == person.id });
            if (index > -1) {
              this.data.splice(index, 1);
            }
            this.watchlistService.notificationemittor.next({
              source: 'watch-list.service',
              message: "Deleted Successfuly",
              type: "sucess"
            });
          })
        }
        break;
    }
  }

  getImageUrlOrBase64(value: string) {
    try {
      // Decoding base64 string to verify if it's a valid base64 string
      atob(value);
      return "data:image/png;base64," + value;
    } catch (e) {
      return value;
    }
  }

  // cancelEnrollment() {
  //   this.watchlistService.cancelEnrollment().subscribe((data) => {
  //     this.TotalEnrollment = 0;
  //     this.noOfEnrollment = 0;
  //     this.isEnrolling = false;
  //   });
  // }

  getDataInAscending() {
    this.Grid.kendoGrid.skip = 0;
    this.order = "asc";
    this.refreshData(this.skip);

  }

  getDataInDescending() {
    this.Grid.kendoGrid.skip = 0;
    this.order = "desc";
    this.refreshData(this.skip);
  }

  //Invoked when we drag files in Upload Images
  dragOverHandler(ev: any) {
    this.onFileChange(ev);
  }

  //Invoked when we drop files in Upload Images
  dropHandler(ev: any) {
    this.onFileChange(ev);

  }

  //Invoked when we click on Browse button in Upload Images
  onBrowseClick(selectorName: string) {
    var x: any = document.getElementById(selectorName);
    x.click();
    // x.value = '';
  }

  //Invoked when we open filter options
  openFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  openMoreFilter() {
    var data: CommonModalData = {
      event: {
        component: AttributesSearchComponent,
        prevAttributeData: this.attributeFilterData
      },
      heading: "Search by Attributes",
      showPreviousButton: false,
      showNextButton: false,
      showBackButton: false,
      width: '768px',
      height: '600px',
      footerButtons: [
        {
          title: 'Search Person',
          Callback: 'searchResult',
          basedOnChildTemplate: true,
          style: 'i2v-btn primary-default medium',
          disabledWith: 'checkConditions',
          // ngIfWith: 'checkConditionsforSearch'
        },
        {
          title: 'Clear Filter',
          Callback: 'clearFilters',
          basedOnChildTemplate: true,
          style: 'i2v-btn tertiary-default medium'
        },]
    };
    var filterModel = this.dialog.open(CommonModalComponent, {
      panelClass: "custom-dialog-container",
      data: data
    });

    setTimeout(() => {
      filterModel.componentInstance.componentRef.instance.emittor.subscribe((data) => {
        if (data && Object.keys(data).length > 0) {
          console.log("Data from Child Template : " + data.attributesArray);
          this.getDataAsPerAttributes(data.attributesArray);
          filterModel.close();
          if (data.formData && Object.keys(data.formData).length > 0) {
            this.attributeFilterData = data.formData;
          }
          else {
            this.attributeFilterData = {}
          }
        }
      });
    }, 1000);


  }

  getDataAsPerAttributes(data: any) {
    var newData = JSON.stringify(data);
    // this.watchlistService.getPersonsByAttributes(data).subscribe((data: any) => {
    this.watchlistService.getPersonsByAttributes(this.skip, this.pageLimit, this.order, data).subscribe((data: any) => {
      if (data && data.paginatedPersonData.length > 0) {
        this.isWatchlistExist = true;
        this.setDataInKendo(data);
      }
      else {
        this.isWatchlistExist = false;
      }
    }),
      (error: any) => {
        this.watchlistService.notificationemittor.next({
          source: 'watch-list',
          message: error.error,
          type: "error"
        });
      };
  }
  get AttributeArray(): FormArray {
    return <FormArray>this.attributeFilterData.get('attributes');
  }

  get getStaticFilterCount() {
    var count = 0;

    if (this.searchByLabelText != "") {
      count++;
    }
    if (this.searchByNameText != "") {
      count++;
    }
    if (Object.keys(this.attributeFilterData).length != 0 && this.AttributeArray.controls.length > 0) {
      count++;
    }
    this.countOfStaticFilter = count;
    return count;
  }


  AllRowSelected: boolean = false;
  AllRowOnPageSelected: boolean = false;
  allCheckStatus(allChecked: boolean) {
    console.log("allChecked", allChecked)
    this.AllRowOnPageSelected = allChecked;
  }

  selectAll(select: boolean) {
    var e = { target: { checked: select } }
    this.Grid.selectAllRows(e)
    this.AllRowSelected = select;
  }

  onHeaderButtonClick(event: any) {
    var data = {
      button: event,
      allRowSelected: this.AllRowSelected,
      selectedRows: this.Grid.SelectedRows,

    }
    if (this.Grid.SelectedRows.length == 1) {
      data["attachedVideoSourceIds"] = this.data.find(x => x.id == this.Grid.SelectedRows[0]).videoSourceIds;
    }
    this.HeaderButtonClick.emit(data);
  }

}

