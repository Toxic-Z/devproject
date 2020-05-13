import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {log} from 'util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  constructor(
    private authService: AuthService,
    public router: Router
  ){}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  public navigate(type: string): void {
    switch (type) {
      case 'logout':
        this.authService.logOut();
        break;
      case 'admin':
        this.router.navigate(['admin']);
        break;
      case 'dashboard':
        this.router.navigate(['dashboard']);
        break;
    }
  }

}
