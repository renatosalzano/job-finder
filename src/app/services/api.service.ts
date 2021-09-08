import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Job, Request } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public show_src_bar: boolean = false;
  public is_loading: boolean = false;
  public no_result: boolean = false;
  // themuse api var
  public location = '&location=italy';
  public levels = '';
  public page_count: number;
  public jobs_result$: Observable<any[]>;

  // geonames api var
  public query = '';
  public username = environment.geonamesUSER || 'test';
  public country_code = 'it';
  public countries: any[];

  public req: Request = {
    location: '',
    level: '',
    page_index: 1,
  };

  public user_search_subject = new BehaviorSubject(this.req);

  constructor(private http: HttpClient) {
    // user search
    this.user_search_subject.subscribe((obj) => {
      this.is_loading = true;
      this.jobs_result$ = this.get_jobs(obj).pipe(
        map((res: any) => {
          this.page_count = res.page_count;
          this.is_loading = false;
          this.no_result = false;
          if (res.results.length == 0) {
            this.no_result = true;
          }

          return res.results;
        })
      );
    });
  }

  update_user_search(update: Partial<Request>) {
    const obj: any = { ...this.user_search_subject.value, ...update };

    console.log(obj);
    return this.user_search_subject.next(obj);
  }

  get_jobs(obj: any) {
    return this.http.get<Job>(
      `${environment.themuseAPI}jobs?${obj?.location}${obj?.level}&category=Software%20Engineer&page=${obj?.page_index}`
    );
  }

  /* 
    geonames API
  */

  update_country_code(evt: any) {
    let value = evt.option.value;
    this.country_code = this.countries
      .filter((country) => country.name.includes(value))[0]
      .code.toLowerCase();
    console.log(this.country_code);
  }

  get_cities(value: any) {
    let query = value.toLowerCase().trim();
    /* 
    APIURL=true&maxRows=10&q=[[VALUE]]&lang=en&username=[[USERNAME]]&style=short&country=[[COUNTRY CODE]];
    */
    return this.http.get(
      `${environment.geonamesAPI}${
        environment.geonamesUSER || 'test'
      }&q=${query}&country=${this.country_code}`
    );
  }

  get_countries() {
    const countries = '../../assets/countries.json';
    return this.http.get(countries).subscribe((res: any) => {
      this.countries = res;
    });
  }
}
