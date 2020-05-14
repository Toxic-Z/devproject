import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: User[] = [
    {
      login: 'admin@admin',
      password: '123456'
    }
  ];
  isLogBool: boolean;
  isLog: Subject<boolean> = new Subject();
  currentUser: User;
  mockedUsers: Subject<User[]> = new Subject();

  constructor(
    private dbService: NgxIndexedDBService,
    private router: Router
  ) {
    this.mockedUsers.next(this.users);
  }

  public clearDb(name: string) {
    this.dbService.clear(name).then(
      () => {
        console.log('Successfully cleaned!');
      },
      error => {
        console.log(error);
      }
    );
  }

  public signUp(data: User): Promise<any> {
    this.clearDb('currUser');
    return this.dbService.add('users', data);
  }

  public logOut(): void {
    this.currentUser = null;
    this.isLog.next(false);
    this.isLogBool = false;
    this.clearDb('currUser');
    this.router.navigate(['']);
  }

  public logIn(data: User): Promise<any> {
    this.clearDb('currUser');
    return this.dbService.getByIndex('users', 'login', data.login);
  }

  public setCurrUser(user: User): Promise<any> {
    return this.dbService.add('currUser', user);
  }

  public fetchCurrentUser(): Promise<any> {
    return this.dbService.getAll('currUser');
  }

  public isLoggedIn(): Observable<boolean> {
    this.dbService.getAll('currUser').then(
      (user: User[]) => {
        if (user.length) {
          this.isLog.next(true);
          this.isLogBool = true;
        } else {
          this.isLog.next(false);
          this.isLogBool = false;
        }
      }
    );
    return this.isLog.asObservable();
  }
}
