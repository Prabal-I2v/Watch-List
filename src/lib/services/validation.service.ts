import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  NameValidator(control: AbstractControl) {
    var name: any = control.value;
    if (name == null) {
      return null;
    }
    if (name.length < 0 || name.length > 30) {
      return { 'invalidName': true };
    }
    const regex = new RegExp('^[a-zA-Z0-9_\\-\\+]*$');
    const valid = regex.test(name);
    if (valid)
      return null;
    else
      return { 'invalidName': true };

  }

  LabelValidator(control: AbstractControl) {
    var label: any = control.value;
    if (label == null) {
      return null;
    }
    if (label.length < 0 || label.length > 30) {
      return { 'invalidLabel': true };
    }
    const regex = new RegExp('^[a-zA-Z0-9_\\-\\+]*$');
    const valid = regex.test(label);
    if (valid)
      return null;
    else
      return { 'invalidLabel': true };

  }

  tempLabelValidator(control: AbstractControl) {
    var label: any = control.value;
    if (label == null || label == "") {
      return null;
    }
    if (label.length < 0 || label.length > 30) {
      return { 'invalidLabel': true };
    }
    const regex = new RegExp('^[a-zA-Z0-9_\\-\\+]*$');
    const valid = regex.test(label);
    if (valid)
      return null;
    else
      return { 'invalidLabel': true };

  }

  UrlValidator(control: AbstractControl) {
    if (control.value == null || control.value == "") {
      return null;
    }
    if (control.value == "localhost") {
      return null;
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(control.value)) {
      return null;
    } else {
      return { "invalidUrl": true };
    }
  }
  PortValidator(control: AbstractControl) {
    if (control.value == null || control.value == "") {
      return null;
    }
    if (/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(control.value)) {
      return null;
    }
    else {
      return { "invalidPort": false };
    }
  }
  GenderValidator(control: AbstractControl) {
    var gender = control.value;
    if(gender == null || gender == "" || gender.toLowerCase() == "select"){
      return { 'invalidGender': true };
    }
    return null;
  }

}
