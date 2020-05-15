import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  currUser: User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.fetchCurrentUser().then(
      user => this.currUser = user[0]
    );
  }

  ngOnInit(): void {
  }

  public toDashboard(): void {
    this.router.navigate(['dashboard']);
  }
}
