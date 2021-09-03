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
}
