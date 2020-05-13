import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private showLoader: Subject<boolean> = new Subject<boolean>();
  constructor() {}

  public changeLoaderVisibility(state: boolean): void {
    setTimeout(() => {
      this.showLoader.next(state);
    }, 0);
  }

  public dateToMoment(date: Date): string {
    return moment(date).format('DD-MM-YYYY | HH-mm');
  }

  public checkLoaderState(): Observable<boolean> {
    return this.showLoader.asObservable();
  }

}
