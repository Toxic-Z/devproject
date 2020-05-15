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
    gender: new FormControl('m',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1)]),
    salary: new FormControl(null,
      [
        Validators.required,
        Validators.min(500),
        Validators.max(5000000)]),
    position: new FormControl(null,
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15)]),
    city: new FormControl(null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)]),
    street: new FormControl(null,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)]),
    addN: new FormControl(null,
      [
        Validators.maxLength(3)]),
    email: new FormControl(null,
      [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.maxLength(30)]),
    houseN: new FormControl(null,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(9999)])
  });
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router
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

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }
  public onclick(type: string) {
    if (type === 'reset') {
      this.form.reset();
    }
    if (type === 'save') {
      const value: Employee = {
        name: this.form.get('name').value,
        position: this.form.get('position').value,
        salary: this.form.get('salary').value,
        gender: this.form.get('gender').value,
        contactInfo: {
          email: this.form.get('email').value,
          address: {
            city: this.form.get('city').value,
            addN: this.form.get('addN').value,
            street: this.form.get('street').value,
            houseN: this.form.get('houseN').value
          }
        },
        id: Math.random()
      };
      value.addDate = new Date();
      this.apiService.createEmployee(value).then(
        () => {
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
