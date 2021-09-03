import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public http: HttpClient, public data: DataService) {}

  ngOnInit(): void {
    this.data.fetch_data(this.data.settings, this.data.page_index);
  }
  date(value: string) {
    let date = new Date(value);
    let month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let date_parsed = `${date.getDate()} ${
      month[date.getMonth() + 1]
    } ${date.getFullYear()} `;
    return date_parsed;
  }
}
