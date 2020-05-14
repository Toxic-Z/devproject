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

  public signUp(data: User): Promise<any> {
    return this.dbService.add('users', data);
  }

  public logOut(): void {
    this.currentUser = null;
    this.isLog.next(false);
    this.isLogBool = false;
    this.router.navigate(['']);
  }

  public logIn(data: User): Observable<boolean> {
    const index = this.users.findIndex((u: User) => u.login === data.login);
    if (index < 0) {
      return of(false);
    } else if (this.users[index].password === data.password) {
      this.currentUser = data;
      this.isLog.next(true);
      this.isLogBool = true;
      return of(true);
    } else {
      return of(false);
    }
  }

  public fetchCurrentUser(): User {
    return this.currentUser;
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLog.asObservable();
  }
}
