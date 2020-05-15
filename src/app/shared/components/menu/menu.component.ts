import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  public navigate(type: string): void {
    switch (type) {
      case 'root':
        this.router.navigate(['']);
        break;
      case 'login':
        this.router.navigate(['login']);
        break;
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
