import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private loading = new BehaviorSubject<boolean>(false);
  $obsloading = this.loading.asObservable();

  show() {
    this.loading.next(true);
  }
  hide() {
    this.loading.next(false);
  }
}
