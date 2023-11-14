import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges } from "@angular/core";
import { Subject, } from "rxjs";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { GridInputFormat } from "../model/gridInputFormat";
import { GridComponent } from "@progress/kendo-angular-grid";
import { WatchListService } from "../services/watch-list.service";
declare var _: any;
declare var $: any;

@Component({
  selector: 'lib-kendo-grid',
  templateUrl: './kendo-grid.component.html',
  styleUrls: ['./kendo-grid.component.css']
})
export class KendoGridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  SelectedRows = []
  public gridView: any;
  skip = 0;
  @Input("idx") idx: string = "AgGrid";
  height: number = 350;
  @Input("data") Data: any[] = [];
  @Input("configuration") configuration: GridInputFormat = new GridInputFormat();
  @Input("newRowsubject") newRowsubject!: Subject<any>;
  @Output("onActionButtonClicked") onActionButtonClicked = new EventEmitter();
  @Output("pageChange") onPageChange = new EventEmitter();
  @ViewChild("kendoGrid") kendoGrid: GridComponent;
  @Output("allChecked") allChecked = new EventEmitter();
  public cameraNames: any[] = [];
  constructor(public dom: DomSanitizer, private watchListService: WatchListService) {
    console.log(this.Data);
  }
  ngOnChanges() {
    this.gridView = {
      data: this.Data,
      total: this.configuration.length
    };
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.watchListService.getVideoSources().subscribe((cameras:any) => {
      cameras.forEach((item:any, index:any) => {
        if (item && item.name != "") {
          item.checked = false;
          this.cameraNames.push(item);
        }
      });
    });
  }


  public onSelectRow(event) {
    console.log(event, this.SelectedRows);

    if (this.SelectedRows.length == 0) {
      this.SelectedRows = [];
      this.allChecked.emit(true);
    }

    // if deselect event is fired
    // if (event.deselectedRows.length > 0) {
    //   this.allChecked.emit(false);
    // }

    // if (event.selectedRows && event.selectedRows.length > 0) {
    //   if (event.shiftKey && event.ctrlKey) {
    //     this.selectAll = true;
    //     this.selectedIds = [];
    //     this.gridView.data.forEach((row) => {
    //       this.selectedIds.push(row.id);
    //     })
    //   }
    //   event.selectedRows.forEach(item => {
    //     selected.push(item.dataItem);
    //   });
    //   if (event.ctrlKey || event.shiftKey) {
    //     if (selected.length == this.gridView.total) {
    //       this.SelectedRows = [];
    //     }
    //     selected.forEach(selItem => {
    //       this.SelectedRows.push(selItem);
    //     });
    //   } else {
    //     this.SelectedRows = selected;
    //   }

    // } else {
    //   this.selectAll = false;
    //   if (event.shiftKey && event.ctrlKey) {
    //     this.selectedIds = [];
    //     this.SelectedRows = [];
    //   }
    //   if (event.deselectedRows && event.deselectedRows.length > 0) {
    //     event.deselectedRows.forEach((row) => {
    //       var i = this.SelectedRows.findIndex((item) => { return item.dataItem.id == row.dataItem.id });
    //       if (i > -1) {
    //         this.SelectedRows.splice(i, 1);
    //       }
    //     });
    //   }
    // }
    // this.onCheckboxClick.emit(event.selectedRows);
  }

  onActionButtonClick(field: any, rowId: any) {
    var data = this.Data.find(item => {
      return item.id == rowId;
    });

    var data = this.Data.find(item => {
      return item.id == rowId;
    });
    var data: any = { field: field, data: data, id: rowId }
    this.onActionButtonClicked.emit(data);

  }

  GetFieldValue(row: any, field: any) {
    var value: any;
    if (field.includes(".")) {
      var temp = field.split(".");
      value = row;
      temp.forEach((item: any) => {
        if (value) {
          value = value[item];
        }
      });
    } else {
      value = row[field];
    }
    try {
      // Decoding base64 string to verify if it's a valid base64 string
      atob(value);
      return "data:image/png;base64," + value;
    } catch (e) {
      return value;
    }
  }

  SetAttachedCamera(VideoSourceIds: any) {
  
    // return list of camera names using this.cameraNames
    var cameraNames: any[] = [];
    if (VideoSourceIds) {
      VideoSourceIds.forEach((id: any) => {
        var camera = this.cameraNames.find((item) => { return item.id == id });
        if (camera) {
          cameraNames.push(camera.name);
        }
      });
    }
    return cameraNames
  }

  UnixToDateConverter(unix: any) {
    return moment(unix).format("Do MMMM YYYY, h:mm:ss a");
    //var date = new Date(unix);
    //return date.toLocaleString();
  }

  public pageChange(event: any) {
    this.skip = event.skip;
    //if (this.Data.length > (this.skip + event.take)) {
    //  this.gridView = {
    //    data: this.Data.slice(this.skip, this.skip+ event.take),
    //    total: this.configuration.length
    //  }
    //} else {
    this.onPageChange.emit(this.skip);
    //}
  }
  allRowsSelected: boolean = false;
  rowsSelected: number[] = [];

  selectAllRows(e): void {
    if (e.target.checked) {
      this.allRowsSelected = true;
      this.SelectedRows = this.Data.map(o => o.id);
    } else {
      this.allRowsSelected = false;
      this.SelectedRows = [];
    }
    this.allChecked.emit(this.allRowsSelected);
    console.log(this.SelectedRows);
    console.log(this.allRowsSelected);
  }
  onImgError(event) { 
    event.target.src = 'assets/no-image.jpg';
  }
}































