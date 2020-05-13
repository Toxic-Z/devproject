import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {User} from '../../../shared/interfaces/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    MatSnackBar
  ]
})
export class HomeComponent implements OnInit {
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
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  public signUp() {
    this.authService.signUp({
      login: this.form.get('login').value,
      password: this.form.get('password').value
    }).subscribe((res: boolean) => {
      if (res) {
        this.openSnackBar('Successfully created!', 'Done');
      } else {
        this.openSnackBar('This user exists!', 'Done');
      }
    });
  }

  public logIn() {
    this.authService.logIn({
      login: this.form.get('login').value,
      password: this.form.get('password').value
    }).subscribe((res: boolean) => {
      if (res) {
        this.openSnackBar('Successfully!', 'Done');
      } else {
        this.openSnackBar('Wrong user or password', 'Done');
      }
    });
  }
}
