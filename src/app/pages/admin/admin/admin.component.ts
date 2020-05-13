import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Observable} from 'rxjs';
import {User} from '../../../shared/interfaces/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  currUser: User;
  constructor(
    private authService: AuthService
  ) {
    this.currUser = this.authService.fetchCurrentUser();
  }

  ngOnInit(): void {
  }

}
