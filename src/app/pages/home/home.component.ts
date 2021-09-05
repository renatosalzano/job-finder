import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../services/app.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // paginator var
  public index = this.api.req.page_index;
  public end_index = this.api.page_count;

  constructor(
    public http: HttpClient,
    public app: AppService,
    public api: ApiService
  ) {}

  ngOnInit(): void {}

  page_evt(type: any) {
    if (type == 'next') {
      if (this.index === this.end_index) return;
      this.index++;
      window.scrollTo(0, 0); // reset scroll position
    }
    if (type == 'prev') {
      if (this.index == 1) return;
      this.index--;
      window.scrollTo(0, 0);
    }
    this.api.update_user_search({ page_index: this.index });
  }
}
