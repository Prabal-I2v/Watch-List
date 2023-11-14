import { Component, OnInit, ViewEncapsulation, ViewChild, Inject, AfterViewInit, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { WatchListService } from '../services/watch-list.service';
import { ValidationService } from '../services/validation.service';


@Component({
  selector: 'app-face-setting',
  templateUrl: './face-setting.component.html',
  styleUrls: ['./face-setting.component.scss'],
})
export class FaceSettingComponent implements OnInit, AfterViewInit {
  storedEmbeddings = "";
  updatedEmbeddings = "";
  isLoading = false;
  public title: string = "Person Details";
  public person: any = {};
  personImage: string = "";
  showImage: string = "";
  embeddings: any[] = [];
  images: any[] = [];
  facesToRemove: any[] = [];
  addFace: boolean = false;
  prevDataofPerson: any = {};
  fullImageAsFace: boolean = false;
  Attributes: any;
  nextPersonEvent: EventEmitter<any> = new EventEmitter<any>();
  prevPersonEvent: EventEmitter<any> = new EventEmitter<any>();
  heading: string = "Person Details";
  AddFaceForm: FormGroup;
  attributesForm: FormGroup;
  valueTypes = ['String', 'Number', 'Boolean'];
  newKey: string;
  newValue: any;
  newValueType: string = 'String'; // Default value type
  ExistingKey: string;
  ExistingValue: any;
  ExistingValueType: string = 'String';
  addedAttributes: any = {};
  UniqueAttributes: any = [];

  constructor(public dialogRef: MatDialogRef<FaceSettingComponent>,
    private watchlistService: WatchListService, public validationsService: ValidationService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    if (data) {
      this.setDataForTemplate();
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
      dialogContent[x].style.margin = "10px 10px 0px 10px";
      dialogContent[x].style.padding = "0px";
    }
  }

  ngOnInit() {

    this.watchlistService.getUniqueAttributes().subscribe((data: any) => {
      if(data){
        this.UniqueAttributes = data;
        this.ExistingKey = data[0];
      }
    });

    this.AddFaceForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.validationsService.NameValidator]),
      label: new FormControl('', [Validators.required, this.validationsService.NameValidator]),
      gender: new FormControl('', [Validators.required, this.validationsService.GenderValidator])
    });

    this.attributesForm.valueChanges.subscribe(changes => {
      this.addedAttributes = {}
      changes['attributes'].forEach((change: any) => {
        this.addedAttributes[change.key] = change.value ;
      })
    });
  }

  onIconClick() {
    var x: any = document.getElementById("upload")
    x.click();
  }

  //change large img on html on btn clicks
  changeCurrentImage(val: number) {
    var index = this.embeddings.findIndex((embedding: any) => {
      return this.getImageUrlOrBase64(embedding.image) == this.showImage;
    })
    if (index + val == this.embeddings.length) {
      this.showImage = this.getImageUrlOrBase64(this.embeddings[0].image);
    } else if (index + val == -1) {
      this.showImage = this.getImageUrlOrBase64(this.embeddings[this.embeddings.length - 1].image);
    } else {
      this.showImage = this.getImageUrlOrBase64(this.embeddings[index + val].image);
    }
  }

  dragOverHandler(ev: any) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  // dropHandler(ev: any) {
  //
  //   // Prevent default behavior (Prevent file from being opened)
  //   ev.preventDefault();
  //
  //   var fileReader = new FileReader();
  //   //fileReader.onload = (event: any) => {
  //   //    this.licStr = event.target.result;
  //   //}
  //   fileReader.readAsText(ev.dataTransfer.files[0]);
  //   var dragLabel:any=document.getElementById("dragLabel");
  //   dragLabel.style.display = "none";
  //   var fileName:any=document.getElementById("fileName");
  //   fileName.innerHTML = ev.dataTransfer.files[0].name;
  // }


  //invoked when we click add more photos
  fileChange(evt: any) {
    var file = evt.target.files;
    this.watchlistService.uploadFiles(file[0], file[0].name)
      .subscribe(
        (data: any) => {
          console.log('success');
          this.getEmbedding("images/" + file[0].name);
        },
        (error: Error) => {
          console.log(error)
        })
  }


  //called when upload a new photo
  getEmbedding(personImage: any) {
    this.watchlistService.getEmbedding(personImage, true, this.fullImageAsFace).subscribe(
      (data: any) => {
        if (!data || data.length == 0) {
          this.watchlistService.notificationemittor.next({
            source: 'face-setting',
            message: "No Face Found",
            type: "error"
          });
          return;
        }
        data[0].image = data[0].img;
        data[0].img = "";
        data[0].providedImage = personImage;
        this.embeddings.push(data[0]);
        this.updatedEmbeddings = JSON.stringify(this.embeddings)
      })
  }

  save() {
    this.isLoading = true;

    var facePoints: any[] = [];
    this.embeddings.forEach((embed) => {
      if (!embed.personId) {
        embed.personId = this.person.id;

      }
      facePoints.push(embed);
    });
    this.person.facePoints = facePoints
    this.person._Attributes = JSON.stringify(this.addedAttributes);
    this.person.attributes = this.addedAttributes;
    this.watchlistService.addFaceswithperson(this.person).subscribe(() => {
      // if (this.facesToRemove.length > 0) {
      //   this.watchlistService.removeFaces(this.facesToRemove).subscribe(() => {

      //   });
      // }
      this.watchlistService.notificationemittor.next({
        source: 'face-setting',
        message: "Saved Successfuly",
        type: "sucess"
      });
      this.dialogRef.close(this.person);
    })
    // } else {
    //   if (this.person.id) {
    //     this.watchlistService.editPerson(this.person).subscribe(() => {
    //       this.watchlistService.notificationemittor.next({
    //         source: 'face-setting',
    //         message: "Saved Successfuly",
    //         type: "sucess"
    //       });
    //       this.dialogRef.close(this.person);
    //       // this.updatePersonListInDataGridService();
    //     });
    //   } else {
    //     this.watchlistService.addPerson(this.person).subscribe(() => {
    //       this.watchlistService.notificationemittor.next({
    //         source: 'face-setting',
    //         message: "Saved Successfuly",
    //         type: "sucess"
    //       });
    //       this.dialogRef.close(this.person);
    //       // this.updatePersonListInDataGridService();
    //     })
    //   }
    // }
  }


  //invoked when we remove any uploaded image
  removeEmbedding(index: number) {
    if (index > -1) {
      if (this.embeddings[index].id) {
        this.facesToRemove.push(this.embeddings[index]);
      }
      this.embeddings.splice(index, 1);
      this.updatedEmbeddings = JSON.stringify(this.embeddings);
    }
  }

  //invoked whenever a image is displayed on html
  getImageUrlOrBase64(value: string) {
    try {
      // Decoding base64 string to verify if it's a valid base64 string
      atob(value);
      return "data:image/png;base64," + value;
    } catch (e) {
      return value;
    }
  }

  //used to set large image when we click on any image
  showSelectedImage(image: any) {
    this.showImage = this.getImageUrlOrBase64(image);
  }

  //invoked when we click next person event
  onNextPersonEventClick(data: any) {
    this.nextPersonEvent.emit(data.event);
  }

  //invoked when we click prev person event
  onPrevPersonEventClick(data: any) {
    this.prevPersonEvent.emit(data.event);
  }

  //set data for template
  setDataForTemplate() {
    this.person = this.data.event;
    if (this.person._Attributes == "" || this.person._Attributes == null) {
      this.person._Attributes = "";
    }
    this.prevDataofPerson = JSON.parse(JSON.stringify(this.person));
    this.embeddings = [];
    this.storedEmbeddings = JSON.stringify(this.person.facePoints);
    this.person.facePoints.forEach((point: any) => {
      this.embeddings.push(point);
    })
    this.updatedEmbeddings = JSON.stringify(this.embeddings)
    this.personImage = this.getImageUrlOrBase64(this.person.image);
    this.showImage = this.personImage

    if (this.data && this.data.addFace) {
      this.addFace = true;
      this.title = "Add Face"
    }
    if (this.data.heading != undefined) {
      this.heading = this.data.heading;
    }

    this.attributesForm = this.fb.group({
      attributes: this.fb.array([]),
    });

    if (this.person._Attributes != "" && JSON.parse(this.person._Attributes) != undefined && this.person._Attributes != "{}") {
      var data = JSON.parse(this.person._Attributes)
      for(const key in data) {
        this.addAttribute(key, 'String', data[key]);
        this.addedAttributes[key] = data[key];
      };
    }
  }

  close() {
    this.dialogRef.close();
  }

  get checkData() {
    console.log(this.addedAttributes)
    console.log(this.person._Attributes)
    console.log(JSON.stringify(this.addedAttributes) == JSON.stringify(this.person._Attributes))
    // console.log(JSON.stringify(this.person) == JSON.stringify(this.prevDataofPerson))
    console.log(JSON.stringify(this.person) == JSON.stringify(this.prevDataofPerson) && JSON.stringify(this.addedAttributes) == JSON.stringify(this.person._Attributes))
    // console.log(<FormArray>this.attributesForm.get('attributes').value);
    return JSON.stringify(this.person) == JSON.stringify(this.prevDataofPerson) && JSON.stringify(this.addedAttributes) == JSON.stringify(this.person._Attributes)
  }

  private addAttributeGroup(key, valueType, value): FormGroup {
    var group = this.fb.group({
      key: [key],
      valueType: [valueType],
      value: [value]
    });
    this.newKey = '';
    this.newValue = '';
    // this.addedAttributes.push({[key] : value});
    return group;
  }
  //Add Fields
  addAttribute(key = this.newKey, valueType = this.newValueType, value = this.newValue): void {
    if (key == '' || value == '') {
      return;
    }
    else{
    this.AttributeArray.push(this.addAttributeGroup(key, valueType, value));
    }
  }

  //Remove Fields
  removeAttribute(index: number): void {
    this.AttributeArray.removeAt(index);
  }
  //Fields Array
  get AttributeArray(): FormArray {
    return <FormArray>this.attributesForm.get('attributes');
  }
}
