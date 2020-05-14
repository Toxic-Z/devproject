import {Component, ViewEncapsulation} from '@angular/core';
import {CommonService} from './shared/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  showLoader = false;
  title = 'fordev';
  constructor(
    private commonService: CommonService
  ) {
    this.commonService.checkLoaderState().subscribe((state: boolean) => {
      if (state !== null) {
        this.showLoader = state;
      }
    });
  }
}
