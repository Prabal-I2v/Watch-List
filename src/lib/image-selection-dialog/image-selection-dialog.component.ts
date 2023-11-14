import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WatchListService } from '../services/watch-list.service';
import { GridInputFormat } from '../model/gridInputFormat';
import { CollectionType } from '../Enums/CollectionType';

interface SearchByImage {
  referenceImage: string;
  person: any;
  personName : string;
  gender : string;
  label : string;
  addedOn : number;
  facePoint: any;
  scores: number;
}

@Component({
  selector: 'lib-image-selection-dialog',
  templateUrl: './image-selection-dialog.component.html',
  styleUrls: ['./image-selection-dialog.component.scss']
})
export class ImageSelectionDialogComponent implements OnInit {
  selectedImage: any
  embeddingDatas: any;
  loading: boolean = false;
  isfirstTimeSearch: boolean = true;
  kendoData : SearchByImage[] = [];
  skip = 0;
  @Input() pageLimit: number = 50;
  configuration: GridInputFormat = new GridInputFormat();
  matchPercentage : number = 10;
  SelectCameraGridColumns = [
    {
      headerName: 'Top Results',
      field: 'referenceImage',
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
      width: 150
    },
    {
      headerName: 'Match%',
      field: 'scores',
      dataType: "text",
      width: 150
    },
    {
      headerName: 'Label',
      field: 'label',
      dataType: "text",
      width: 200
    }, {
      headerName: 'Enrolled On',
      field: 'addedOn',
      dataType: "date",
      type: "date",
      cellRenderer: "dateRender"
    },

  ];
  isDataExist: boolean = false;
  get checkConditions(): boolean{
    if(this.selectedImage && this.matchPercentage>0){
      return true;
    }
    else{
      return false;
    }
  }

  get checkConditionsforSearch(): boolean{
    if(this.isfirstTimeSearch){
      return true;
    }
    else{
      return false;
    }
  }

  

  constructor(public dialogRef: MatDialogRef<ImageSelectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public watchlistService: WatchListService, public dialog: MatDialog) {
    if (data.event.embeddingArray && data.event.embeddingArray.length > 0) {
      this.embeddingDatas = data.event.embeddingArray;
    }
  }

  pageNumber: number = 1;
  pageChange(skip: number) {
    this.skip = skip;
  }
  ngOnInit(): void {
    this.configuration.pageLimit = this.pageLimit;
    this.configuration.columnDefs = this.SelectCameraGridColumns;
    this.configuration.noHeader = true;
    this.configuration.pagination = true;
    this.configuration.isSpecific = true;
    this.configuration.length = this.kendoData.length;
  }

  onSearchButtonClick() {
    // this.dialogRef.close(this.selectedImage);
    if (this.selectedImage) {
      this.loading = true;
      this.isDataExist = false;
      this.watchlistService.getMatchingFaces(this.selectedImage, this.matchPercentage, CollectionType.enrollmentCollectionName).subscribe((data: SearchByImage[]) => {
        if (data && data.length > 0) {
          this.isDataExist = true;
          console.log(data);
          this.isDataExist = true;
          this.kendoData = data;
          this.loading = false;
          this.isfirstTimeSearch = false;
        }
        else {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: 'No Related Image In Milvus DB',
            type: "error"
          });

          this.loading = false;
          this.isfirstTimeSearch = false;
        }
      }, (err: any) => {
        if (err.error) {
          this.watchlistService.notificationemittor.next({
            source: 'watch-list',
            message: err.error,
            type: "error"
          });
        }
        this.loading = false;
        this.isfirstTimeSearch = false;
      })
    }
  }

  ngOnChanges() {

  }

  selectImage(embedding: any) {
    this.selectedImage = embedding;
  }
}
