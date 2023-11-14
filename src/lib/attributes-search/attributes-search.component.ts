import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WatchListService } from '../services/watch-list.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-attributes-search',
  templateUrl: './attributes-search.component.html',
  styleUrls: ['./attributes-search.component.css']
})
export class AttributesSearchComponent implements OnInit {

  attributesForm: FormGroup;
  valueTypes = ['String', 'Number', 'Boolean'];
  conditions = {
    'Number': ['equals', 'not equals', 'greater than', 'smaller than'],
    'String': ['contains', 'not contains', 'equals', 'not equals'],
    // array: ['contains', 'not contains', 'equal', 'not equal'],
    'Boolean': ['equals'],
    // date: ['equal', 'not equal', 'greater than', 'smaller than'],
    // multiselect: ['equal', 'not equal'],
  };
  newKey: string = '';
  newValue: any = '';
  newValueType: string = 'String'; // Default value type
  newCondition: string = 'equals'; // Default value type
  addedAttributes: any = [];
  UniqueAttributes: any = [];
  ExistingKey: string;
  ExistingValue: any;
  ExistingValueType: string = 'String';
  emittor: EventEmitter<any> = new EventEmitter<any>();

  get checkFormData() {
    return this.addedAttributes.length > 0 && this.attributesForm.valid;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private watchlistService: WatchListService) {
    if (data.event.prevAttributeData && Object.keys(data.event.prevAttributeData).length > 0) {
      this.attributesForm = data.event.prevAttributeData;
    }
  }

  ngOnInit(): void {
    this.watchlistService.getUniqueAttributes().subscribe((data: any) => {
      if(data){
        this.UniqueAttributes = data;
        this.ExistingKey = data[0];
      }
    });
    
    if (this.attributesForm == undefined || this.attributesForm == null) {
      this.attributesForm = this.fb.group({
        attributes: this.fb.array([]),
      });
    }
    else {
      this.AttributeArray.controls.forEach((change: any) => {
        this.addedAttributes.push({ key: change.key, condition: change.condition, value: change.value })
      });
    }

    this.attributesForm.valueChanges.subscribe(changes => {
      this.addedAttributes = []
      changes['attributes'].forEach((change: any) => {
        this.addedAttributes.push({ key: (change.key), condition: change.condition, value: change.value })
      })
    });

  }

  private addAttributeGroup(key, valueType, condition, value): FormGroup {
    var group = this.fb.group({
      key: [key, Validators.required],
      valueType: [valueType, Validators.required],
      condition: [condition, Validators.required],
      value: [value, Validators.required]
    });
    this.newKey = '';
    this.newValue = '';
    // this.addedAttributes.push({[key] : value});
    return group;
  }
  //Add Fields
  addAttribute(key = this.newKey, valueType = this.newValueType, condition = this.newCondition, value = this.newValue): void {
    if (key == '' || value == '') {
      return;
    }
    else {
      this.AttributeArray.push(this.addAttributeGroup(key, valueType, condition, value));
    }
  }

  //Remove Fields
  removeAttribute(index: number): void {
    this.AttributeArray.removeAt(index);
  }
  //Fields Array
  get AttributeArray(): FormArray {
    return <FormArray>this.attributesForm?.get('attributes');
  }

  searchResult() {
    console.log(this.addedAttributes);
    if (this.addedAttributes.length > 0) {
      var data = { attributesArray: this.addedAttributes, formData: this.attributesForm };
      this.emittor.emit(data);
    }
  }

  clearFilters() {
    this.attributesForm.reset();
    this.AttributeArray.clear();
    this.addedAttributes = [];
    var data = { attributesArray: this.addedAttributes, formData: this.attributesForm };
    this.emittor.emit(data);
  }



  get checkConditions() {
    return this.AttributeArray.valid && this.addedAttributes.length > 0;
  }
}
