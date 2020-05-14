import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    MatSnackBar
  ]
})
export class LoginComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  form = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  hide = true;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
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

  public signUp() {
    this.authService.signUp({
      login: this.form.get('login').value,
      password: this.form.get('password').value
    }).then(
      (rr) => {
        console.log(rr);
        this.openSnackBar('Successfully created!');
      },
      () => {
        this.openSnackBar('This user exists!');
      }
    );
  }

  public logIn() {
    this.authService.logIn({
      login: this.form.get('login').value,
      password: this.form.get('password').value
    }).subscribe((res: boolean) => {
      if (res) {
        this.openSnackBar('Successfully!');
      } else {
        this.openSnackBar('Wrong user or password');
      }
    });
  }
}
