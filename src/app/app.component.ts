import {
  checkIfInUseApiMocked,
  checkPasswords,
  createFormControl,
  FORM_CONSTANTS,
  IClientData,
  IClientFriend,
  CustomErrorStateMatcher,
  noFriendsAddedValidator,
} from "./app.constants";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  FORM_CONSTANTS = FORM_CONSTANTS;
  title = "angular-forms";
  form: FormGroup;
  matcher = new CustomErrorStateMatcher();

  formData: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  fillForm() {
    const client = {
      id: 1,
      name: "Deivis",
      email: "testukas@testukas.lt",
      password: "123456",
      passwordValidation: null,
      friends: [
        {
          name: "Jonas",
          email: "jonas@jonas.lt",
        },
        {
          name: "Juozas",
          email: "juozas@gmail.lt",
        },
      ],
    };
    this.form = this.createForm(client);
  }

  createForm(item: IClientData = null) {
    return this.fb.group(
      {
        [FORM_CONSTANTS.ID]: createFormControl(item && item.id ? item.id : 0),
        [FORM_CONSTANTS.NAME]: createFormControl(item && item.name),
        [FORM_CONSTANTS.EMAIL]: createFormControl(
          item && item.email,
          [Validators.email],
          false,
          [this.inUseAsyncValidator(checkIfInUseApiMocked)]
        ),
        [FORM_CONSTANTS.PASSWORD]: createFormControl(item && item.password),
        [FORM_CONSTANTS.PASSWORD_VALIDATION]: createFormControl(
          item && item.passwordValidation
        ),
        [FORM_CONSTANTS.FRIENDS]: this.fb.array(
          item && item.friends
            ? item.friends.map((friend) => this.createFriendForm(friend))
            : [],
          noFriendsAddedValidator()
        ),
      },
      { validator: checkPasswords }
    );
  }

  submitForm() {
    console.log(this.form);
    this.formData = this.form.getRawValue();
  }

  addFriendToArray() {
    (this.form.get(FORM_CONSTANTS.FRIENDS) as FormArray).push(
      this.createFriendForm()
    );
  }

  getFriendsFormArray() {
    return this.form.get(FORM_CONSTANTS.FRIENDS) as FormArray;
  }

  removeFromArray(index) {
    (this.form.get(FORM_CONSTANTS.FRIENDS) as FormArray).removeAt(index);
  }

  createFriendForm(item?: IClientFriend) {
    return this.fb.group({
      [FORM_CONSTANTS.NAME]: createFormControl(item && item.name),
      [FORM_CONSTANTS.EMAIL]: createFormControl(item && item.email, [
        Validators.email,
      ]),
    });
  }

  inUseAsyncValidator = (checkIfInUseApiMocked) => {
    return (input: FormControl) => {
      return checkIfInUseApiMocked(input.value).pipe(
        map((res) => {
          return res ? { userExist: true } : null;
        })
      );
    };
  };
}
