import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';
import { Employee } from '../../../shared/interfaces/employee';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    MatSnackBar
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  public isLoggedIn: Observable<boolean>;
  public files: any = [];
  public form: FormGroup;
  public phoneList: FormArray;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.form = this.fb.group(({
      name: new FormControl(null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)]),
      email: new FormControl(null,
        [
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(30)]),
      phone: this.fb.array([this.createPhone()]),
      age: new FormControl(null,
        [
          Validators.required,
          Validators.min(14),
          Validators.max(100)]),
      photo: new FormControl(null,
        [
          Validators.required]),
      resume: new FormControl(null,
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(300)])
    }));
    this.phoneList = this.form.get('phone') as FormArray;
  }

  public getPhonesFormGroup(index): FormGroup {
    this.phoneList = this.form.get('phone') as FormArray;
    return this.phoneList.controls[index] as FormGroup;
  }

  get phoneFormGroup(): FormArray {
    return this.form.get('phone') as FormArray;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Done', {
      duration: 2000,
    });
  }

  public addNumber() {
    if ((document.getElementById('newNumber') as HTMLInputElement).value.length === 9 ||
      (document.getElementById('newNumber') as HTMLInputElement).value.length === 10) {
      this.phoneList.push(this.createPhone(
        (document.getElementById('newNumber') as HTMLInputElement).value));
      (document.getElementById('newNumber') as HTMLInputElement).value = '';
    } else {
      this.openSnackBar('Phone number should be from 9 to 10 symbols length');
    }
  }

  public removeNumber(index) {
    this.phoneList.removeAt(index);
  }

  public uploadFile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      Object.keys(fileList).map((i) => {
          this.files.push(fileList[i]);
      });
    }
  }

  public deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  public createPhone(value: string = null): FormGroup {
    return this.fb.group({
      number: [value, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(10)]]
    });
  }
  public onclick(type: string) {
    if (type === 'reset') {
      this.form.reset();
      this.files = [];
    }
    if (type === 'save') {
      const phones: string[] = [];
      this.form.get('phone').value.forEach(val => {
        phones.push(val);
      });
      const value: Employee = {
        name: this.form.get('name').value,
        email: this.form.get('email').value,
        phone: phones,
        photo: this.files,
        age: this.form.get('age').value,
        resume: this.form.get('resume').value,
        id: Math.random()
      };
      value.addDate = new Date();
      this.apiService.createEmployee(value).then(
        () => {
          this.files = [];
          this.form.reset();
          this.openSnackBar('Created successfully!');
        },
        error => {
          this.openSnackBar(`Error: ${error}`);
        }
      );
    }
  }
}
