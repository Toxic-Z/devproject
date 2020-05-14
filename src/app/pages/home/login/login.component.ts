import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user';

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
    const data = {
      login: this.form.get('login').value,
      password: this.form.get('password').value
    };
    this.authService.signUp(data).then(
      () => {
        this.logIn();
        this.openSnackBar('Successfully created!');
      },
      () => {
        this.openSnackBar('This user exists!');
      }
    );
  }

  public logIn() {
    const data = {
      login: this.form.get('login').value,
      password: this.form.get('password').value
    };
    this.authService.logIn(data).then(
      (user: User) => {
        if (user.password === data.password) {
          this.openSnackBar('Successfully!');
          this.authService.isLoggedIn();
          this.authService.setCurrUser(data).then(
            () => {
              this.router.navigate(['dashboard']);
              location.reload();
            },
            error => {
              console.log(error);
              this.openSnackBar(`${error}`);
            }
          );
        } else {
          this.openSnackBar('Wrong user or password');
        }
      },
      error => {
        console.log(error);
        this.openSnackBar(error);
      }
    );
  }
}
