import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  public settings = 'location=italy';
  public country_code = 'it';
  public input_value = 'Italy';
  public datalist: any[] = [];
  public show_src_bar: boolean = false;
  public countries: any[] = [];
  public cities: any[] = [];
  // paginator
  public page_count = 0;
  public page_index = 1;
  // spinner var
  public city_loading = false;
  public is_loading = false;

  public page_evt(type: string) {
    switch (true) {
      case type === 'next':
        if (this.page_index === this.page_count) return;
        this.page_index++;
        window.scrollTo(0, 0);
        return this.fetch_data(this.settings, this.page_index);
      case type === 'prev':
        if (this.page_index === 1) return;
        window.scrollTo(0, 0);
        this.page_index--;
        return this.fetch_data(this.settings, this.page_index);
      default:
        return;
    }
  }

  constructor(public http: HttpClient) {}

  // themuse api stuff

  update_country(evt: any) {
    let value = evt.option.value;
    this.country_code = this.countries
      .filter((country) => country.name.includes(value))[0]
      .code.toLowerCase();
  }

  update_settings(value: string) {
    return this.fetch_data(value, this.page_index);
  }

  toggle_src_bar() {
    this.show_src_bar = !this.show_src_bar;
  }

  fetch_data(settings: string, index: number) {
    this.is_loading = true;
    const url = `https://www.themuse.com/api/public/jobs?${settings}&category=Software%20Engineer&page=${index}`;

    this.http.get(url).subscribe(
      (res: any) => {
        this.datalist = res.results;
        this.page_count = res.page_count;
        this.is_loading = false;
      },
      (err: any) => {
        console.warn(err);
        this.is_loading = false;
      }
    );
  }

  get_countries() {
    const path = '../../assets/countries.json';
    this.http.get(path).subscribe((res: any) => {
      this.countries = res;
    });
  }

  // geonames api for city form autocomplete

  get_cities(query: string) {
    let username = ''; // your geonames username
    this.city_loading = true;
    const url = `http://api.geonames.org/searchJSON?formatted=true&maxRows=10&q=${query}&lang=en&username=${
      username || 'test'
    }&style=short&country=${this.country_code}`;
    this.http.get(url).subscribe(
      (res: any) => {
        this.cities = res.geonames;
        this.city_loading = false;
      },
      (err: any) => {
        console.warn(err);
        this.city_loading = false;
      }
    );
  }
}
