import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CommonService} from '../../../shared/services/common.service';
import {Employee} from '../../../shared/interfaces/employee';
import {ApiService} from '../../../shared/services/api.service';

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
  isLoggedIn: Observable<boolean>;
  files: any = [];
  form = new FormGroup({
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
    phone: new FormControl(null,
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(10)]),
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
  });
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Done', {
      duration: 2000,
    });
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

  // public addPhone() {
  //   this.form.addControl(`phone${this.phoneIndex}`, new FormControl(null,
  //     [
  //       Validators.required,
  //       Validators.minLength(9),
  //       Validators.maxLength(10)]));
  //   this.phoneIndex++;
  // }

  public onclick(type: string) {
    if (type === 'reset') {
      this.form.reset();
      this.files = [];
    }
    if (type === 'save') {
      const value: Employee = {
        name: this.form.get('name').value,
        email: this.form.get('email').value,
        phone: this.form.get('phone').value,
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
