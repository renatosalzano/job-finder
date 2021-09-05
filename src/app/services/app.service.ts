import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public input_value = 'Italy';
  public show_src_bar: boolean = false;

  toggle_src_bar() {
    this.show_src_bar = !this.show_src_bar;
  }
}
