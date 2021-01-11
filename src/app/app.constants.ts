import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { of } from "rxjs";

export interface IClientData {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordValidation: string;
  friends: IClientFriend[];
}

export interface IClientFriend {
  name: string;
  email: string;
}

export enum FORM_CONSTANTS {
  ID = "id",
  NAME = "name",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_VALIDATION = "passwordValidation",
  FRIENDS = "friends",
}

export function createFormControl(
  value: any,
  validators: any[] = [],
  disabled?: boolean,
  asyncValidators?: any
): FormControl {
  return new FormControl({ value, disabled }, validators, asyncValidators);
}

export function checkIfInUseApiMocked(email) {
  return of(
    ["testas@testas.lt", "deivis@deivis.com"].includes(email) ? true : false
  );
}

export function checkPasswords(group: FormGroup) {
  let pass = group.get(FORM_CONSTANTS.PASSWORD).value;
  let confirmPass = group.get(FORM_CONSTANTS.PASSWORD_VALIDATION).value;

  return pass === confirmPass ? null : { notSame: true };
}

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

export function noFriendsAddedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];

      if (control.value) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        noFriendsAdded: true,
      };
    }

    return null;
  };
}
